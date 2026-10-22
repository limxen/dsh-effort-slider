import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8');
const tick = () => new Promise((resolve) => setImmediate(resolve));
const levels = ['low', 'medium', 'high'].map((id) => ({ id, name: id }));
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const find = (node, predicate) => {
  if (!node || typeof node !== 'object') return;
  if (predicate(node)) return node;
  for (const child of (node.props?.children || []).flat(Infinity)) {
    const match = find(child, predicate);
    if (match) return match;
  }
};

// Isolated hook/host simulation: exercises plugin callbacks, queue lifetimes,
// state and keyboard decisions. It does not test React DOM or browser layout.
function harness({ defaultEffort, count = 3, select = async () => ({ ok: true }) } = {}) {
  let active;
  let registration;
  const directories = new Map();
  const React = {
    Fragment: 'fragment',
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useSyncExternalStore: (_subscribe, snapshot) => snapshot(),
    useState(initial) {
      const view = active, at = view.stateIndex++;
      if (!(at in view.states)) view.states[at] = initial;
      return [view.states[at], (value) => {
        assert(!view.unmounted, 'must not update an unmounted component');
        const next = typeof value === 'function' ? value(view.states[at]) : value;
        if (!Object.is(next, view.states[at])) { view.states[at] = next; view.dirty = true; }
      }];
    },
    useRef(initial) {
      const view = active, at = view.refIndex++;
      return view.refs[at] ||= { current: initial };
    },
    useId: () => 'slider-test',
    useLayoutEffect() {}, // DOM discovery and sizing are outside this simulation.
    useEffect(fn, deps) {
      const view = active, at = view.effectIndex++;
      const old = view.effects[at];
      if (!old || deps.some((value, i) => !Object.is(value, old.deps[i]))) {
        view.effects[at] = { deps, fn, cleanup: old?.cleanup, pending: true };
      }
    },
  };
  const ctx = {
    effect() {}, get() {}, on() {},
    sessions: { subagentAddress: () => undefined },
    modelDirectories: { directoryFor: (id) => {
      if (!directories.has(id)) {
        const snapshot = {
          current: { provider: 'provider', model: 'model' },
          groups: [{ id: 'provider', models: [{ id: 'model', reasoning: {
            efforts: levels.slice(0, count), ...(defaultEffort === undefined ? {} : { defaultEffort }),
          } }] }],
          pending: null,
        };
        const listeners = new Set();
        const notify = () => { for (const fn of listeners) fn(); };
        directories.set(id, {
          snapshot,
          notify,
          listenerCount: () => listeners.size,
          store: {
            getSnapshot: () => snapshot,
            subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
          },
          select: async (selection) => {
            snapshot.pending = selection;
            notify();
            try { return await select(selection, id); }
            finally {
              if (snapshot.pending === selection) { snapshot.pending = null; notify(); }
            }
          },
        });
      }
      return directories.get(id);
    } },
    slots: {
      inject: (_name, fn) => fn(),
      register: (config, Component) => {
        if (config.id === 'effort-slider') registration = { config, Component };
      },
    },
  };
  new Function('React', 'ReactDOM', 'styles', 'localStorage', source)(
    React, { createPortal: (node) => node }, {}, undefined,
  ).apply(ctx);

  function view(Component, props, states = []) {
    const instance = {
      states, refs: [], effects: [], unmounted: false,
      render() {
        let tree;
        for (let attempts = 0; attempts < 20; attempts++) {
          instance.stateIndex = instance.refIndex = instance.effectIndex = 0;
          instance.dirty = false;
          active = instance;
          tree = Component(props);
          for (const effect of instance.effects) {
            if (!effect.pending) continue;
            effect.pending = false;
            effect.cleanup?.();
            effect.cleanup = effect.fn();
          }
          if (!instance.dirty) return tree;
        }
        throw new Error('render did not settle');
      },
      unmount() {
        for (const effect of instance.effects) effect.cleanup?.();
        instance.unmounted = true;
      },
    };
    return instance;
  }
  const inject = (id = 'a') => registration.config.inject(id);
  const mount = (id = 'a') => {
    const menu = { element: { addEventListener() {}, removeEventListener() {} }, cellClass: 'native' };
    const instance = view(registration.Component, inject(id), [menu, true]);
    instance.slider = () => find(instance.render(), (node) => node.type.name === 'EffortSlider');
    return instance;
  };
  const track = (slider) => find(view(slider.type, slider.props).render(), (node) => node.props.role === 'slider');
  return { inject, mount, track, directories };
}

test('rapid changes serialize writes and coalesce intermediate targets', async () => {
  const first = deferred();
  const writes = [];
  const h = harness({ select: (selection) => {
    writes.push(selection.reasoningEffort);
    return writes.length === 1 ? first.promise : Promise.resolve({ ok: true });
  } });
  const writer = h.inject().select;
  const requests = ['low', 'medium', 'high'].map((reasoningEffort) => writer({ provider: 'provider', model: 'model', reasoningEffort }));
  assert.deepEqual(writes, ['low']);
  assert.deepEqual(await requests[1], { superseded: true });
  first.resolve({ ok: true });
  await Promise.all(requests);
  assert.deepEqual(writes, ['low', 'high']);
});

test('final selection survives unmount without updating unmounted React state', async () => {
  const first = deferred();
  const writes = [];
  const h = harness({ defaultEffort: 'low', select: (selection) => {
    writes.push(selection.reasoningEffort);
    return writes.length === 1 ? first.promise : Promise.resolve({ ok: true });
  } });
  const menu = h.mount();
  const pick = menu.slider().props.onPick;
  pick(1); pick(2);
  await tick();
  menu.unmount();
  first.resolve({ ok: true });
  await tick();
  assert.deepEqual(writes, ['medium', 'high']);
});

test('remounted menus reuse a queue; different sessions remain independent', async () => {
  const first = deferred();
  const writes = [];
  const h = harness({ select: (selection, id) => {
    writes.push([id, selection.reasoningEffort]);
    return writes.length === 1 ? first.promise : Promise.resolve({ ok: true });
  } });
  const oldMenu = h.mount('a');
  oldMenu.slider().props.onPick(1);
  await tick();
  oldMenu.unmount();
  const newMenu = h.mount('a');
  newMenu.slider().props.onPick(3);
  h.mount('b').slider().props.onPick(2);
  await tick();
  assert.deepEqual(writes, [['a', 'low'], ['b', 'medium']]);
  first.resolve({ ok: true });
  await tick();
  assert.deepEqual(writes, [['a', 'low'], ['b', 'medium'], ['a', 'high']]);
});

test('a rejected write does not block the latest queued choice', async () => {
  const first = deferred();
  const writes = [];
  const h = harness({ select: (selection) => {
    writes.push(selection.reasoningEffort);
    return writes.length === 1 ? first.promise : Promise.resolve({ ok: true });
  } });
  const menu = h.mount();
  menu.slider().props.onPick(1);
  menu.slider().props.onPick(3);
  await tick();
  first.reject(new Error('offline'));
  await tick();
  assert.deepEqual(writes, ['low', 'high']);
  assert.equal(find(menu.render(), (node) => node.props.role === 'alert'), undefined);
  assert.equal(menu.slider().props.pending, 3);
});

for (const failure of ['remote-result', 'rejected-promise']) {
  test(`latest ${failure} failure restores actual selection and displays error`, async () => {
    const h = harness({ defaultEffort: 'medium', select: () => failure === 'remote-result'
      ? Promise.resolve({ ok: false, error: { message: 'offline' } })
      : Promise.reject(new Error('offline')) });
    const menu = h.mount();
    menu.slider().props.onPick(2);
    await tick();
    assert.equal(menu.slider().props.pending, null);
    assert.equal(menu.slider().props.index, 1);
    assert.equal(find(menu.render(), (node) => node.props.role === 'alert').props.children[0], 'offline');
  });
}

test('provider default is distinct; arrows and Home/End use the full range', async () => {
  const writes = [];
  const h = harness({ select: async (selection) => { writes.push(selection); return { ok: true }; } });
  const menu = h.mount();
  let track = h.track(menu.slider());
  assert.equal(track.props['aria-valuetext'], '默认');
  assert.equal(track.props['aria-valuemax'], 3);
  const press = (key) => track.props.onKeyDown({ key, preventDefault() {} });
  press('ArrowRight');
  await tick();
  assert.equal(writes.at(-1).reasoningEffort, 'low');
  track = h.track(menu.slider());
  press('End');
  await tick();
  assert.equal(writes.at(-1).reasoningEffort, 'high');
  track = h.track(menu.slider());
  press('Home');
  await tick();
  assert.equal(Object.hasOwn(writes.at(-1), 'reasoningEffort'), false);
  assert.equal(h.track(menu.slider()).props['aria-valuetext'], '默认');
});

test('declared defaults map to their real level with no extra default stop', () => {
  const h = harness({ defaultEffort: 'medium' });
  const slider = h.mount().slider();
  assert.deepEqual(slider.props.efforts.map((level) => level.id), ['low', 'medium', 'high']);
  assert.equal(h.track(slider).props['aria-valuetext'], 'medium');
});

test('successful optimistic choice waits for the shared projection', async () => {
  const h = harness({ defaultEffort: 'medium' });
  const menu = h.mount();
  menu.slider().props.onPick(2);
  await tick();
  assert.equal(menu.slider().props.pending, 2);
  h.directories.get('a').snapshot.current = { provider: 'provider', model: 'model', reasoningEffort: 'high' };
  assert.equal(menu.slider().props.pending, null);
  assert.equal(menu.slider().props.index, 2);
});

test('models with fewer than two declared levels still have no slider', () => {
  for (const count of [0, 1]) assert.equal(harness({ count }).mount().slider(), undefined);
});

for (const defaultEffort of [undefined, 'medium']) {
  test(`removed saved effort is shown as unavailable (default=${defaultEffort})`, async () => {
    const writes = [];
    const h = harness({ defaultEffort, count: 2, select: async (selection) => {
      writes.push(selection);
      return { ok: true };
    } });
    h.inject();
    const state = h.directories.get('a').snapshot;
    state.current = { provider: 'provider', model: 'model', reasoningEffort: 'high' };
    const menu = h.mount();
    assert.equal(menu.slider(), undefined);
    assert.match(find(menu.render(), (node) => node.props.role === 'status').props.children[0], /high/);
    assert.deepEqual(writes, []);
    const reset = find(menu.render(), (node) => Object.hasOwn(node.props, 'data-dsh-effort-reset'));
    assert(reset);
    reset.props.onClick();
    await tick();
    assert.equal(menu.slider().props.pending, 0);
    assert.equal(writes.length, 1);
    assert.equal(writes[0].reasoningEffort, defaultEffort === undefined ? undefined : 'low');
    state.current = writes[0];
    assert.equal(menu.slider().props.pending, null);
    assert.equal(menu.slider().props.index, 0);
  });
}

for (const externalEffort of ['low', 'medium']) {
  test(`native same-model ${externalEffort} selection cancels older writes immediately`, async () => {
    const first = deferred();
    const writes = [];
    const h = harness({ defaultEffort: 'low', select: (selection) => {
      writes.push(selection);
      return writes.length === 1 ? first.promise : Promise.resolve({ ok: true });
    } });
    const menu = h.mount();
    menu.slider().props.onPick(1);
    menu.slider().props.onPick(2);
    await tick();
    const directory = h.directories.get('a');
    const nativeChoice = { provider: 'provider', model: 'model', reasoningEffort: externalEffort };
    await directory.select(nativeChoice);
    directory.snapshot.current = nativeChoice;
    assert.equal(menu.slider().props.pending, null);
    assert.equal(menu.slider().props.index, externalEffort === 'low' ? 0 : 1);
    first.reject(new Error('late error from superseded request'));
    await tick();
    assert.deepEqual(writes.map((entry) => entry.reasoningEffort), ['medium', externalEffort]);
    assert.equal(find(menu.render(), (node) => node.props.role === 'alert'), undefined);
    assert.equal(directory.listenerCount(), 0);
  });
}

test('native model change is not overwritten by an older queued slider choice', async () => {
  const first = deferred();
  const writes = [];
  const h = harness({ select: (selection) => {
    writes.push(selection);
    return writes.length === 1 ? first.promise : Promise.resolve({ ok: true });
  } });
  const writer = h.inject().select;
  const earlier = writer({ provider: 'provider', model: 'model', reasoningEffort: 'medium' });
  const queued = writer({ provider: 'provider', model: 'model', reasoningEffort: 'high' });
  await h.directories.get('a').select({ provider: 'provider', model: 'another-model', reasoningEffort: 'low' });
  assert.deepEqual(await earlier, { superseded: true });
  assert.deepEqual(await queued, { superseded: true });
  first.resolve({ ok: true });
  await tick();
  assert.deepEqual(writes.map((entry) => entry.model), ['model', 'another-model']);
});

test('new slider input after native selection survives repeated native store updates', async () => {
  const first = deferred(), external = deferred();
  const writes = [];
  const h = harness({ select: (selection) => {
    writes.push(selection.reasoningEffort);
    return writes.length === 1 ? first.promise : writes.length === 2 ? external.promise : Promise.resolve({ ok: true });
  } });
  const writer = h.inject().select;
  const earlier = writer({ provider: 'provider', model: 'model', reasoningEffort: 'low' });
  const directory = h.directories.get('a');
  const native = directory.select({ provider: 'provider', model: 'model', reasoningEffort: 'medium' });
  assert.deepEqual(await earlier, { superseded: true });
  const latest = writer({ provider: 'provider', model: 'model', reasoningEffort: 'high' });
  directory.notify();
  external.resolve({ ok: true });
  await native;
  first.resolve({ ok: true });
  assert.deepEqual(await latest, { ok: true });
  assert.deepEqual(writes, ['low', 'medium', 'high']);
  assert.equal(directory.listenerCount(), 0);
});
