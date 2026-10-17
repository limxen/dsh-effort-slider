window.__ModuleLoader__.load({
	id: "dsh-effort-slider",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let React = require("react");
		// Shim for the dynamic runtime's `styles` builtin: one <style> element,
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
  // DeepSeek Harness data channel: the typed Remote service (remote.session)
  // carries the Host-generation model catalog + session.selectModel, and the
  // session's durable current selection rides the `modelSelection` projection.
  // `connection.api.*` no longer exists, which broke the old data path.
  inject: ['slots', 'remote', 'remote.session', 'sessions', 'theme'],
  apply(ctx) {
    styles.insert(`
.dsh-ms-root{position:relative;min-width:0}
.dsh-ms-trigger{min-width:0;max-width:220px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:transparent;border:none;border-radius:24px;outline:none;display:flex;align-items:center;gap:4px;padding:0 6px 0 8px;font-size:13px;font-weight:500;line-height:20px}
.dsh-ms-trigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.dsh-ms-trigger:disabled{opacity:.5;cursor:default}
.dsh-ms-trigger-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-ms-trigger-effort{flex:none;color:var(--dsw-alias-label-caption,#a0a4ab);font-weight:400}
.dsh-ms-chevron{flex:none;color:var(--dsw-alias-label-secondary);transition:transform .12s;display:flex}
.dsh-ms-chevron.open{transform:rotate(180deg)}
.dsh-ms-backdrop{position:fixed;inset:0;z-index:18}
.dsh-ms2-menu{position:absolute;bottom:calc(100% + 8px);right:0;z-index:20;width:min(240px,calc(100vw - 32px));max-height:min(400px,calc(100vh - 96px));display:flex;flex-direction:column;border:1px solid var(--dsw-alias-border-inverted,rgba(0,0,0,.08));border-radius:12px;background:var(--dsw-specific-menu,#fff);box-shadow:var(--dsw-shadow-lv3,0 10px 28px rgba(0,0,0,.14));color:var(--dsw-alias-label-primary,#1f2328);overflow:hidden;padding:4px}
.dsh-ms2-cell{width:100%;height:40px;display:flex;align-items:center;gap:8px;padding:0 10px;border:none;border-radius:10px;background:transparent;color:inherit;cursor:pointer;text-align:left;font-size:14px;line-height:22px}
.dsh-ms2-cell:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.05))}
.dsh-ms2-cell-label{flex:none;font-weight:500}
.dsh-ms2-cell-value{flex:1;min-width:0;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary,#8a8f98);font-weight:400}
.dsh-ms2-cell-chev{flex:none;color:var(--dsw-alias-label-tertiary,#8a8f98);display:flex;transition:transform .12s}
.dsh-ms2-cell-chev.open{transform:rotate(90deg)}
.dsh-ms2-div{height:1px;background:var(--dsw-alias-border-l1,rgba(0,0,0,.07));margin:1px 8px}
.dsh-ms2-back{display:flex;align-items:center;gap:4px;width:100%;padding:6px 8px;border:none;background:transparent;color:var(--dsw-alias-label-tertiary,#8a8f98);font-size:13px;font-weight:500;cursor:pointer;border-radius:10px;text-align:left}
.dsh-ms2-back:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.05))}
.dsh-ms2-check{flex:none;width:18px;text-align:center;color:var(--dsw-alias-brand-primary);font-size:13px;line-height:20px}
.dsh-ms2-groups{min-height:0;overflow-y:auto;padding:0 0 2px}
.dsh-ms2-group+.dsh-ms2-group{margin-top:4px}
.dsh-ms2-group-title{position:sticky;top:0;z-index:1;background:var(--dsw-specific-menu,#fff);color:var(--dsw-alias-label-tertiary,#8a8f98);padding:5px 8px 3px;font-size:12px;font-weight:500;line-height:18px}
.dsh-ms2-option{width:100%;min-height:38px;display:flex;align-items:center;gap:8px;padding:6px 8px;border:none;border-radius:10px;background:transparent;color:inherit;cursor:pointer;text-align:left}
.dsh-ms2-option:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.05))}
.dsh-ms2-option-copy{flex:1;min-width:0;display:flex;flex-direction:column}
.dsh-ms2-option-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:500;line-height:20px}
.dsh-ms2-option-desc{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary,#8a8f98);font-size:12px;line-height:18px}
.dsh-ms2-status{color:var(--dsw-alias-label-tertiary,#8a8f98);padding:10px;font-size:13px;line-height:20px}
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
.dsh-sld-track{position:relative;height:30px;border-radius:15px;background:#e9e9ee;cursor:pointer;touch-action:none;outline:none}
.dsh-sld-track:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-brand-primary)}
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
.dsh-effort-hint{padding:2px 10px 8px;color:var(--dsw-alias-state-error-primary);font-size:11px;line-height:16px}
`);

    // ---- model catalog (Host-generation, session-agnostic, shared) ----
    // The current API replaces the old `connection.api.sessions.models({sessionId})`
    // RPC with a global `remote.session.modelCatalog()` + the per-session
    // durable `modelSelection` projection (see ModelSelect below).
    const catalogState = {
      groups: [],
      defaultCurrent: null, // catalog.default ({provider, model, reasoningEffort?})
      status: 'idle',       // idle | loading | ready | error
      error: null,
    };
    const catalogListeners = new Set();
    let catalogSeq = 0;
    const useCatalog = () => {
      const [snap, setSnap] = React.useState(() => ({
        groups: catalogState.groups,
        defaultCurrent: catalogState.defaultCurrent,
        status: catalogState.status,
        error: catalogState.error,
      }));
      React.useEffect(() => {
        const fn = () => setSnap({
          groups: catalogState.groups,
          defaultCurrent: catalogState.defaultCurrent,
          status: catalogState.status,
          error: catalogState.error,
        });
        catalogListeners.add(fn);
        return () => { catalogListeners.delete(fn); };
      }, []);
      return snap;
    };
    const setCatalog = (patch) => {
      Object.assign(catalogState, patch);
      for (const fn of [...catalogListeners]) { try { fn(); } catch (e) {} }
    };
    const sessionRemote = () => {
      const r = (typeof ctx.get === 'function' && ctx.get('remote')) || ctx.remote;
      return r && r.session ? r.session : undefined;
    };
    // Load (or reload) the Host-generation catalog; a stale in-flight response
    // never overwrites a newer one (seq guard).
    //
    // SILENT refresh: when a catalog is already shown, a background reload
    // (triggered by every selectModel write via the settings/document-updated
    // event) must NOT flip the status to "loading" — the seat derives
    // hasSlider from it, so a flip unmounts the slider and the thumb re-sweeps
    // from the left on every drag pick. Keep serving the stale groups until
    // the fresh response lands; only surface loading/error when there is no
    // data at all.
    const refreshCatalog = () => {
      const seq = ++catalogSeq;
      const sr = sessionRemote();
      if (!sr || typeof sr.modelCatalog !== 'function') {
        setCatalog({ status: 'error', error: 'remote.session.modelCatalog unavailable' });
        return;
      }
      const hadData = catalogState.groups.length > 0 || catalogState.defaultCurrent !== null;
      if (!hadData) setCatalog({ status: 'loading', error: null });
      sr.modelCatalog()
        .then((r) => {
          if (seq !== catalogSeq) return;
          if (!r || !r.ok) throw new Error((r && r.error && (r.error.message || r.error.code)) || 'model catalog failed');
          setCatalog({
            groups: (r.value && r.value.groups) || [],
            defaultCurrent: (r.value && r.value.default) || null,
            status: 'ready',
            error: null,
          });
        })
        .catch((e) => {
          if (seq !== catalogSeq) return;
          // A failed background refresh keeps the stale groups on screen;
          // without any data yet, surface the error instead.
          if (!hadData) setCatalog({ status: 'error', error: String((e && e.message) || e) });
        });
    };

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
      for (const fn of prefListeners) { try { fn(); } catch (e) {} }
    };
    const subscribePrefs = (fn) => {
      prefListeners.add(fn);
      return () => { prefListeners.delete(fn); };
    };
    // Re-render subscribers whenever a preference changes (same tab or storage event).
    const usePrefs = () => {
      const [, force] = React.useState(0);
      React.useEffect(() => {
        const notify = () => force((x) => x + 1);
        const off = subscribePrefs(notify);
        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
          const onStorage = () => notify();
          window.addEventListener('storage', onStorage);
          return () => { off(); window.removeEventListener('storage', onStorage); };
        }
        return off;
      }, []);
      return {
        colorFollows: readPref(PREF_COLOR, true),
        maxGlow: readPref(PREF_GLOW, true),
      };
    };
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

    const chevronRight = (cls) => React.createElement('svg', {
      className: cls, width: 12, height: 12, viewBox: '0 0 12 12', fill: 'none', 'aria-hidden': 'true',
    }, React.createElement('path', {
      d: 'M4.5 3 7.5 6 4.5 9', stroke: 'currentColor', 'stroke-width': 1.5,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }));

    const chevronDown = (cls) => React.createElement('svg', {
      className: cls, width: 12, height: 12, viewBox: '0 0 12 12', fill: 'none', 'aria-hidden': 'true',
    }, React.createElement('path', {
      d: 'M3 4.5 6 7.5 9 4.5', stroke: 'currentColor', 'stroke-width': 1.5,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }));

    const chevronLeft = () => React.createElement('svg', {
      width: 12, height: 12, viewBox: '0 0 12 12', fill: 'none', 'aria-hidden': 'true',
    }, React.createElement('path', {
      d: 'M7.5 3 4.5 6 7.5 9', stroke: 'currentColor', 'stroke-width': 1.5,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }));

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
            key: e.id,
            className: 'dsh-sld-tick' + (i <= index ? ' on' : '') + (showGlow ? ' glow' : ''),
            style: { left: pos(i) },
          })),
          React.createElement('span', {
            className: 'dsh-sld-thumb' + (showGlow ? ' glow' : '') + (!settled ? ' no-anim' : '') + (ready ? '' : ' sld-hidden'),
            style: { left: thumbLeft + 'px' },
          })));
    };

    const Cell = (p) => React.createElement('button', {
      type: 'button', className: 'dsh-ms2-cell', onClick: p.onClick,
    },
      React.createElement('span', { className: 'dsh-ms2-cell-label' }, p.label),
      p.value ? React.createElement('span', { className: 'dsh-ms2-cell-value' }, p.value) : null,
      chevronRight('dsh-ms2-cell-chev' + (p.open ? ' open' : '')));

    const Divider = () => React.createElement('div', { className: 'dsh-ms2-div' });

    // ---- composer model seat: menu with 模型 / 推理强度 / 高级 (slider) rows ----
    const ModelSelect = (props) => {
      const sessionId = props.sessionId;
      const locked = props.locked === true;
      // Catalog: shared Host-generation model groups (loaded once, refreshed on
      // adapters/settings changes). Current: the session's durable selection,
      // projected from Session history (same source the built-in menu uses).
      const catalog = useCatalog();
      const useProjection = typeof props.useProjection === 'function' ? props.useProjection : null;
      const projection = useProjection ? useProjection('modelSelection') : undefined;
      const [open, setOpen] = React.useState(false);
      const [pane, setPane] = React.useState('main');
      const [advOpen, setAdvOpen] = React.useState(false);
      const [pending, setPending] = React.useState(null);
      const [error, setError] = React.useState(null);
      const writeRef = React.useRef(Promise.resolve());
      // Last successful write (normalized, from the RPC response): pending is
      // kept until the session's modelSelection projection reflects this
      // selection, so dragging never snaps back before the projection lands.
      const lastWriteRef = React.useRef(null);
      // Remember whether the menu was last closed from the advanced (slider) view.
      const lastViewRef = React.useRef(false);

      // ---- derived state (kept above the effects so every effect body can
      // reference them safely) ----
      const current = (projection && projection.next) || (catalog.status === 'ready' ? catalog.defaultCurrent : null);
      const groups = catalog.status === 'ready' ? catalog.groups : [];
      const group = current ? groups.find((g) => g.id === current.provider) : undefined;
      const model = group ? group.models.find((m) => m.id === current.model) : undefined;
      const reasoning = model && model.reasoning;
      const efforts = reasoning ? (reasoning.efforts || []) : [];
      const defaultEffort = reasoning ? reasoning.defaultEffort : undefined;
      const hasEffort = efforts.length >= 1;
      const hasSlider = efforts.length >= 2;
      // Match the built-in menu: a "Default" (provider-default) choice exists only
      // when the model does not advertise its own defaultEffort; otherwise the
      // advertised default level is just one of the listed levels.
      const hasProviderDefault = !!reasoning && defaultEffort === undefined;
      const rawEffort = current ? current.reasoningEffort : undefined;
      const effectiveEffort = rawEffort !== undefined ? rawEffort : defaultEffort;
      const effortLabel = (() => {
        if (effectiveEffort === undefined) return 'Default';
        const m = efforts.find((e) => e.id === effectiveEffort);
        return m ? (m.name || m.id) : effectiveEffort;
      })();
      const sliderIndex = (() => {
        if (efforts.length === 0) return -1;
        const i = efforts.findIndex((e) => e.id === effectiveEffort);
        return i >= 0 ? i : 0;
      })();
      const modelLabel = model ? (model.name || model.id) : (current ? current.model : '\u2026');

      React.useEffect(() => { refreshCatalog(); }, []);
      React.useEffect(() => {
        const remote = (typeof ctx.get === 'function' && ctx.get('remote')) || ctx.remote;
        if (!remote || typeof remote.$on !== 'function') return;
        const disposers = [];
        for (const eventName of ['llm/adapters-updated', 'settings/document-updated', 'credentials/reference-updated']) {
          try {
            const d = remote.$on(eventName, refreshCatalog);
            if (typeof d === 'function') disposers.push(d);
          } catch (e) {}
        }
        return () => {
          for (const d of disposers) {
            try { d(); } catch (e) {}
          }
        };
      }, []);

      // Release the optimistic `pending` level only once the host projection
      // reflects the last successful write (provider/model normalized the same
      // way; reasoningEffort matched, null = provider default). Without this,
      // pending was cleared on RPC success while the projection was still the
      // OLD selection — the slider snapped back (often to the leftmost tick)
      // and then swept right again when the projection landed.
      React.useEffect(() => {
        const lw = lastWriteRef.current;
        if (lw === null || pending !== null && (pending < 0 || pending >= efforts.length)) return;
        const next = projection && projection.next;
        if (!next) return;
        const nextEffort = next.reasoningEffort !== undefined ? next.reasoningEffort : null;
        const pendingId = pending !== null ? efforts[pending].id : null;
        if (lw.provider === next.provider && lw.model === next.model && lw.effort === nextEffort && pendingId === nextEffort) {
          lastWriteRef.current = null;
          setPending(null);
        }
      }, [projection, pending, efforts]);

      // Builder-model seat is unavailable for addressed subagent sessions
      // (model selection is owned by the parent there) — hide like the built-in.
      const sessionsSvc = (typeof ctx.get === 'function' && ctx.get('sessions')) || ctx.sessions;
      if (sessionsSvc && typeof sessionsSvc.subagentAddress === 'function' && sessionsSvc.subagentAddress(sessionId) !== undefined) return null;

      const writeSelection = (selection, keepOpen) => {
        setError(null);
        const sr = sessionRemote();
        if (!sr || typeof sr.selectModel !== 'function') { setError('remote.session.selectModel unavailable'); return; }
        writeRef.current = writeRef.current
          .catch(() => {})
          .then(() => sr.selectModel({ sessionId, ...selection }))
          .then((r) => {
            if (!r || !r.ok) throw new Error((r && r.error && (r.error.message || r.error.code)) || 'selectModel failed');
            // Record the response's NORMALIZED selection (the host may alias
            // provider/model); keep `pending` as the optimistic slider level
            // until the modelSelection projection catches up, then release.
            const selected = r.value && r.value.selected;
            lastWriteRef.current = {
              provider: selected.provider,
              model: selected.model,
              effort: selected.reasoningEffort !== undefined ? selected.reasoningEffort : null,
            };
            if (!keepOpen) setOpen(false);
          })
          .catch((e) => {
            lastWriteRef.current = null;
            setPending(null);
            setError(String((e && e.message) || e));
          });
      };

      const pickModel = (g, m) => {
        const sel = { provider: g.id, model: m.id };
        if (m.reasoning && m.reasoning.defaultEffort) sel.reasoningEffort = m.reasoning.defaultEffort;
        writeSelection(sel, false);
      };

      const pickEffort = (idx, keepOpen) => {
        if (!current) return;
        setPending(idx);
        writeSelection({ provider: current.provider, model: current.model, reasoningEffort: efforts[idx].id }, !!keepOpen);
      };

      // Select the model's default level: omit reasoningEffort so the host materializes it.
      const pickDefault = () => {
        if (!current) return;
        setPending(null);
        writeSelection({ provider: current.provider, model: current.model }, false);
      };

      // Track the advanced view so reopening restores the last closed interface.
      const setAdv = (v) => {
        lastViewRef.current = v;
        setAdvOpen(v);
      };

      const closeMenu = () => {
        setPane('main');
        setAdvOpen(false);
        setOpen(false);
        // Projection is the display source of truth once the menu closes; a
        // leftover optimistic level must not pin the slider on reopen.
        lastWriteRef.current = null;
        setPending(null);
      };

      const toggleOpen = () => {
        if (open) {
          closeMenu();
          return;
        }
        setPane('main');
        setAdvOpen(lastViewRef.current);
        setOpen(true);
      };

      const mainPane = advOpen && hasSlider
        ? React.createElement(React.Fragment, null,
            Cell({ label: '\u9ad8\u7ea7', value: '', open: true, onClick: () => setAdv(false) }),
            React.createElement(EffortSlider, {
              efforts, index: sliderIndex, pending,
              onPick: (idx) => pickEffort(idx, true),
            }),
            error ? React.createElement('div', { className: 'dsh-effort-hint' }, error) : null)
        : React.createElement(React.Fragment, null,
            Cell({ label: '\u6a21\u578b', value: modelLabel, onClick: () => setPane('model') }),
            hasEffort ? Cell({ label: '\u63a8\u7406\u5f3a\u5ea6', value: effortLabel, onClick: () => setPane('effort') }) : null,
            hasSlider ? Divider() : null,
            hasSlider ? Cell({ label: '\u9ad8\u7ea7', value: '', open: false, onClick: () => setAdv(true) }) : null,
            error ? React.createElement('div', { className: 'dsh-effort-hint' }, error) : null);

      const modelPane = React.createElement(React.Fragment, null,
        React.createElement('button', { type: 'button', className: 'dsh-ms2-back', onClick: () => setPane('main') },
          chevronLeft(), '\u6a21\u578b'),
        groups.length === 0
          ? React.createElement('div', { className: 'dsh-ms2-status' }, catalog.status === 'ready' ? 'No models' : '\u2026')
          : React.createElement('div', { className: 'dsh-ms2-groups' },
              groups.map((g) => React.createElement('div', { key: g.id, className: 'dsh-ms2-group' },
                React.createElement('div', { className: 'dsh-ms2-group-title' }, g.name || g.id),
                g.models.map((m) => {
                  const selected = !!current && current.provider === g.id && current.model === m.id;
                  return React.createElement('button', {
                    key: m.id, type: 'button', className: 'dsh-ms2-option', onClick: () => pickModel(g, m),
                  },
                    React.createElement('span', { className: 'dsh-ms2-option-copy' },
                      React.createElement('span', { className: 'dsh-ms2-option-name' }, m.name || m.id),
                      m.description ? React.createElement('span', { className: 'dsh-ms2-option-desc' }, m.description) : null),
                    React.createElement('span', { className: 'dsh-ms2-check' }, selected ? '\u2713' : ''));
                })))),
        error ? React.createElement('div', { className: 'dsh-effort-hint' }, error) : null);

      const effortPane = React.createElement(React.Fragment, null,
        React.createElement('button', { type: 'button', className: 'dsh-ms2-back', onClick: () => setPane('main') },
          chevronLeft(), '\u63a8\u7406\u5f3a\u5ea6'),
        hasProviderDefault
          ? React.createElement('button', {
              type: 'button', className: 'dsh-ms2-cell',
              onClick: () => pickDefault(),
            },
            React.createElement('span', { className: 'dsh-ms2-cell-label' }, 'Default'),
            React.createElement('span', { className: 'dsh-ms2-check' }, effectiveEffort === undefined ? '\u2713' : ''))
          : null,
        efforts.map((e, i) => {
          const selected = e.id === effectiveEffort;
          return React.createElement('button', {
            key: e.id, type: 'button', className: 'dsh-ms2-cell',
            onClick: () => pickEffort(i),
          },
            React.createElement('span', { className: 'dsh-ms2-cell-label' }, e.name),
            e.description ? React.createElement('span', { className: 'dsh-ms2-cell-value' }, e.description) : null,
            React.createElement('span', { className: 'dsh-ms2-check' }, selected ? '\u2713' : ''));
        }),
        error ? React.createElement('div', { className: 'dsh-effort-hint' }, error) : null);

      const menu = open
        ? React.createElement('div', { className: 'dsh-ms2-menu' },
            pane === 'model' ? modelPane : pane === 'effort' ? effortPane : mainPane)
        : null;

      return React.createElement('div', { className: 'dsh-ms-root' },
        React.createElement('button', {
          type: 'button',
          className: 'dsh-ms-trigger',
          disabled: locked,
          onClick: toggleOpen,
          'aria-expanded': open,
          'aria-haspopup': 'menu',
        },
          React.createElement('span', { className: 'dsh-ms-trigger-label' }, modelLabel),
          hasEffort ? React.createElement('span', { className: 'dsh-ms-trigger-effort' }, '\u00b7 ' + effortLabel) : null,
          chevronDown('dsh-ms-chevron' + (open ? ' open' : ''))),
        open ? React.createElement('div', { className: 'dsh-ms-backdrop', onClick: toggleOpen }) : null,
        menu);
    };

    // ---- settings rows: feature toggles (localStorage-backed) ----
    const PrefRow = (p) => {
      const [enabled, setEnabled] = React.useState(readPref(p.prefKey, p.def));
      React.useEffect(() => setEnabled(readPref(p.prefKey, p.def)), [p.prefKey]);
      const toggle = () => {
        const next = !enabled;
        setEnabled(next);
        writePref(p.prefKey, next);
      };
      return React.createElement('div', { className: 'dsh-pref-row' },
        React.createElement('div', { className: 'dsh-pref-main' },
          React.createElement('span', { className: 'dsh-pref-label' }, p.label),
          p.desc ? React.createElement('span', { className: 'dsh-pref-desc' }, p.desc) : null),
        React.createElement('button', {
          type: 'button',
          role: 'switch',
          'aria-checked': enabled,
          className: 'dsh-pref-switch' + (enabled ? ' on' : ''),
          onClick: toggle,
        }, React.createElement('span', { className: 'dsh-pref-knob' })));
    };

    // The model seat slot is declared lazily when ui-conversation registers the
    // conversation.composer.bar entry, so register through slots.inject (the same
    // deferred pattern dsh-client-ui-model-selection uses); an eager register at
    // apply time fails with "slot ... is not declared".
    ctx.slots.inject('conversation.input.model', () =>
      ctx.slots.register({ name: 'conversation.input.model', priority: -10 }, (props) => React.createElement(ModelSelect, props)));
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
