/* Quick Draw: two-player reaction duel on one phone, plus a solo reaction test. */
(() => {
"use strict";
LB.register({
  id: "quickdraw",
  name: "Quick Draw",
  emoji: "⚡",
  color: "#16a34a",
  tagline: "Tap first when it turns green. One phone, two thumbs.",
  players: "1–2",
  tags: ["solo", "duo"],
  rules: [
    "Duel: hold the phone flat between you. Each player gets one half of the screen.",
    "Hit Start, then wait. When your half turns green, tap it as fast as you can.",
    "Tap before green and you give the point away.",
    "First to 3 points wins the match.",
    "Solo: 5 taps, and your average reaction time is your score. Under 250 ms is very good.",
  ],
  css: `
.qd-full { padding: 0; display: grid; grid-template-rows: 1fr auto 1fr; background: #111; color: #fff; user-select: none; -webkit-user-select: none; }
.qd-half { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; touch-action: none; padding: 20px; transition: background-color .08s; background: #27272a; }
.qd-half.top { transform: rotate(180deg); padding-top: max(20px, env(safe-area-inset-bottom)); }
.qd-half.bot { padding-bottom: calc(env(safe-area-inset-bottom) + 24px); }
.qd-half.wait { background: #3f1d1d; }
.qd-half.go { background: #16a34a; }
.qd-half.win { background: #2563eb; }
.qd-half.lose { background: #27272a; opacity: .7; }
.qd-half.foul { background: #b91c1c; }
.qd-name { font-weight: 800; font-size: 18px; opacity: .85; }
.qd-msg { font-size: clamp(34px, 10vw, 56px); font-weight: 800; letter-spacing: -.03em; line-height: 1; }
.qd-sub { font-size: 15px; opacity: .75; min-height: 1.2em; }
.qd-pips { display: flex; gap: 6px; }
.qd-pips i { width: 12px; height: 12px; border-radius: 50%; border: 2px solid rgba(255,255,255,.6); }
.qd-pips i.on { background: #fff; border-color: #fff; }
.qd-mid { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 10px; background: #111; }
.qd-mid .btn { min-width: 160px; background: #fff; color: #111; border: 0; }
.qd-mid .icon-btn { background: #27272a; border-color: #3f3f46; color: #fff; }
.qd-solo { padding: 0; background: #27272a; color: #fff; user-select: none; -webkit-user-select: none; }
.qd-solo .qd-tap { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 12px; text-align: center; touch-action: none; padding: 24px; transition: background-color .08s; }
.qd-solo .qd-tap.wait { background: #3f1d1d; }
.qd-solo .qd-tap.go { background: #16a34a; }
.qd-solo .qd-tap.foul { background: #b91c1c; }
.qd-solo .icon-btn { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.2); color: #fff; }
.qd-tries { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; font-family: "JetBrains Mono", monospace; font-size: 14px; }
.qd-tries span { background: rgba(255,255,255,.12); padding: 5px 9px; border-radius: 8px; }
`,
  mount(root, S, api) {
    const store = LB.store;
    let mode = store.get("qd:mode", "duel");
    const pl = LB.players();
    const names = store.get("qd:names", [pl[0] || "Player 1", pl[1] || "Player 2"]);

    function setup() {
      api.busy = () => false;
      root.innerHTML = "";
      const el = LB.h('<div class="stack"></div>');
      const nameRow = LB.h('<div class="stack"></div>');
      ["Bottom player", "Top player"].forEach((label, i) => {
        const inp = LB.h('<input class="input" maxlength="16" autocomplete="off" autocapitalize="words">');
        inp.value = names[i]; inp.placeholder = label;
        inp.oninput = () => { names[i] = inp.value; store.set("qd:names", names); };
        nameRow.appendChild(LB.field(label, inp));
      });
      const best = store.get("qd:best", null);
      const bestEl = LB.h(`<p class="muted center" style="margin:0"></p>`);
      bestEl.textContent = best ? `Your best solo average: ${best} ms` : "";
      nameRow.classList.toggle("hidden", mode !== "duel");
      bestEl.classList.toggle("hidden", mode !== "solo");
      el.append(
        LB.h('<div class="card center"><div style="font-size:56px;line-height:1">⚡</div><p class="lead">Wait for green. Tap first. Too early and you lose the point.</p></div>'),
        LB.field("Mode", LB.seg([["duel", "Duel (2 players)"], ["solo", "Solo test"]], mode, (m) => {
          mode = m; store.set("qd:mode", m); nameRow.classList.toggle("hidden", m !== "duel"); bestEl.classList.toggle("hidden", m !== "solo");
        })),
        nameRow, bestEl,
        LB.h('<div class="spacer"></div>'),
        LB.btn("Start", "primary big", () => (mode === "duel" ? duel() : solo())),
      );
      root.appendChild(el);
    }

    // ---------- duel ----------
    function duel() {
      api.busy = () => true;
      const R = LB.scope(); S.add(() => R.dispose());
      const N = names.map((n, i) => (n || "").trim() || `Player ${i + 1}`);
      const score = [0, 0], WIN = 3;
      let state = "idle", goAt = 0;
      const full = LB.h(`<div class="full qd-full" role="dialog" aria-label="Quick Draw duel">
        <div class="qd-half top" data-p="1"><div class="qd-name"></div><div class="qd-pips"></div><div class="qd-msg">Ready</div><div class="qd-sub"></div></div>
        <div class="qd-mid"><button class="icon-btn qd-x" aria-label="Quit">${LB.icon.x}</button><button class="btn big qd-go">Start</button></div>
        <div class="qd-half bot" data-p="0"><div class="qd-name"></div><div class="qd-pips"></div><div class="qd-msg">Ready</div><div class="qd-sub"></div></div>
      </div>`);
      document.body.appendChild(full);
      LB.wake.on();
      const halves = [full.querySelector(".bot"), full.querySelector(".top")];
      const goBtn = full.querySelector(".qd-go");
      const paint = () => halves.forEach((h, i) => {
        h.querySelector(".qd-name").textContent = N[i];
        h.querySelector(".qd-pips").innerHTML = Array.from({ length: WIN }, (_, k) => `<i class="${k < score[i] ? "on" : ""}"></i>`).join("");
      });
      const set = (i, cls, msg, sub = "") => { const h = halves[i]; h.className = `qd-half ${i ? "top" : "bot"} ${cls}`; h.querySelector(".qd-msg").textContent = msg; h.querySelector(".qd-sub").textContent = sub; };
      paint();
      set(0, "", "Ready", "Tap when it turns green"); set(1, "", "Ready", "Tap when it turns green");

      let waitT = null;
      goBtn.onclick = () => {
        if (score[0] >= WIN || score[1] >= WIN) { score[0] = score[1] = 0; paint(); }
        state = "wait"; goBtn.disabled = true; goBtn.textContent = "Wait…";
        set(0, "wait", "Wait…"); set(1, "wait", "Wait…");
        LB.sfx.count();
        waitT = R.timeout(() => {
          state = "go"; goAt = performance.now();
          set(0, "go", "TAP!"); set(1, "go", "TAP!");
          LB.sfx.go(); LB.buzz(30);
        }, LB.rand(1500, 4500));
      };
      halves.forEach((h, i) => R.on(h, "pointerdown", (e) => {
        e.preventDefault();
        if (state === "wait") {
          clearTimeout(waitT); state = "result";
          score[1 - i] += 1;
          set(i, "foul", "Too early!", `Point to ${N[1 - i]}`); set(1 - i, "win", "Free point", `${N[i]} jumped the gun`);
          LB.sfx.bad(); LB.buzz([60, 40, 60]);
          roundOver();
        } else if (state === "go") {
          state = "result";
          const ms = Math.round(performance.now() - goAt);
          score[i] += 1;
          set(i, "win", `${ms} ms`, "You win the round"); set(1 - i, "lose", "Too slow", `${N[i]} got it in ${ms} ms`);
          LB.sfx.good(); LB.buzz(40);
          roundOver();
        }
      }));
      function roundOver() {
        paint();
        const winner = score.findIndex((s) => s >= WIN);
        R.timeout(() => {
          goBtn.disabled = false;
          if (winner >= 0) {
            set(winner, "win", "Winner!", `${score[winner]}–${score[1 - winner]}`); set(1 - winner, "lose", "Beaten", `${score[1 - winner]}–${score[winner]}`);
            goBtn.textContent = "Rematch"; LB.sfx.end();
          } else goBtn.textContent = "Next round";
        }, 900);
      }
      full.querySelector(".qd-x").onclick = () => { R.dispose(); full.remove(); LB.wake.off(); setup(); };
    }

    // ---------- solo ----------
    function solo() {
      api.busy = () => true;
      const R = LB.scope(); S.add(() => R.dispose());
      const TRIES = 5, times = [];
      let state = "idle", goAt = 0, waitT = null;
      const full = LB.h(`<div class="full qd-solo" role="dialog" aria-label="Reaction test"><button class="icon-btn full-x" aria-label="Quit">${LB.icon.x}</button>
        <div class="qd-tap"><div class="qd-msg">Tap to start</div><div class="qd-sub"></div><div class="qd-tries"></div></div></div>`);
      document.body.appendChild(full);
      const tap = full.querySelector(".qd-tap"), msg = full.querySelector(".qd-msg"), sub = full.querySelector(".qd-sub"), tries = full.querySelector(".qd-tries");
      const paint = () => { tries.innerHTML = times.map((t) => `<span>${t}</span>`).join(""); };
      sub.textContent = `${TRIES} taps. Wait for green.`;
      const arm = () => {
        state = "wait"; tap.className = "qd-tap wait"; msg.textContent = "Wait…"; sub.textContent = `${times.length + 1} of ${TRIES}`;
        waitT = R.timeout(() => { state = "go"; goAt = performance.now(); tap.className = "qd-tap go"; msg.textContent = "TAP!"; LB.sfx.go(); }, LB.rand(1200, 4000));
      };
      R.on(tap, "pointerdown", (e) => {
        e.preventDefault();
        if (state === "idle") arm();
        else if (state === "wait") {
          clearTimeout(waitT); state = "idle"; tap.className = "qd-tap foul"; msg.textContent = "Too soon!"; sub.textContent = "Tap to try that one again"; LB.sfx.bad(); LB.buzz(60);
        } else if (state === "go") {
          const ms = Math.round(performance.now() - goAt);
          times.push(ms); paint(); LB.sfx.good();
          tap.className = "qd-tap"; msg.textContent = `${ms} ms`;
          if (times.length >= TRIES) {
            state = "done";
            const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
            const prev = store.get("qd:best", null);
            if (prev == null || avg < prev) store.set("qd:best", avg);
            msg.textContent = `${avg} ms`;
            sub.textContent = prev == null || avg < prev ? "Average: new personal best!" : `Average. Best: ${prev} ms`;
            LB.sfx.end();
            R.timeout(() => { state = "restart"; sub.textContent += " · Tap to go again"; }, 900);
          } else { state = "idle"; sub.textContent = "Tap for the next one"; }
        } else if (state === "restart") { times.length = 0; paint(); arm(); }
      });
      full.querySelector(".full-x").onclick = () => { R.dispose(); full.remove(); setup(); };
    }

    setup();
  },
});
})();
