window.__ModuleLoader__.load({
	id: "dsh-effort-slider",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let React = require("react");
		let ReactDOM = require("react-dom");
		// Styles shim: one <style> element,
		// replaced on re-apply (a page reset clears it).
		const styles = (() => {
			let el = null;
			return {
				insert: (css) => {
					if (el) el.remove();
					el = document.createElement("style");
					el.textContent = css;
					document.head.appendChild(el);
					return () => {
						if (el) { el.remove(); el = null; }
					};
				},
			};
		})();
		const plugin = (() => {
return {
  inject: ['slots', 'theme', 'modelDirectories', 'sessions', 'remote', 'remote.session'],
  apply(ctx) {
    ctx.effect(() => styles.insert(`

.dsh-effort-native{display:none}
.dsh-effort-extension{display:flex;flex-direction:column;flex-shrink:0;min-width:0}
.dsh-effort-divider{height:1px;flex:none;background:var(--dsw-alias-border-l1,rgba(0,0,0,.07));margin:3px 8px}
.dsh-effort-advanced{flex:none}
[data-dsh-effort-expanded] > button[role="menuitem"]{display:none}
.dsh-effort-hint{padding:2px 10px 8px;color:var(--dsw-alias-state-error-primary);font-size:11px;line-height:16px}
.dsh-pref-row{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:46px;padding:8px 0}
.dsh-pref-main{display:flex;flex-direction:column;gap:2px;min-width:0}
.dsh-pref-label{color:var(--dsw-alias-label-primary);font-size:13px;line-height:18px}
.dsh-pref-desc{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:16px}
.dsh-pref-switch{flex:none;position:relative;width:40px;height:24px;border-radius:12px;background:var(--dsw-alias-border-l1,#c9cdd4);border:none;cursor:pointer;transition:background-color .18s ease;outline:none;padding:0}
.dsh-pref-switch.on{background:var(--dsw-alias-brand-primary,#0a84ff)}
.dsh-pref-switch:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-brand-primary)}
.dsh-pref-knob{position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .18s ease}
.dsh-pref-switch.on .dsh-pref-knob{transform:translateX(16px)}
.dsh-sld-wrap{padding:6px 10px 12px}
.dsh-sld-default{margin-top:6px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}
.dsh-sld-track{position:relative;height:30px;border-radius:15px;background:#e9e9ee;cursor:pointer;touch-action:none;outline:none}
.dsh-sld-fill{position:absolute;left:0;top:0;bottom:0;border-radius:15px;background:#0a84ff;pointer-events:none;max-width:100%;transition:width .22s cubic-bezier(.22,.8,.3,1)}
.dsh-sld-tick{position:absolute;top:50%;width:5px;height:5px;border-radius:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.18);pointer-events:none}
.dsh-sld-tick.on{background:rgba(255,255,255,.75)}
.dsh-sld-wrap.dark .dsh-sld-track{background:var(--dsw-alias-bg-layer-2)}
.dsh-sld-wrap.dark .dsh-sld-tick:not(.on){background:#555}
.dsh-sld-wrap.dark .dsh-sld-thumb{background:var(--dsw-specific-menu,#2a2e33);box-shadow:0 0 0 1px rgba(255,255,255,.16),0 1px 6px rgba(0,0,0,.4)}
body[data-ds-dark-theme] .dsh-sld-track{background:var(--dsw-alias-bg-layer-2)}
body[data-ds-dark-theme] .dsh-sld-tick:not(.on){background:#555}
body[data-ds-dark-theme] .dsh-sld-thumb{background:var(--dsw-specific-menu,#2a2e33);box-shadow:0 0 0 1px rgba(255,255,255,.16),0 1px 6px rgba(0,0,0,.4)}
body[data-ds-dark-theme] .dsh-pref-knob{background:#000;box-shadow:0 0 0 1px rgba(255,255,255,.16),0 1px 3px rgba(0,0,0,.4)}
.dsh-sld-thumb{position:absolute;top:50%;width:34px;height:34px;border-radius:50%;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.3);transform:translate(-50%,-50%);pointer-events:none;transition:left .22s cubic-bezier(.22,.8,.3,1)}
.dsh-sld-thumb.no-anim,.dsh-sld-fill.no-anim{transition:none}
.dsh-sld-thumb.sld-hidden,.dsh-sld-fill.sld-hidden{opacity:0}
.dsh-sld-fill.glow{background:linear-gradient(90deg,#0a84ff 0%,#38a1ff 25%,#8fd0ff 50%,#38a1ff 75%,#0a84ff 100%);background-size:200% 100%;animation:dsh-sld-flow 3s linear infinite}
@keyframes dsh-sld-flow{from{background-position:0 0}to{background-position:200% 0}}
.dsh-sld-thumb.glow{animation:dsh-sld-pulse 3s ease-in-out infinite}
@keyframes dsh-sld-pulse{0%,100%{box-shadow:0 0 12px 3px rgba(120,200,255,.95),0 0 28px 9px rgba(120,200,255,.5),0 1px 6px rgba(0,0,0,.3)}50%{box-shadow:0 0 6px 1px rgba(56,161,255,.6),0 0 16px 4px rgba(56,161,255,.3),0 1px 6px rgba(0,0,0,.3)}}
.dsh-sld-tick.on.glow{background:#fff;box-shadow:0 0 5px 1px rgba(143,208,255,.9)}
@media (prefers-reduced-motion:reduce){.dsh-sld-fill.glow,.dsh-sld-thumb.glow{animation:none}}
`), 'effort-slider: styles');

    // ---- user preferences (localStorage-backed, synced across the plugin) ----
    const PREF_COLOR = 'dsh-effort-slider.color-follow-level';
    const PREF_GLOW = 'dsh-effort-slider.max-glow';
    const prefListeners = new Set();
    const readPref = (key, def) => {
      try {
        if (typeof localStorage === 'undefined') return def;
        const v = localStorage.getItem(key);
        return v == null ? def : v !== '0';
      } catch (e) { return def; }
    };
    const writePref = (key, value) => {
      try { if (typeof localStorage !== 'undefined') localStorage.setItem(key, value ? '1' : '0'); } catch (e) {}
      for (const fn of prefListeners) { try { fn(key, value); } catch (e) {} }
    };
    const subscribePrefs = (fn) => {
      prefListeners.add(fn);
      return () => { prefListeners.delete(fn); };
    };
    // Share the same subscription between sliders and settings rows. Notify
    // same-window subscribers with the value so toggles still work if storage
    // is unavailable; storage events re-read changes made by other windows.
    const usePref = (key, def) => {
      const [value, setValue] = React.useState(readPref(key, def));
      React.useEffect(() => {
        const update = () => setValue(readPref(key, def));
        const off = subscribePrefs((changedKey, next) => {
          if (changedKey === key) setValue(next);
        });
        update();
        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
          const onStorage = (event) => {
            if (event.key == null || event.key === key) update();
          };
          window.addEventListener('storage', onStorage);
          return () => { off(); window.removeEventListener('storage', onStorage); };
        }
        return off;
      }, [key, def]);
      return value;
    };
    const usePrefs = () => ({
      colorFollows: usePref(PREF_COLOR, true),
      maxGlow: usePref(PREF_GLOW, true),
    });
    // Current theme snapshots expose active.colorScheme; older snapshots
    // expose colorScheme directly. Keep both in sync through theme/change.
    const useDark = () => {
      const [dark, setDark] = React.useState(false);
      React.useEffect(() => {
        const theme = ctx.get('theme');
        const update = (snap) => {
          try {
            const s = snap || (theme && typeof theme.getTheme === 'function' ? theme.getTheme() : undefined);
            const colorScheme = s?.active?.colorScheme ?? s?.colorScheme;
            setDark(colorScheme === 'dark');
          } catch (e) {}
        };
        update();
        if (typeof ctx.on !== 'function') return;
        const off = ctx.on('theme/change', update);
        return typeof off === 'function' ? off : undefined;
      }, []);
      return dark;
    };

    // ---- iOS-style discrete slider: oversized white thumb covering the track ends ----
    const EffortSlider = (p) => {
      const trackRef = React.useRef(null);
      const draggingRef = React.useRef(false);
      const lastRef = React.useRef(-1);
      // Track pixel width measured at mount: animate px->px so the CSS
      // transition actually interpolates (calc() px-vs-% values do not).
      const [trackW, setTrackW] = React.useState(0);
      const [ready, setReady] = React.useState(false);
      // Transitions stay disabled until the thumb has been positioned once
      // (one frame after the track measurement). Without this, the first
      // visible frame animates left from the hidden 15px start and the thumb
      // visibly sweeps from the left edge on every mount.
      const [settled, setSettled] = React.useState(false);
      const { colorFollows, maxGlow } = usePrefs();
      const dark = useDark();
      const n = p.efforts.length;
      let index = p.pending != null ? p.pending : p.index;
      if (index < 0) index = 0;
      if (index >= n) index = n - 1;
      // Flowing-light effect at the highest level.
      const isMax = n > 1 && index === n - 1;
      const showGlow = isMax && maxGlow;
      const ratio = n > 1 ? index / (n - 1) : 0;
      const pos = (i) => 'calc(15px + (100% - 30px) * ' + (n > 1 ? i / (n - 1) : 0) + ')';
      const pad = 15;
      const inner = trackW > pad * 2 ? trackW - pad * 2 : 0;
      const thumbLeft = pad + inner * ratio;
      const fillW = 32 + inner * ratio;
      // Fill deepens with the level: light blue at the lowest level, and the
      // deepest #0a84ff at the highest (the glow keeps that exact hue).
      // When the preference is off, the fixed base #0a84ff is used instead.
      const fillColor = colorFollows && n > 1
        ? 'rgb(' + Math.round(194 + (10 - 194) * ratio) + ',' + Math.round(224 + (132 - 224) * ratio) + ',255)'
        : null;

      React.useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        setTrackW(el.getBoundingClientRect().width);
        setReady(true);
        // Enable transitions one frame after the first positioned paint so
        // the initial left/width change never animates from the 15px start.
        let raf = 0;
        if (typeof requestAnimationFrame === 'function') {
          raf = requestAnimationFrame(() => setSettled(true));
        } else {
          setSettled(true);
        }
        if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
        const onResize = () => {
          const now = trackRef.current;
          if (now) setTrackW(now.getBoundingClientRect().width);
        };
        window.addEventListener('resize', onResize);
        return () => {
          window.removeEventListener('resize', onResize);
          if (raf) cancelAnimationFrame(raf);
        };
      }, []);

      const pickAt = (ev) => {
        const el = trackRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const pad = 15;
        const inner = rect.width - pad * 2;
        const x = Math.min(Math.max(ev.clientX - rect.left - pad, 0), inner);
        const r = inner > 0 ? x / inner : 0;
        const idx = Math.max(0, Math.min(n - 1, Math.round(r * (n - 1))));
        if (idx !== lastRef.current) {
          lastRef.current = idx;
          p.onPick(idx);
        }
      };

      const onKeyDown = (ev) => {
        let idx = null;
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') idx = Math.min(n - 1, index + 1);
        else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') idx = Math.max(0, index - 1);
        else if (ev.key === 'Home') idx = 0;
        else if (ev.key === 'End') idx = n - 1;
        if (idx != null && idx !== index) {
          ev.preventDefault();
          lastRef.current = idx;
          p.onPick(idx);
        }
      };

      return React.createElement('div', { className: 'dsh-sld-wrap' + (dark ? ' dark' : '') },
        React.createElement('div', {
          className: 'dsh-sld-track',
          ref: trackRef,
          role: 'slider',
          'aria-label': '\u63a8\u7406\u5f3a\u5ea6',
          tabIndex: 0,
          'aria-valuemin': 0,
          'aria-valuemax': n - 1,
          'aria-valuenow': index,
          'aria-valuetext': p.efforts[index].name,
          onPointerDown: (ev) => {
            ev.preventDefault();
            draggingRef.current = true;
            lastRef.current = -1;
            try { ev.currentTarget.setPointerCapture(ev.pointerId); } catch (e) {}
            pickAt(ev);
          },
          onPointerMove: (ev) => {
            if (draggingRef.current) pickAt(ev);
          },
          onPointerUp: () => {
            draggingRef.current = false;
          },
          onPointerCancel: () => {
            draggingRef.current = false;
          },
          onKeyDown,
        },
          React.createElement('div', {
            className: 'dsh-sld-fill' + (showGlow ? ' glow' : '') + (!settled ? ' no-anim' : '') + (ready ? '' : ' sld-hidden'),
            style: showGlow ? { width: fillW + 'px' } : { width: fillW + 'px', ...(fillColor ? { background: fillColor } : {}) },
          }),
          p.efforts.map((e, i) => React.createElement('span', {
            key: e.id === undefined ? 'provider-default' : 'effort:' + e.id,
            className: 'dsh-sld-tick' + (i <= index ? ' on' : '') + (showGlow ? ' glow' : ''),
            style: { left: pos(i) },
          })),
          React.createElement('span', {
            className: 'dsh-sld-thumb' + (showGlow ? ' glow' : '') + (!settled ? ' no-anim' : '') + (ready ? '' : ' sld-hidden'),
            style: { left: thumbLeft + 'px' },
          })),
        p.efforts[0]?.id === undefined
          ? React.createElement('div', { className: 'dsh-sld-default' }, p.efforts[0].name) : null);
    };

    // Queue ownership follows the shared session directory, not a mounted menu.
    // Keep one in-flight write and only the latest not-yet-started selection.
    const writers = new WeakMap();
    const writerFor = (directory, sessionId) => {
      let writer = writers.get(directory);
      if (writer) return writer;
      let running = false;
      let queued = null;
      const drain = async () => {
        running = true;
        let active = null;
        let starting = false;
        let lastPending = directory.store.getSnapshot().pending;
        // Native entries share this store but do not go through our queue.
        // A new pending operation outside our synchronous select call takes
        // precedence, including another selection of the same model/effort.
        const unsubscribe = directory.store.subscribe(() => {
          const pending = directory.store.getSnapshot().pending;
          const changed = pending != null && pending !== lastPending;
          lastPending = pending;
          if (starting || !changed) return;
          if (active) {
            active.superseded = true;
            active.resolve({ superseded: true });
          }
          if (queued) {
            queued.resolve({ superseded: true });
            queued = null;
          }
        });
        try {
          while (queued) {
            const job = queued;
            active = job;
            queued = null;
            try {
              if (ctx.sessions.subagentAddress(sessionId) !== undefined) {
                throw new Error('Model selection is unavailable for subagent sessions');
              }
              let request;
              starting = true;
              try { request = directory.select(job.selection); }
              finally { starting = false; }
              const result = await request;
              if (!job.superseded) job.resolve(result);
            } catch (error) {
              if (!job.superseded) job.reject(error);
            }
          }
        } finally {
          unsubscribe();
          running = false;
        }
      };
      writer = (selection) => new Promise((resolve, reject) => {
        if (queued) queued.resolve({ superseded: true });
        queued = { selection, resolve, reject };
        if (!running) void drain();
      });
      writers.set(directory, writer);
      return writer;
    };

    // Keep the shipped selector responsible for its compact layout, search,
    // labels, keyboard navigation and selection errors. Add only the slider.
    const ModelMenuWithSlider = (props) => {
      const state = React.useSyncExternalStore(
        (notify) => props.directory.subscribe(notify),
        () => props.directory.getSnapshot(),
      );
      const rootRef = React.useRef(null);
      const extensionRef = React.useRef(null);
      const triggerRef = React.useRef(null);
      const advancedRef = React.useRef(null);
      const sequenceRef = React.useRef(0);
      const liveRef = React.useRef(true);
      const [menu, setMenu] = React.useState(null);
      const [expanded, setExpanded] = React.useState(false);
      const [optimistic, setOptimistic] = React.useState(null);
      const [error, setError] = React.useState(null);
      const sliderId = React.useId();
      const current = state.current;
      const group = state.groups.find((entry) => entry.id === current?.provider);
      const model = group?.models.find((entry) => entry.id === current?.model);
      const reasoning = model?.reasoning;
      const availableEfforts = reasoning?.efforts || [];
      const efforts = reasoning && reasoning.defaultEffort === undefined
        ? [{ id: undefined, name: '\u9ed8\u8ba4' }, ...availableEfforts] : availableEfforts;
      const effectiveEffort = current?.reasoningEffort ?? model?.reasoning?.defaultEffort;
      const index = efforts.findIndex((entry) => entry.id === effectiveEffort);
      const optimisticIndex = optimistic && optimistic.provider === current?.provider && optimistic.model === current?.model
        ? efforts.findIndex((entry) => entry.id === optimistic.effort) : -1;
      const hasSlider = availableEfforts.length > 1;
      const unavailable = index < 0 && optimisticIndex < 0;

      React.useEffect(() => {
        liveRef.current = true;
        return () => { liveRef.current = false; };
      }, []);

      // The native selector portals its menu to body. Follow its documented
      // aria-controls relationship rather than its generated CSS class names.
      // Observe only this trigger and the menu's immediate children; never the
      // whole document or the slider's continuously changing inline styles.
      React.useLayoutEffect(() => {
        const composer = rootRef.current?.closest('[data-composer-card]') || rootRef.current?.parentElement;
        if (!composer) return;
        let observed = null;
        let menuObserver = null;
        const update = () => {
          const trigger = composer.querySelector('button[aria-haspopup="menu"][aria-busy]');
          triggerRef.current = trigger || null;
          const id = trigger?.getAttribute('aria-controls');
          const element = id ? document.getElementById(id) : null;
          if (element !== observed) {
            menuObserver?.disconnect();
            observed = element;
            if (element) {
              menuObserver = new MutationObserver(update);
              menuObserver.observe(element, { childList: true, attributes: true, attributeFilter: ['role'] });
            }
          }
          const cell = element && Array.from(element.children).find((child) => child.matches('button[role="menuitem"]'));
          const next = cell ? { element, cellClass: cell.className } : null;
          setMenu((previous) => previous?.element === next?.element && previous?.cellClass === next?.cellClass ? previous : next);
        };
        const observer = new MutationObserver(update);
        observer.observe(composer, {
          childList: true, subtree: true, attributes: true,
          attributeFilter: ['aria-controls', 'aria-expanded'],
        });
        update();
        return () => { observer.disconnect(); menuObserver?.disconnect(); };
      }, []);

      React.useLayoutEffect(() => {
        if (!menu) return;
        const element = menu.element;
        if (expanded && hasSlider) element.setAttribute('data-dsh-effort-expanded', '');
        else element.removeAttribute('data-dsh-effort-expanded');
        return () => element.removeAttribute('data-dsh-effort-expanded');
      }, [menu, expanded, hasSlider]);

      React.useEffect(() => {
        if (menu) return;
        setOptimistic(null);
        setError(null);
      }, [menu]);

      // RPC completion and durable projection confirmation are separate. Keep
      // the latest drag position until both agree, including repeated drags
      // back to the starting level while earlier writes remain in the queue.
      React.useEffect(() => {
        if (optimistic?.succeeded && optimistic.provider === current?.provider &&
            optimistic.model === current?.model && optimistic.effort === effectiveEffort) {
          setOptimistic(null);
        }
      }, [optimistic, current, effectiveEffort]);

      const pick = (at) => {
        if (!current || !efforts[at]) return;
        const selection = {
          provider: current.provider, model: current.model,
          ...(efforts[at].id === undefined ? {} : { reasoningEffort: efforts[at].id }),
        };
        const sequence = ++sequenceRef.current;
        setOptimistic({ ...selection, effort: selection.reasoningEffort, sequence, succeeded: false });
        setError(null);
        Promise.resolve().then(() => props.select(selection)).then((result) => {
          if (result?.superseded) {
            if (liveRef.current) setOptimistic((value) => value?.sequence === sequence ? null : value);
            return;
          }
          if (!result?.ok) throw new Error(result?.error?.message || result?.error?.code || 'Model selection failed');
          if (liveRef.current) setOptimistic((value) => value?.sequence === sequence ? { ...value, succeeded: true } : value);
        }).catch((failure) => {
          if (!liveRef.current || sequenceRef.current !== sequence) return;
          setOptimistic(null);
          setError(String(failure?.message || failure));
        });
      };

      const focusSlider = () => extensionRef.current?.querySelector('[role="slider"], [data-dsh-effort-reset]')?.focus();
      const toggleAdvanced = () => {
        setExpanded((value) => !value);
      };
      React.useEffect(() => {
        if (menu && expanded && hasSlider) focusSlider();
      }, [menu, expanded, hasSlider, unavailable]);

      const onKeyDownCapture = (event) => {
        if (!menu || !hasSlider || (event.nativeEvent || event).isComposing) return;
        const fromSlider = extensionRef.current?.querySelector('[role="slider"]') === event.target;
        const fromAdvanced = event.target === advancedRef.current;
        const fromTrigger = event.target === triggerRef.current;
        if (expanded && event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          setExpanded(false);
          advancedRef.current?.focus();
          return;
        }
        if (fromAdvanced && event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          triggerRef.current?.click();
          return;
        }
        if (event.key === 'Tab' && (fromSlider || fromAdvanced)) {
          event.preventDefault();
          event.stopPropagation();
          if (!expanded && !event.shiftKey) setExpanded(true);
          else if (fromSlider) advancedRef.current?.focus();
          else if (event.shiftKey) triggerRef.current?.click();
          else focusSlider();
          return;
        }
        if (fromSlider || !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
        if (!fromTrigger && !menu.element.contains(event.target)) return;
        event.preventDefault();
        event.stopPropagation();
        if (expanded) {
          focusSlider();
          return;
        }
        const rows = Array.from(menu.element.querySelectorAll(':scope > button[role="menuitem"], :scope > .dsh-effort-extension > button[role="menuitem"]'));
        const active = rows.indexOf(document.activeElement);
        const offset = event.key === 'ArrowDown' ? 1 : -1;
        rows[active < 0 ? offset > 0 ? 0 : rows.length - 1 : (active + offset + rows.length) % rows.length]?.focus();
      };

      const extension = menu && hasSlider ? ReactDOM.createPortal(
        React.createElement('div', { className: 'dsh-effort-extension', ref: extensionRef },
          !expanded ? React.createElement('div', { className: 'dsh-effort-divider', role: 'separator' }) : null,
          React.createElement('button', {
            ref: advancedRef, type: 'button', role: 'menuitem',
            className: menu.cellClass + ' dsh-effort-advanced',
            'aria-expanded': expanded, 'aria-controls': expanded ? sliderId : undefined,
            onMouseDown: (event) => event.preventDefault(), onClick: toggleAdvanced,
          },
            React.createElement('span', null, '\u9ad8\u7ea7'),
            React.createElement('span', { style: { flex: 1 } }),
            React.createElement('svg', {
              width: 12, height: 12, viewBox: '0 0 12 12', fill: 'none', 'aria-hidden': true,
              style: { flex: 'none', color: 'var(--dsw-alias-menu-icon)', transform: expanded ? 'rotate(90deg)' : undefined },
            }, React.createElement('path', { d: 'M4.5 3 7.5 6 4.5 9', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }))),
          expanded ? React.createElement('div', { id: sliderId },
            unavailable ? React.createElement(React.Fragment, null,
              React.createElement('div', { className: 'dsh-effort-hint', role: 'status' },
                '\u5f53\u524d\u63a8\u7406\u5f3a\u5ea6 ' + effectiveEffort + ' \u5df2\u4e0d\u53ef\u7528\uff0c\u8bf7\u91cd\u65b0\u9009\u62e9\u3002'),
              React.createElement('button', {
                type: 'button', className: menu.cellClass, 'data-dsh-effort-reset': '',
                onMouseDown: (event) => event.preventDefault(), onClick: () => pick(0),
              }, '\u6539\u4e3a ' + efforts[0].name))
              : React.createElement(EffortSlider, { efforts, index, pending: optimisticIndex < 0 ? null : optimisticIndex, onPick: pick }),
            error ? React.createElement('div', { className: 'dsh-effort-hint', role: 'alert' }, error) : null) : null),
        menu.element,
      ) : null;

      React.useEffect(() => {
        if (!menu) return;
        const composer = rootRef.current?.closest('[data-composer-card]') || rootRef.current?.parentElement;
        composer?.addEventListener('keydown', onKeyDownCapture, true);
        menu.element.addEventListener('keydown', onKeyDownCapture, true);
        return () => {
          composer?.removeEventListener('keydown', onKeyDownCapture, true);
          menu.element.removeEventListener('keydown', onKeyDownCapture, true);
        };
      }, [menu, expanded, hasSlider]);

      return React.createElement(React.Fragment, null,
        React.createElement('span', { ref: rootRef, className: 'dsh-effort-native', 'aria-hidden': true }), extension);
    };

    // A hidden contribution beside the native model seat keeps its own label
    // child slots intact. Both UIs share the official per-session directory.
    ctx.slots.inject('conversation.input.right', () => ctx.slots.register({
      name: 'conversation.input.right', id: 'effort-slider', order: 100,
      inject: (sessionId) => {
        const directory = ctx.modelDirectories.directoryFor(sessionId);
        return {
          directory: directory.store,
          select: writerFor(directory, sessionId),
        };
      },
    }, ModelMenuWithSlider));

    // ---- settings rows: feature toggles (localStorage-backed) ----
    const PrefRow = (p) => {
      const enabled = usePref(p.prefKey, p.def);
      const toggle = () => writePref(p.prefKey, !enabled);
      return React.createElement('div', { className: 'dsh-pref-row' },
        React.createElement('div', { className: 'dsh-pref-main' },
          React.createElement('span', { className: 'dsh-pref-label' }, p.label),
          p.desc ? React.createElement('span', { className: 'dsh-pref-desc' }, p.desc) : null),
        React.createElement('button', {
          type: 'button',
          role: 'switch',
          'aria-label': p.label,
          'aria-checked': enabled,
          className: 'dsh-pref-switch' + (enabled ? ' on' : ''),
          onClick: toggle,
        }, React.createElement('span', { className: 'dsh-pref-knob' })));
    };

    ctx.slots.inject('settings.general.item', () =>
      ctx.slots.register({ name: 'settings.general.item', id: 'reasoning-effort-color', order: 25 }, () =>
        React.createElement(PrefRow, {
          prefKey: PREF_COLOR, def: true,
          label: '\u6ed1\u52a8\u6761\u989c\u8272\u968f\u63a8\u7406\u5f3a\u5ea6\u53d8\u5316',
          desc: '\u6863\u4f4d\u8d8a\u9ad8\u586b\u5145\u989c\u8272\u8d8a\u6df1\uff0c\u6700\u9ad8\u6863\u4e3a\u6df1\u84dd\u8272 / \u5173\u95ed\u540e\u56fa\u5b9a\u4e3a\u6df1\u84dd\u8272',
        })));
    ctx.slots.inject('settings.general.item', () =>
      ctx.slots.register({ name: 'settings.general.item', id: 'reasoning-effort-glow', order: 26 }, () =>
        React.createElement(PrefRow, {
          prefKey: PREF_GLOW, def: true,
          label: '\u63a8\u7406\u5f3a\u5ea6\u6700\u9ad8\u6863\u6d41\u5149\u7279\u6548',
          desc: '\u6ed1\u5757\u5904\u4e8e\u6700\u9ad8\u6863\u65f6\u64ad\u653e\u6d41\u5149\u626b\u52a8\u4e0e\u5149\u6655\u8109\u51b2',
        })));
  },
};

		})();
		exports.apply = plugin.apply;
		exports.inject = plugin.inject;
		return module.exports;
	}
});
