/* Finger Pick: everyone puts a finger on the screen, the phone chooses. */
(() => {
"use strict";
const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#f97316", "#06b6d4", "#ec4899", "#84cc16", "#f43f5e", "#6366f1", "#14b8a6"];
const TEAM = ["#ef4444", "#3b82f6", "#22c55e", "#eab308"];
const HOLD = 2000;

LB.register({
  id: "fingerpick",
  name: "Finger Pick",
  emoji: "☝️",
  color: "#475569",
  tagline: "Everyone touch the screen. The phone decides who goes first, pays, or picks.",
  players: "2–10",
  tags: ["duo", "group"],
  rules: [
    "Lay the phone flat. Everyone puts one finger on the screen.",
    "Keep still. After two seconds with nobody moving on or off, the phone chooses.",
    "Pick one: one person is chosen. Pick several: choose how many.",
    "Teams: everyone is split into evenly sized, randomly colored teams.",
    "Lift all fingers to go again.",
  ],
  css: `
.fp-full { padding: 0; background: #0b0b0c; color: #fff; touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; overflow: hidden; }
.fp-full .full-x { z-index: 5; background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.2); color: #fff; }
.fp-hint { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; text-align: center; padding: 24px; pointer-events: none; transition: opacity .2s; }
.fp-hint b { font-size: clamp(26px, 8vw, 40px); letter-spacing: -.02em; }
.fp-hint span { opacity: .6; font-size: 15px; }
.fp-dot { position: absolute; width: 96px; height: 96px; margin: -48px 0 0 -48px; border-radius: 50%; pointer-events: none; transition: transform .25s cubic-bezier(.2,.8,.2,1), opacity .25s, background-color .25s; }
.fp-dot::before { content: ""; position: absolute; inset: 14px; border-radius: 50%; background: currentColor; }
.fp-dot svg { position: absolute; inset: 0; transform: rotate(-90deg); overflow: visible; }
.fp-dot circle { fill: none; stroke: currentColor; stroke-width: 6; stroke-linecap: round; opacity: .9; }
.fp-dot.in { animation: fpIn .25s cubic-bezier(.2,.8,.2,1); }
.fp-dot.win { transform: scale(1.5); animation: fpPulse 1s ease-in-out infinite; z-index: 2; }
.fp-dot.lose { opacity: .15; transform: scale(.7); }
.fp-dot .tn { position: absolute; left: 50%; top: -34px; transform: translateX(-50%); font-weight: 800; font-size: 15px; white-space: nowrap; color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,.6); }
@keyframes fpIn { from { transform: scale(.3); opacity: 0; } }
@keyframes fpPulse { 50% { transform: scale(1.65); } }
.fp-banner { position: absolute; left: 0; right: 0; bottom: calc(env(safe-area-inset-bottom) + 28px); text-align: center; font-weight: 800; font-size: 18px; pointer-events: none; opacity: .85; }
@media (prefers-reduced-motion: reduce) { .fp-dot.win { animation: none; } }
`,
  mount(root, S, api) {
    const store = LB.store;
    let mode = store.get("fp:mode", "one");
    let n = store.get("fp:n", 2);
    let teams = store.get("fp:teams", 2);

    function setup() {
      api.busy = () => false;
      root.innerHTML = "";
      const nField = LB.field("How many to pick", LB.seg([[2, "2"], [3, "3"], [4, "4"]], n, (v) => { n = v; store.set("fp:n", v); }));
      const tField = LB.field("Number of teams", LB.seg([[2, "2"], [3, "3"], [4, "4"]], teams, (v) => { teams = v; store.set("fp:teams", v); }));
      const sync = () => { nField.classList.toggle("hidden", mode !== "many"); tField.classList.toggle("hidden", mode !== "teams"); };
      const el = LB.h('<div class="stack"></div>');
      el.append(
        LB.h('<div class="card center"><div style="font-size:56px;line-height:1">☝️</div><p class="lead">Everyone puts a finger down. The phone picks. No arguing.</p></div>'),
        LB.field("Mode", LB.seg([["one", "Pick one"], ["many", "Pick several"], ["teams", "Teams"]], mode, (m) => { mode = m; store.set("fp:mode", m); sync(); })),
        nField, tField,
        LB.h('<p class="muted small center" style="margin:0">Works best with the phone flat on a table. Up to 10 fingers, depending on the phone.</p>'),
        LB.h('<div class="spacer"></div>'),
        LB.btn("Open the touch pad", "primary big", pad),
      );
      sync();
      root.appendChild(el);
    }

    function pad() {
      const R = LB.scope(); S.add(() => R.dispose());
      api.busy = () => false;
      const full = LB.h(`<div class="full fp-full" role="application" aria-label="Touch pad. Everyone place one finger."><button class="icon-btn full-x" aria-label="Close">${LB.icon.x}</button>
        <div class="fp-hint"><b>Fingers on the screen</b><span></span></div><div class="fp-banner"></div></div>`);
      document.body.appendChild(full);
      LB.wake.on();
      const hint = full.querySelector(".fp-hint"), hintSub = hint.querySelector("span"), banner = full.querySelector(".fp-banner");
      const need = mode === "one" ? 2 : mode === "many" ? n + 1 : teams;
      hintSub.textContent = mode === "one" ? "Needs 2 or more" : mode === "many" ? `Picks ${n}. Needs ${need} or more` : `${teams} teams. Needs ${need} or more`;
      const touches = new Map(); // pointerId -> {x, y, el, color}
      let state = "waiting", armT = null, raf = 0, armedAt = 0, usedColors = [];
      const C = 2 * Math.PI * 44;

      const nextColor = () => { const free = COLORS.filter((c) => !usedColors.includes(c)); const c = free.length ? free[0] : LB.pick(COLORS); usedColors.push(c); return c; };
      function add(e) {
        const r = full.getBoundingClientRect();
        const color = nextColor();
        const d = LB.h(`<div class="fp-dot in"><svg viewBox="0 0 96 96"><circle cx="48" cy="48" r="44" stroke-dasharray="${C}" stroke-dashoffset="${C}"></circle></svg></div>`);
        d.style.color = color;
        d.style.left = e.clientX - r.left + "px"; d.style.top = e.clientY - r.top + "px";
        full.appendChild(d);
        touches.set(e.pointerId, { el: d, color });
        LB.buzz(12); LB.sfx.tap();
      }
      function remove(id) {
        const t = touches.get(id); if (!t) return;
        t.el.remove(); touches.delete(id);
        usedColors = usedColors.filter((c) => c !== t.color);
      }
      function paintHint() {
        hint.style.opacity = touches.size ? "0" : "1";
        banner.textContent = state === "waiting" && touches.size && touches.size < need ? `${touches.size} finger${touches.size > 1 ? "s" : ""}… need ${need}` : state === "armed" ? "Hold still…" : "";
      }
      function disarm() {
        clearTimeout(armT); cancelAnimationFrame(raf); armT = null;
        touches.forEach((t) => t.el.querySelector("circle").setAttribute("stroke-dashoffset", C));
        if (state === "armed") state = "waiting";
      }
      function arm() {
        disarm();
        if (touches.size < need) { paintHint(); return; }
        state = "armed"; armedAt = performance.now();
        const ring = () => {
          const p = Math.min(1, (performance.now() - armedAt) / HOLD);
          touches.forEach((t) => t.el.querySelector("circle").setAttribute("stroke-dashoffset", C * (1 - p)));
          if (p < 1) raf = requestAnimationFrame(ring);
        };
        raf = requestAnimationFrame(ring);
        armT = R.timeout(choose, HOLD);
        LB.sfx.tick();
        paintHint();
      }
      function choose() {
        state = "chosen"; cancelAnimationFrame(raf);
        const ids = LB.shuffle([...touches.keys()]);
        touches.forEach((t) => t.el.querySelector("circle").setAttribute("stroke-dashoffset", 0));
        if (mode === "teams") {
          ids.forEach((id, i) => {
            const t = touches.get(id), k = i % teams;
            t.el.style.color = TEAM[k];
            t.el.classList.add("win"); t.el.style.animationDelay = `${(i % teams) * 0.08}s`;
            const tag = document.createElement("span"); tag.className = "tn"; tag.textContent = `Team ${k + 1}`; t.el.appendChild(tag);
          });
          banner.textContent = `${teams} teams of ~${Math.round(ids.length / teams)} · lift to reset`;
        } else {
          const k = mode === "one" ? 1 : n;
          ids.forEach((id, i) => {
            const t = touches.get(id);
            if (i < k) { t.el.classList.add("win"); if (k > 1) { const tag = document.createElement("span"); tag.className = "tn"; tag.textContent = `#${i + 1}`; t.el.appendChild(tag); } }
            else t.el.classList.add("lose");
          });
          banner.textContent = "Lift all fingers to go again";
        }
        LB.sfx.good(); LB.buzz([60, 40, 120]);
      }
      R.on(full, "pointerdown", (e) => {
        if (e.target.closest(".full-x")) return;
        e.preventDefault();
        if (state === "chosen") return;
        try { full.setPointerCapture(e.pointerId); } catch {}
        add(e); arm();
      });
      R.on(full, "pointermove", (e) => {
        const t = touches.get(e.pointerId); if (!t) return;
        const r = full.getBoundingClientRect();
        t.el.style.left = e.clientX - r.left + "px"; t.el.style.top = e.clientY - r.top + "px";
      });
      const up = (e) => {
        if (!touches.has(e.pointerId)) return;
        if (state === "chosen") {
          // Keep the result on screen until every finger is lifted.
          const t = touches.get(e.pointerId); touches.delete(e.pointerId);
          if (!touches.size) { R.timeout(() => { if (!touches.size) reset(); }, 700); }
          t.el.dataset.lifted = "1";
          return;
        }
        remove(e.pointerId); arm(); paintHint();
      };
      R.on(full, "pointerup", up);
      R.on(full, "pointercancel", up);
      R.on(full, "contextmenu", (e) => e.preventDefault());
      R.on(full, "touchstart", (e) => { if (!e.target.closest(".full-x")) e.preventDefault(); }, { passive: false });
      function reset() {
        state = "waiting";
        full.querySelectorAll(".fp-dot").forEach((d) => d.remove());
        touches.clear(); usedColors = [];
        paintHint();
      }
      full.querySelector(".full-x").onclick = () => { R.dispose(); full.remove(); LB.wake.off(); };
      paintHint();
    }

    setup();
  },
});
})();
