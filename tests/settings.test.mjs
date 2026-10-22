import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(process.env.EFFORT_SLIDER_SOURCE || new URL('../client.js', import.meta.url), 'utf8');
const preferences = source.slice(source.indexOf('    const PREF_COLOR ='), source.indexOf('    // Current theme snapshots'));
const rows = source.slice(source.indexOf('    const PrefRow ='), source.indexOf("    ctx.slots.inject('settings.general.item'", source.indexOf('    const PrefRow =')));

// Runs the real preference hooks and row callbacks, with hook effects and
// browser events simulated. It does not exercise browser DOM or accessibility APIs.
function harness({ storage = 'available' } = {}) {
  let active;
  const values = new Map();
  const listeners = new Set();
  const writes = [];
  const localStorage = storage === 'missing' ? undefined : {
    getItem(key) {
      if (storage === 'blocked') throw new Error('storage unavailable');
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      if (storage === 'blocked' || storage === 'read-only') throw new Error('storage write unavailable');
      writes.push([key, value]);
      values.set(key, value);
    },
  };
  const window = {
    addEventListener(type, listener) { assert.equal(type, 'storage'); listeners.add(listener); },
    removeEventListener(type, listener) { assert.equal(type, 'storage'); listeners.delete(listener); },
  };
  const React = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useState(initial) {
      const view = active, at = view.stateIndex++;
      if (!(at in view.states)) view.states[at] = initial;
      return [view.states[at], (next) => {
        assert(!view.unmounted, 'must not update an unmounted preference subscriber');
        const value = typeof next === 'function' ? next(view.states[at]) : next;
        if (!Object.is(value, view.states[at])) { view.states[at] = value; view.dirty = true; }
      }];
    },
    useEffect(fn, deps) {
      const view = active, at = view.effectIndex++;
      const old = view.effects[at];
      if (!old || deps.some((value, i) => !Object.is(value, old.deps[i]))) {
        view.effects[at] = { deps, fn, cleanup: old?.cleanup, pending: true };
      }
    },
  };
  const api = new Function('React', 'window', 'localStorage', `${preferences}\n${rows}\nreturn { PrefRow, usePrefs, PREF_COLOR, PREF_GLOW };`)(React, window, localStorage);
  function mount(Component, props = {}) {
    const view = {
      states: [], effects: [], unmounted: false, props,
      render() {
        for (let attempt = 0; attempt < 20; attempt++) {
          view.stateIndex = view.effectIndex = 0;
          view.dirty = false;
          active = view;
          const tree = Component(view.props);
          for (const effect of view.effects) {
            if (!effect.pending) continue;
            effect.pending = false;
            effect.cleanup?.();
            effect.cleanup = effect.fn();
          }
          if (!view.dirty) return tree;
        }
        throw new Error('preference render did not settle');
      },
      unmount() {
        for (const effect of view.effects) effect.cleanup?.();
        view.unmounted = true;
      },
    };
    view.render();
    return view;
  }
  const row = (prefKey = api.PREF_COLOR, label = '颜色变化', def = true) => {
    const view = mount(api.PrefRow, { prefKey, label, def });
    view.button = () => view.render().props.children[1];
    return view;
  };
  const storageEvent = (key, value) => {
    if (key == null) values.clear();
    else if (value == null) values.delete(key);
    else values.set(key, value);
    for (const listener of listeners) listener({ key });
  };
  return { ...api, row, prefs: () => mount(api.usePrefs), storageEvent, values, writes, listeners };
}

test('storage changes update open switches and sliders, and clicks invert the new value', () => {
  const h = harness();
  const row = h.row();
  const glow = h.row(h.PREF_GLOW, '流光效果');
  const sliderPrefs = h.prefs();
  assert.equal(row.button().props['aria-checked'], true);
  h.storageEvent(h.PREF_COLOR, '0');
  assert.equal(row.button().props['aria-checked'], false);
  assert.equal(sliderPrefs.render().colorFollows, false);
  assert.equal(glow.button().props['aria-checked'], true);
  row.button().props.onClick();
  assert.equal(row.button().props['aria-checked'], true);
  assert.equal(sliderPrefs.render().colorFollows, true);
  assert.deepEqual(h.writes, [[h.PREF_COLOR, '1']]);
});

test('same-window writes update every matching switch and slider preference', () => {
  const h = harness();
  const first = h.row(), second = h.row(), glow = h.row(h.PREF_GLOW, '流光效果');
  const sliderPrefs = h.prefs();
  first.button().props.onClick();
  assert.equal(first.button().props['aria-checked'], false);
  assert.equal(second.button().props['aria-checked'], false);
  assert.deepEqual(sliderPrefs.render(), { colorFollows: false, maxGlow: true });
  assert.equal(glow.button().props['aria-checked'], true);
  second.button().props.onClick();
  assert.equal(first.button().props['aria-checked'], true);
  assert.equal(h.values.get(h.PREF_COLOR), '1');
});

test('storage removal and clear restore each configured default', () => {
  const h = harness();
  h.values.set(h.PREF_COLOR, '0');
  h.values.set(h.PREF_GLOW, '0');
  const color = h.row(), glow = h.row(h.PREF_GLOW, '流光效果'), prefs = h.prefs();
  h.storageEvent(h.PREF_COLOR, null);
  assert.equal(color.button().props['aria-checked'], true);
  assert.equal(glow.button().props['aria-checked'], false);
  h.storageEvent(null);
  assert.equal(glow.button().props['aria-checked'], true);
  assert.deepEqual(prefs.render(), { colorFollows: true, maxGlow: true });
});

for (const storage of ['missing', 'blocked', 'read-only']) {
  test(`switches remain usable when localStorage is ${storage}`, () => {
    const h = harness({ storage });
    const first = h.row(), second = h.row(), prefs = h.prefs();
    first.button().props.onClick();
    assert.equal(first.button().props['aria-checked'], false);
    assert.equal(second.button().props['aria-checked'], false);
    assert.equal(prefs.render().colorFollows, false);
    second.button().props.onClick();
    assert.equal(first.button().props['aria-checked'], true);
    assert.equal(prefs.render().colorFollows, true);
  });
}

test('switches have distinct accessible names that match visible labels', () => {
  const h = harness();
  for (const [key, label] of [[h.PREF_COLOR, '滑动条颜色随推理强度变化'], [h.PREF_GLOW, '推理强度最高档流光特效']]) {
    const row = h.row(key, label);
    const tree = row.render();
    const button = row.button();
    assert.equal(button.props.role, 'switch');
    assert.equal(button.props['aria-label'], label);
    assert.equal(tree.props.children[0].props.children[0].props.children[0], label);
  }
});

test('preference key/default changes resubscribe and unmount removes listeners', () => {
  const h = harness();
  const row = h.row();
  assert.equal(h.listeners.size, 1);
  row.props = { ...row.props, prefKey: h.PREF_GLOW, def: false };
  assert.equal(row.button().props['aria-checked'], false);
  h.storageEvent(h.PREF_COLOR, '1');
  assert.equal(row.button().props['aria-checked'], false);
  h.storageEvent(h.PREF_GLOW, '1');
  assert.equal(row.button().props['aria-checked'], true);
  row.unmount();
  assert.equal(h.listeners.size, 0);
  h.row(h.PREF_GLOW).button().props.onClick();
  h.storageEvent(null);
});
