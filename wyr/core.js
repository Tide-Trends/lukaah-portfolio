/* Line Brain core: routing, hub, shared UI, sound, timers, players. */
(() => {
  "use strict";
  const LB = (window.LB = {});

  // ---------- storage (always optional) ----------
  const P = "lb:";
  const store = (LB.store = {
    get(k, d) { try { const v = localStorage.getItem(P + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch {} },
  });

  // ---------- small helpers ----------
  LB.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  LB.h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  LB.$ = (sel, root = document) => root.querySelector(sel);
  LB.$$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  LB.shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  LB.pick = (a) => a[Math.floor(Math.random() * a.length)];
  LB.rand = (min, max) => min + Math.random() * (max - min);
  LB.css = (id, text) => { if (document.getElementById("css-" + id)) return; const s = document.createElement("style"); s.id = "css-" + id; s.textContent = text; document.head.appendChild(s); };
  LB.modalOpen = () => !!document.querySelector(".sheet-wrap, .pass");
  LB.typing = (e) => { const t = e.target; return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable); };
  LB.icon = {
    back: '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M12 3v13M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>',
    help: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z"/></svg>',
    sound: '<svg viewBox="0 0 24 24"><path d="M11 5L6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    mute: '<svg viewBox="0 0 24 24"><path d="M11 5L6 9H3v6h3l5 4zM22 9l-6 6M16 9l6 6"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    users: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/></svg>',
  };

  // ---------- haptics + sound ----------
  LB.buzz = (p) => { try { if (navigator.vibrate) navigator.vibrate(p); } catch {} };
  LB.muted = store.get("muted", false);
  let actx = null;
  const audio = () => {
    try {
      if (!actx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; actx = new AC(); }
      if (actx.state === "suspended") actx.resume();
      return actx;
    } catch { return null; }
  };
  // iOS only lets audio start inside a gesture, so warm the context on the first touch.
  const unlock = () => { audio(); window.removeEventListener("pointerdown", unlock, true); };
  window.addEventListener("pointerdown", unlock, true);
  function tone(freq, dur = 0.12, type = "sine", vol = 0.18, when = 0, slideTo) {
    if (LB.muted) return;
    const c = audio(); if (!c) return;
    try {
      const t = c.currentTime + when, o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.03);
    } catch {}
  }
  function noise(dur = 0.6, vol = 0.5) {
    if (LB.muted) return;
    const c = audio(); if (!c) return;
    try {
      const len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
      const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      f.type = "lowpass"; f.frequency.value = 900; g.gain.value = vol;
      s.buffer = buf; s.connect(f).connect(g).connect(c.destination); s.start();
    } catch {}
  }
  LB.sfx = {
    tap: () => tone(620, 0.05, "sine", 0.07),
    tick: () => tone(1100, 0.035, "square", 0.04),
    tock: () => tone(760, 0.035, "square", 0.04),
    count: () => tone(440, 0.14, "square", 0.08),
    go: () => tone(880, 0.3, "square", 0.1),
    good: () => { tone(660, 0.1, "sine", 0.2); tone(990, 0.18, "sine", 0.2, 0.09); },
    bad: () => tone(200, 0.28, "sawtooth", 0.1, 0, 110),
    skip: () => tone(420, 0.12, "triangle", 0.12, 0, 300),
    end: () => { tone(523, 0.14, "sine", 0.18); tone(659, 0.14, "sine", 0.18, 0.14); tone(784, 0.3, "sine", 0.18, 0.28); },
    buzzer: () => { tone(150, 0.5, "sawtooth", 0.13); tone(155, 0.5, "square", 0.06); },
    boom: () => { noise(0.9, 0.9); tone(90, 0.6, "sine", 0.4, 0, 40); },
  };
  LB.setMuted = (m) => { LB.muted = m; store.set("muted", m); };

  // ---------- keep the screen awake during timed play ----------
  let wl = null, wantWake = false;
  LB.wake = {
    async on() {
      wantWake = true;
      try { if ("wakeLock" in navigator && !wl) { wl = await navigator.wakeLock.request("screen"); wl.addEventListener("release", () => { wl = null; }); } } catch {}
    },
    off() { wantWake = false; try { if (wl) wl.release(); } catch {} wl = null; },
  };
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && wantWake) LB.wake.on(); });

  // ---------- scopes: everything a game starts gets torn down on exit ----------
  LB.scope = () => {
    const fns = [];
    const S = {
      alive: true,
      add(fn) { fns.push(fn); return fn; },
      on(target, ev, fn, opts) { target.addEventListener(ev, fn, opts); fns.push(() => target.removeEventListener(ev, fn, opts)); return fn; },
      timeout(fn, ms) { const id = setTimeout(() => { if (S.alive) fn(); }, ms); fns.push(() => clearTimeout(id)); return id; },
      interval(fn, ms) { const id = setInterval(() => { if (S.alive) fn(); }, ms); fns.push(() => clearInterval(id)); return id; },
      wait(ms) { return new Promise((r) => S.timeout(r, ms)); },
      timer(opts) { const t = LB.timer(opts); fns.push(() => t.stop()); return t; },
      dispose() { S.alive = false; while (fns.length) { try { fns.pop()(); } catch {} } },
    };
    return S;
  };

  // Countdown timer. Time spent with the tab hidden does not count.
  LB.timer = ({ seconds, onTick, onDone }) => {
    let left = seconds * 1000, last = 0, running = true, raf = 0, lastSec = Math.ceil(seconds);
    const loop = (now) => {
      if (!running) return;
      const dt = last ? Math.min(now - last, 250) : 0;
      last = now; left -= dt;
      if (left <= 0) { left = 0; running = false; if (onTick) onTick(0, 0, true); if (onDone) onDone(); return; }
      const s = Math.ceil(left / 1000);
      if (onTick) onTick(left / 1000, s, s !== lastSec);
      lastSec = s;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return {
      pause() { if (!running) return; running = false; cancelAnimationFrame(raf); },
      resume() { if (running || left <= 0) return; running = true; last = 0; raf = requestAnimationFrame(loop); },
      stop() { running = false; cancelAnimationFrame(raf); },
      get left() { return left / 1000; },
      get running() { return running; },
    };
  };

  // ---------- no-repeat decks that survive reloads ----------
  LB.deck = (id, n) => {
    const key = "seen:" + id;
    let seen = new Set((store.get(key, []) || []).filter((i) => Number.isInteger(i) && i < n));
    return {
      next(exclude) {
        let fresh = [];
        for (let i = 0; i < n; i++) if (!seen.has(i)) fresh.push(i);
        if (!fresh.length) { seen = new Set(); fresh = [...Array(n).keys()]; if (n > 1) LB.toast("Deck reshuffled"); }
        if (exclude != null && fresh.length > 1) fresh = fresh.filter((i) => i !== exclude);
        const i = LB.pick(fresh);
        seen.add(i); store.set(key, [...seen]);
        return i;
      },
      left() { return Math.max(0, n - seen.size); },
      size: n,
    };
  };

  // ---------- toast ----------
  let toastT;
  LB.toast = (msg) => {
    const t = document.getElementById("toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1700);
  };

  // ---------- sheets / confirm ----------
  LB.sheet = ({ title, body, actions = [{ label: "Got it", value: true, primary: true }], dismissable = true }) =>
    new Promise((resolve) => {
      const w = LB.h('<div class="sheet-wrap" role="dialog" aria-modal="true"><div class="sheet"><div class="sheet-grip"></div><h2 class="sheet-title"></h2><div class="sheet-body"></div><div class="sheet-actions"></div></div></div>');
      const tEl = w.querySelector(".sheet-title");
      if (title) tEl.textContent = title; else tEl.remove();
      const b = w.querySelector(".sheet-body");
      if (typeof body === "string") b.innerHTML = body; else if (body) b.appendChild(body); else b.remove();
      let closed = false;
      const done = (v) => {
        if (closed) return; closed = true;
        document.removeEventListener("keydown", onKey, true);
        w.classList.remove("show"); setTimeout(() => w.remove(), 180); resolve(v);
      };
      for (const a of actions) {
        const btn = document.createElement("button");
        btn.className = "btn" + (a.primary ? " primary" : "") + (a.danger ? " danger" : "");
        btn.textContent = a.label;
        btn.onclick = () => done(typeof a.value === "function" ? a.value() : a.value);
        w.querySelector(".sheet-actions").appendChild(btn);
      }
      w.addEventListener("click", (e) => { if (e.target === w && dismissable) done(null); });
      const onKey = (e) => { if (e.key === "Escape" && dismissable) { e.stopPropagation(); done(null); } };
      document.addEventListener("keydown", onKey, true);
      w._close = () => done(null);
      document.body.appendChild(w);
      requestAnimationFrame(() => w.classList.add("show"));
    });
  LB.confirm = (title, { yes = "Yes", no = "Cancel", danger = false, body } = {}) =>
    LB.sheet({ title, body, actions: [{ label: no, value: false }, { label: yes, value: true, primary: !danger, danger }] }).then(Boolean);

  // Full-screen hand-off so the next person doesn't see the last answer.
  LB.pass = ({ to, sub = "Hand the phone over. No peeking.", button = "I'm ready" }) =>
    new Promise((resolve) => {
      const w = LB.h('<div class="pass" role="dialog" aria-modal="true"><div class="pass-sub"></div><div class="pass-who"></div><button class="pass-go"></button></div>');
      w.querySelector(".pass-sub").textContent = sub;
      w.querySelector(".pass-who").textContent = to;
      const b = w.querySelector(".pass-go"); b.textContent = button;
      const onKey = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); b.click(); } };
      b.onclick = () => { document.removeEventListener("keydown", onKey, true); w.remove(); LB.sfx.tap(); resolve(); };
      document.addEventListener("keydown", onKey, true);
      document.body.appendChild(w);
      setTimeout(() => b.focus(), 50);
    });

  // Big 3-2-1 inside a container (container needs position: relative/fixed).
  LB.countdown = (container, S, from = 3) => new Promise((resolve) => {
    const el = LB.h('<div class="countdown" aria-live="assertive"></div>');
    container.appendChild(el);
    let n = from;
    const step = () => {
      if (!S.alive) return;
      if (n === 0) { el.remove(); LB.sfx.go(); LB.buzz(40); resolve(); return; }
      el.textContent = n; el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
      LB.sfx.count(); n--; S.timeout(step, 800);
    };
    step();
  });

  // ---------- players ----------
  LB.players = () => {
    const p = store.get("players", null);
    return Array.isArray(p) && p.length ? p.slice(0, 16).map(String) : ["Player 1", "Player 2", "Player 3"];
  };
  LB.editPlayers = ({ min = 2, max = 12, title = "Who's playing?" } = {}) => {
    const list = LB.players().slice(0, max);
    while (list.length < min) list.push("");
    const body = LB.h('<div class="pe"><div class="pe-list"></div><button class="btn pe-add" type="button">+ Add player</button><p class="muted small" style="margin:0">Saved on this phone for next time.</p></div>');
    const L = body.querySelector(".pe-list");
    const render = () => {
      L.innerHTML = "";
      list.forEach((name, i) => {
        const row = LB.h(`<div class="pe-row"><span class="pe-n mono">${i + 1}</span><input class="input" maxlength="16" autocomplete="off" autocapitalize="words" enterkeyhint="next"><button class="icon-btn pe-x" type="button" aria-label="Remove player ${i + 1}">${LB.icon.x}</button></div>`);
        const inp = row.querySelector("input");
        inp.value = name; inp.placeholder = `Player ${i + 1}`;
        inp.oninput = () => { list[i] = inp.value; };
        inp.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); const nx = L.querySelectorAll("input")[i + 1]; if (nx) nx.focus(); else inp.blur(); } };
        const x = row.querySelector(".pe-x");
        x.disabled = list.length <= min;
        x.onclick = () => { list.splice(i, 1); render(); };
        L.appendChild(row);
      });
      body.querySelector(".pe-add").disabled = list.length >= max;
    };
    body.querySelector(".pe-add").onclick = () => {
      if (list.length >= max) return;
      list.push(""); render();
      const ins = L.querySelectorAll("input"); ins[ins.length - 1].focus();
    };
    render();
    return LB.sheet({
      title, body,
      actions: [
        { label: "Cancel", value: null },
        { label: "Save", primary: true, value: () => { const clean = list.map((n, i) => (n || "").trim() || `Player ${i + 1}`); store.set("players", clean); return clean; } },
      ],
    });
  };
  // Compact "4 players: A, B, C… [Edit]" row.
  LB.playersBar = ({ min = 2, max = 12, onChange } = {}) => {
    const el = LB.h('<div class="players-bar"><span class="who"></span><button class="btn" type="button">Edit</button></div>');
    const paint = () => {
      const p = LB.players();
      el.querySelector(".who").textContent = `${p.length} players: ${p.join(", ")}`;
      el.classList.toggle("warn", p.length < min || p.length > max);
    };
    el.querySelector("button").onclick = async () => { const r = await LB.editPlayers({ min, max }); if (r) { paint(); if (onChange) onChange(r); } };
    paint();
    el.ensure = async () => {
      const p = LB.players();
      if (p.length >= min && p.length <= max) return p;
      LB.toast(p.length < min ? `This one needs at least ${min} players` : `Max ${max} players`);
      const r = await LB.editPlayers({ min, max }); paint();
      return r && r.length >= min && r.length <= max ? r : null;
    };
    return el;
  };

  // ---------- UI builders ----------
  LB.seg = (options, value, onChange) => {
    const el = LB.h('<div class="seg" role="group"></div>');
    const paint = () => [...el.children].forEach((c, i) => c.setAttribute("aria-pressed", String(options[i][0] === value)));
    options.forEach(([v, label]) => {
      const b = document.createElement("button"); b.type = "button"; b.textContent = label;
      b.onclick = () => { if (value === v) return; value = v; paint(); LB.sfx.tap(); onChange(v); };
      el.appendChild(b);
    });
    paint();
    el.set = (v) => { value = v; paint(); };
    return el;
  };
  LB.chips = (options, value, onChange, { wrap = false } = {}) => {
    const el = LB.h(`<nav class="chips${wrap ? " wrap" : ""}"></nav>`);
    const paint = () => [...el.children].forEach((c, i) => c.setAttribute("aria-pressed", String(options[i].id === value)));
    options.forEach((o) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "chip";
      b.innerHTML = (o.color ? `<span class="dot" style="background:${o.color}"></span>` : "") + LB.esc(o.name);
      b.onclick = () => { if (value === o.id) return; value = o.id; paint(); LB.sfx.tap(); onChange(o.id); };
      el.appendChild(b);
    });
    paint();
    return el;
  };
  LB.field = (label, control) => { const f = LB.h(`<div class="field"><span class="label">${LB.esc(label)}</span></div>`); f.appendChild(control); return f; };
  LB.toggle = (label, checked, onChange) => {
    const el = LB.h(`<label class="toggle"><span>${LB.esc(label)}</span><input type="checkbox"></label>`);
    const i = el.querySelector("input"); i.checked = !!checked; i.onchange = () => onChange(i.checked);
    return el;
  };
  LB.btn = (label, cls, onClick) => { const b = document.createElement("button"); b.type = "button"; b.className = "btn " + (cls || ""); b.textContent = label; if (onClick) b.onclick = onClick; return b; };
  LB.share = async (text) => {
    const url = location.origin + "/wyr/";
    try {
      if (navigator.share) { await navigator.share({ text, url }); return; }
      await navigator.clipboard.writeText(`${text}\n\n${url}`); LB.toast("Copied");
    } catch {}
  };
  LB.scoreboard = (rows) => {
    // rows: [{name, score}], sorted desc
    const el = LB.h('<div class="scores"></div>');
    const top = rows.length ? rows[0].score : 0;
    rows.forEach((r, i) => {
      const row = LB.h(`<div class="score-row${r.score === top && top > 0 ? " lead" : ""}"><span class="mono muted">${i + 1}</span><span class="n"></span><span class="s"></span></div>`);
      row.querySelector(".n").textContent = (r.score === top && top > 0 ? "👑 " : "") + r.name;
      row.querySelector(".s").textContent = r.score;
      el.appendChild(row);
    });
    return el;
  };
  // Left/right swipe on an element.
  LB.swipe = (S, el, { left, right }) => {
    let sx = 0, sy = 0, ok = false;
    S.on(el, "touchstart", (e) => { if (e.touches.length !== 1) { ok = false; return; } ok = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    S.on(el, "touchend", (e) => {
      if (!ok) return;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.4) { if (dx < 0 && left) left(); else if (dx > 0 && right) right(); }
    }, { passive: true });
  };

  // ---------- theme ----------
  const applyTheme = (t) => { if (t) document.documentElement.setAttribute("data-theme", t); else document.documentElement.removeAttribute("data-theme"); };
  applyTheme(store.get("theme", null));
  const isDark = () => getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() === "#0e0d0c";
  LB.toggleTheme = () => { const t = isDark() ? "light" : "dark"; store.set("theme", t); applyTheme(t); };

  // ---------- registry + router ----------
  const games = (LB.games = []);
  LB.register = (g) => { games.push(g); if (g.css) LB.css(g.id, g.css); };

  let current = null; // { game, scope, api }
  let cameFromHub = false;
  const top = () => document.getElementById("top");
  const view = () => document.getElementById("view");

  function teardown() {
    if (current) { current.scope.dispose(); current = null; }
    LB.wake.off();
    document.querySelectorAll(".full, .pass, .sheet-wrap").forEach((n) => n.remove());
    view().innerHTML = "";
  }

  const FILTERS = [
    { id: "all", name: "All games" },
    { id: "group", name: "Groups" },
    { id: "duo", name: "Just 2" },
    { id: "solo", name: "Solo" },
  ];
  function renderHub() {
    document.title = "Line Brain";
    top().innerHTML = "";
    top().append(
      LB.h('<div class="brand"><i></i>Line Brain</div>'),
      (() => {
        const r = LB.h('<div class="top-right"></div>');
        const snd = LB.h(`<button class="icon-btn" aria-label="Sound on or off">${LB.muted ? LB.icon.mute : LB.icon.sound}</button>`);
        snd.onclick = () => { LB.setMuted(!LB.muted); snd.innerHTML = LB.muted ? LB.icon.mute : LB.icon.sound; LB.toast(LB.muted ? "Sound off" : "Sound on"); };
        const th = LB.h(`<button class="icon-btn" aria-label="Light or dark">${LB.icon.moon}</button>`);
        th.onclick = LB.toggleTheme;
        r.append(snd, th);
        return r;
      })()
    );
    const v = view();
    v.appendChild(LB.h('<h2 class="hub-intro">Stuck in line?<br><span>Pick a game.</span></h2>'));
    let filter = store.get("hubFilter", "all");
    if (!FILTERS.some((f) => f.id === filter)) filter = "all";
    const grid = LB.h('<div class="grid"></div>');
    const paint = () => {
      grid.innerHTML = "";
      games.filter((g) => filter === "all" || (g.tags || []).includes(filter)).forEach((g) => {
        const t = LB.h(`<button class="tile" style="--c:${g.color}"><span class="pl"></span><span class="em" aria-hidden="true"></span><span class="nm"></span><span class="tg"></span></button>`);
        t.querySelector(".pl").textContent = g.players;
        t.querySelector(".em").textContent = g.emoji;
        t.querySelector(".nm").textContent = g.name;
        t.querySelector(".tg").textContent = g.tagline;
        t.setAttribute("aria-label", `${g.name}. ${g.tagline}. ${g.players} players.`);
        t.onclick = () => { cameFromHub = true; LB.sfx.tap(); location.hash = "#/" + g.id; };
        grid.appendChild(t);
      });
    };
    v.appendChild(LB.chips(FILTERS, filter, (f) => { filter = f; store.set("hubFilter", f); paint(); }));
    v.appendChild(grid);
    paint();
    v.appendChild(LB.h(`<p class="hub-foot">${games.length} games · works offline once loaded · add to Home Screen for full screen</p>`));
  }

  function mountGame(g) {
    document.title = g.name + " · Line Brain";
    const S = LB.scope();
    const api = { busy: () => false };
    current = { game: g, scope: S, api };
    top().innerHTML = "";
    const back = LB.h(`<button class="icon-btn" aria-label="All games">${LB.icon.back}</button>`);
    back.onclick = () => LB.home();
    const h1 = document.createElement("h1"); h1.textContent = g.name;
    const r = LB.h('<div class="top-right"></div>');
    const snd = LB.h(`<button class="icon-btn" aria-label="Sound on or off">${LB.muted ? LB.icon.mute : LB.icon.sound}</button>`);
    snd.onclick = () => { LB.setMuted(!LB.muted); snd.innerHTML = LB.muted ? LB.icon.mute : LB.icon.sound; LB.toast(LB.muted ? "Sound off" : "Sound on"); };
    const help = LB.h(`<button class="icon-btn" aria-label="How to play">${LB.icon.help}</button>`);
    help.onclick = () => LB.rules(g);
    r.append(snd, help);
    top().append(back, h1, r);
    try {
      g.mount(view(), S, api);
    } catch (err) {
      console.error(err);
      view().innerHTML = '<div class="card center"><p class="big">Something broke.</p><p class="muted">Reload the page to try again.</p></div>';
    }
    // First visit to a game: show how to play once.
    const seenKey = "rules:" + g.id;
    if (!store.get(seenKey, false)) { store.set(seenKey, true); S.timeout(() => { if (!LB.modalOpen() && !document.querySelector(".full")) LB.rules(g); }, 250); }
  }

  LB.rules = (g) => {
    const body = LB.h("<div><ol></ol></div>");
    g.rules.forEach((r) => { const li = document.createElement("li"); li.textContent = r; body.firstChild.appendChild(li); });
    return LB.sheet({ title: `How to play ${g.name}`, body });
  };

  LB.home = async () => {
    if (current && current.api.busy && current.api.busy()) {
      const ok = await LB.confirm("Leave this game?", { yes: "Leave", body: "<p class='muted' style='margin:0'>Your current round won't be saved.</p>" });
      if (!ok) return;
    }
    if (cameFromHub && history.length > 1) { cameFromHub = false; history.back(); }
    else location.hash = "#/";
  };

  function route() {
    const id = (location.hash.match(/^#\/([\w-]+)/) || [])[1];
    teardown();
    const g = games.find((x) => x.id === id);
    if (g) mountGame(g); else renderHub();
    window.scrollTo(0, 0);
  }

  LB.start = () => {
    window.addEventListener("hashchange", route);
    route();
    if ("serviceWorker" in navigator && location.protocol === "https:") {
      window.addEventListener("load", () => { navigator.serviceWorker.register("/wyr/sw.js", { scope: "/wyr/" }).catch(() => {}); });
    }
  };
})();
