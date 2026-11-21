/* Sketch It: draw the word on the phone, everyone guesses. */
(() => {
"use strict";
const WORDS = {
  easy: ["Cat","House","Sun","Tree","Car","Fish","Pizza","Star","Apple","Flower","Boat","Snowman","Ice cream","Rainbow","Umbrella","Cake","Ball","Clock","Moon","Glasses","Banana","Bird","Hat","Key","Cloud","Heart","Shoe","Spider","Door","Book","Chair","Eye","Guitar","Rocket","Bed","Cup","Egg","Ghost","Kite","Ladder","Lemon","Mouse","Nose","Phone","Robot","Snake","Sock","Tooth","Train","Bus"],
  medium: ["Lighthouse","Giraffe","Campfire","Snowboard","Waterfall","Toaster","Jellyfish","Skateboard","Castle","Volcano","Cactus","Dragon","Hamburger","Mermaid","Penguin","Tornado","Windmill","Scarecrow","Octopus","Roller coaster","Treasure chest","Unicorn","Traffic light","Ferris wheel","Hot air balloon","Teapot","Igloo","Palm tree","Sandcastle","Bicycle","Fireworks","Dinosaur","Ambulance","Parachute","Submarine","Kangaroo","Pirate ship","Popcorn","Vacuum","Bathtub","Escalator","Crown","Stroller","Birthday party","Haunted house","Swimming pool","Snail","Astronaut","Tent","Piano"],
  hard: ["Time travel","Jealousy","Homesick","Gravity","Wi-Fi","Déjà vu","Traffic jam","The internet","Bad haircut","Sleepwalking","Procrastination","First date","Monday morning","Brain freeze","Autocorrect","Group chat","Jet lag","Job interview","Peer pressure","Power outage","Midlife crisis","Karma","Echo","The Olympics","Black hole","Inflation","Global warming","Lie detector","Spoiler","Dad joke","Sugar rush","Reality TV","Selfie stick","Flash mob","Sore loser","Photobomb","Awkward hug","Lost and found","Parking ticket","Sneeze","Hiccups","Allergies","Nightmare","Heat wave","Pillow fight","Road trip","Surprise party","Blind date","Waiting in line","Daydream"],
};
const COLORS = ["#111111", "#e11d48", "#2563eb", "#16a34a", "#f59e0b"];

LB.register({
  id: "sketch",
  name: "Sketch It",
  emoji: "✏️",
  color: "#db2777",
  tagline: "Draw it on the phone. They guess.",
  players: "2+",
  tags: ["duo", "group"],
  rules: [
    "The drawer secretly sees a word, then has to draw it on the screen.",
    "Everyone else shouts guesses. No letters, numbers, or talking from the drawer.",
    "Forgot the word? Press and hold the eye button to peek.",
    "Tap Guessed it when someone gets it. With scoring on, the drawer and the guesser each get a point.",
    "Pass the phone to the next drawer.",
  ],
  css: `
.sk-full { padding: max(10px, env(safe-area-inset-top)) 10px calc(env(safe-area-inset-bottom) + 20px); gap: 8px; }
.sk-top { display: flex; align-items: center; gap: 8px; }
.sk-top .t { font-family: "JetBrains Mono", monospace; font-size: 22px; flex: 1; }
.sk-top .peek { width: auto; padding: 0 12px; gap: 6px; display: flex; font-size: 14px; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
.sk-word { position: absolute; left: 50%; top: 10px; transform: translateX(-50%); background: var(--ink); color: var(--bg); padding: 8px 14px; border-radius: 10px; font-weight: 800; z-index: 3; pointer-events: none; }
.sk-canvas-wrap { flex: 1; position: relative; border-radius: 16px; overflow: hidden; background: #fff; border: 1px solid var(--line); min-height: 0; }
.sk-canvas-wrap canvas { position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; }
.sk-tools { display: flex; align-items: center; gap: 6px; }
.sk-sw { width: 34px; height: 34px; border-radius: 50%; border: 3px solid var(--bg); box-shadow: 0 0 0 1px var(--line); flex: none; padding: 0; }
.sk-sw[aria-pressed="true"] { box-shadow: 0 0 0 3px var(--ink); }
.sk-tools .icon-btn { width: 38px; height: 38px; font-size: 15px; }
.sk-tools .sz[aria-pressed="true"] { background: var(--ink); color: var(--bg); }
.sk-act { display: grid; grid-template-columns: 1fr 1.4fr; gap: 8px; }
.sk-reveal { font-size: clamp(36px, 11vw, 56px); font-weight: 800; letter-spacing: -.03em; line-height: 1.05; margin: 0; overflow-wrap: anywhere; }
`,
  mount(root, S, api) {
    const store = LB.store;
    let diff = store.get("sk:diff", "easy");
    if (!WORDS[diff]) diff = "easy";
    let secs = store.get("sk:secs", 90);
    let keepScore = store.get("sk:score", false);
    const decks = {};
    const deckFor = (d) => (decks[d] = decks[d] || LB.deck("sk:" + d, WORDS[d].length));
    let g = null;

    function setup() {
      api.busy = () => false;
      root.innerHTML = "";
      const pbar = LB.playersBar({ min: 2, max: 12 });
      pbar.classList.toggle("hidden", !keepScore);
      const el = LB.h('<div class="stack"></div>');
      el.append(
        LB.h('<div class="card center"><div style="font-size:56px;line-height:1">✏️</div><p class="lead">One person draws. Everyone else guesses. No letters allowed.</p></div>'),
        LB.field("Words", LB.seg([["easy", "Easy"], ["medium", "Medium"], ["hard", "Hard"]], diff, (v) => { diff = v; store.set("sk:diff", v); })),
        LB.field("Time to draw", LB.seg([[60, "60 sec"], [90, "90 sec"], [120, "2 min"]], secs, (v) => { secs = v; store.set("sk:secs", v); })),
        LB.toggle("Keep score", keepScore, (v) => { keepScore = v; store.set("sk:score", v); pbar.classList.toggle("hidden", !v); }),
        pbar,
        LB.h('<div class="spacer"></div>'),
        LB.btn("Start", "primary big", async () => {
          let players = null;
          if (keepScore) { players = await pbar.ensure(); if (!players) return; }
          g = { players, scores: players ? players.map(() => 0) : null, turn: 0 };
          nextTurn();
        }),
      );
      root.appendChild(el);
    }

    async function nextTurn() {
      api.busy = () => !!(g.scores && g.scores.some((s) => s > 0));
      const drawer = g.players ? g.players[g.turn % g.players.length] : null;
      if (drawer) { await LB.pass({ to: drawer, sub: "You're drawing. Everyone else look away.", button: "Show my word" }); if (!S.alive) return; }
      let word = WORDS[diff][deckFor(diff).next()];
      root.innerHTML = "";
      const el = LB.h(`<div class="stack">
        <div class="card fill center"><span class="label">Your word · keep it secret</span><p class="sk-reveal"></p><p class="muted" style="margin:0">Draw it. No letters or numbers.</p></div>
        <button class="btn primary big go">Start drawing</button>
        <button class="btn swap">Different word</button>
      </div>`);
      const w = el.querySelector(".sk-reveal"); w.textContent = word;
      el.querySelector(".swap").onclick = () => { word = WORDS[diff][deckFor(diff).next()]; w.textContent = word; LB.sfx.tap(); };
      el.querySelector(".go").onclick = () => draw(word, drawer);
      root.appendChild(el);
    }

    function draw(word, drawer) {
      api.busy = () => true;
      const R = LB.scope(); S.add(() => R.dispose());
      const full = LB.h(`<div class="full sk-full" role="dialog" aria-label="Drawing">
        <div class="sk-top"><span class="t"></span><button class="icon-btn peek" aria-label="Hold to peek at the word">👁 Peek</button><button class="icon-btn quit" aria-label="Stop">${LB.icon.x}</button></div>
        <div class="sk-canvas-wrap"><canvas></canvas></div>
        <div class="sk-tools"></div>
        <div class="sk-act"><button class="btn giveup">Give up</button><button class="btn good got">Guessed it!</button></div>
      </div>`);
      document.body.appendChild(full);
      LB.wake.on();
      const wrap = full.querySelector(".sk-canvas-wrap"), cv = full.querySelector("canvas"), ctx = cv.getContext("2d");
      const strokes = [];
      let color = COLORS[0], size = 6, cur = null;

      // tools
      const tools = full.querySelector(".sk-tools");
      COLORS.forEach((c) => {
        const b = LB.h(`<button class="sk-sw" aria-label="Color" style="background:${c}"></button>`);
        b.onclick = () => { color = c; paintTools(); };
        tools.appendChild(b);
      });
      tools.appendChild(LB.h('<span class="spacer"></span>'));
      const thin = LB.h('<button class="icon-btn sz" aria-label="Thin pen">•</button>');
      const thick = LB.h('<button class="icon-btn sz" aria-label="Thick pen" style="font-size:24px">●</button>');
      const undo = LB.h('<button class="icon-btn" aria-label="Undo"><svg viewBox="0 0 24 24"><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg></button>');
      const clear = LB.h('<button class="icon-btn" aria-label="Clear"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg></button>');
      thin.onclick = () => { size = 6; paintTools(); };
      thick.onclick = () => { size = 16; paintTools(); };
      undo.onclick = () => { strokes.pop(); redraw(); };
      clear.onclick = () => { if (!strokes.length) return; strokes.length = 0; redraw(); };
      tools.append(thin, thick, undo, clear);
      function paintTools() {
        [...tools.querySelectorAll(".sk-sw")].forEach((b, i) => b.setAttribute("aria-pressed", String(COLORS[i] === color)));
        thin.setAttribute("aria-pressed", String(size === 6)); thick.setAttribute("aria-pressed", String(size === 16));
      }
      paintTools();

      // canvas
      let scale = 1;
      const fit = () => {
        const r = wrap.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 3);
        cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
        scale = dpr; redraw();
      };
      const seg = (s, a, b) => {
        ctx.strokeStyle = s.color; ctx.lineWidth = s.size * scale; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(a[0] * scale, a[1] * scale); ctx.lineTo(b[0] * scale, b[1] * scale); ctx.stroke();
      };
      function redraw() {
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
        for (const s of strokes) {
          if (s.pts.length === 1) seg(s, s.pts[0], s.pts[0]);
          for (let i = 1; i < s.pts.length; i++) seg(s, s.pts[i - 1], s.pts[i]);
        }
      }
      const pos = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
      R.on(cv, "pointerdown", (e) => {
        if (cur) return;
        e.preventDefault();
        try { cv.setPointerCapture(e.pointerId); } catch {}
        cur = { color, size, pts: [pos(e)], id: e.pointerId };
        strokes.push(cur); seg(cur, cur.pts[0], cur.pts[0]);
      });
      R.on(cv, "pointermove", (e) => {
        if (!cur || e.pointerId !== cur.id) return;
        const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
        for (const ev of evs.length ? evs : [e]) { const p = pos(ev), last = cur.pts[cur.pts.length - 1]; cur.pts.push(p); seg(cur, last, p); }
      });
      const up = (e) => { if (cur && e.pointerId === cur.id) cur = null; };
      R.on(cv, "pointerup", up); R.on(cv, "pointercancel", up);
      R.on(window, "resize", fit);
      requestAnimationFrame(fit);

      // peek
      const peek = full.querySelector(".peek");
      let tag = null;
      const showWord = (e) => { e.preventDefault(); if (tag) return; tag = LB.h('<div class="sk-word"></div>'); tag.textContent = word; wrap.appendChild(tag); };
      const hideWord = () => { if (tag) { tag.remove(); tag = null; } };
      R.on(peek, "pointerdown", showWord); R.on(peek, "pointerup", hideWord); R.on(peek, "pointerleave", hideWord); R.on(peek, "pointercancel", hideWord);
      R.on(peek, "contextmenu", (e) => e.preventDefault());

      const tEl = full.querySelector(".t");
      const t = R.timer({
        seconds: secs,
        onTick: (l, s, ch) => { tEl.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; if (ch && s <= 5 && s > 0) LB.sfx.tick(); },
        onDone: () => { LB.sfx.buzzer(); LB.buzz([120, 60, 120]); finish(false); },
      });
      full.querySelector(".got").onclick = () => finish(true);
      full.querySelector(".giveup").onclick = () => finish(false);
      full.querySelector(".quit").onclick = async () => {
        t.pause();
        if (await LB.confirm("Stop drawing?", { yes: "Stop", no: "Keep drawing" })) finish(false); else t.resume();
      };
      function finish(got) {
        const used = Math.round(secs - t.left);
        t.stop(); R.dispose(); full.remove(); LB.wake.off();
        result(word, drawer, got, used);
      }
    }

    function result(word, drawer, got, used) {
      root.innerHTML = "";
      const el = LB.h(`<div class="stack">
        <div class="card center pop"><span class="label"></span><p class="sk-reveal"></p><span class="muted sub"></span></div>
        <div class="who hidden stack"><span class="label">Who guessed it?</span><div class="chips wrap"></div></div>
        <div class="board"></div>
        <div class="spacer"></div>
        <button class="btn primary big next"></button>
        <button class="btn end">End game</button>
      </div>`);
      el.querySelector(".label").textContent = got ? "Got it!" : "Nobody got it. The word was";
      el.querySelector(".sk-reveal").textContent = word;
      el.querySelector(".sub").textContent = got ? `in ${used} second${used === 1 ? "" : "s"}` : "";
      const next = el.querySelector(".next");
      const nextName = g.players ? g.players[(g.turn + 1) % g.players.length] : null;
      next.textContent = nextName ? `${nextName} draws next →` : "Next drawing →";
      const board = () => { const b = el.querySelector(".board"); b.innerHTML = ""; if (g.scores) b.appendChild(LB.scoreboard(g.players.map((name, i) => ({ name, score: g.scores[i] })).sort((a, b2) => b2.score - a.score))); };
      if (got) LB.sfx.good(); else LB.sfx.skip();
      if (got && g.players) {
        const who = el.querySelector(".who"), chips = who.querySelector(".chips");
        who.classList.remove("hidden");
        next.disabled = true;
        const di = g.turn % g.players.length;
        g.players.forEach((n, i) => {
          if (i === di) return;
          const c = LB.h('<button class="chip"></button>'); c.textContent = n;
          c.onclick = () => {
            g.scores[i] += 1; g.scores[di] += 1; LB.sfx.tap();
            who.remove(); next.disabled = false; board();
            LB.toast(`+1 ${n}, +1 ${g.players[di]}`);
          };
          chips.appendChild(c);
        });
      }
      board();
      next.onclick = () => { g.turn += 1; nextTurn(); };
      el.querySelector(".end").onclick = () => {
        if (!g.scores) return setup();
        api.busy = () => false;
        root.innerHTML = "";
        const rows = g.players.map((name, i) => ({ name, score: g.scores[i] })).sort((a, b) => b.score - a.score);
        const fin = LB.h('<div class="stack"><div class="card center pop"><span class="label">Winner</span><p class="big"></p></div><div class="b"></div><div class="spacer"></div></div>');
        const top = rows[0].score;
        fin.querySelector(".big").textContent = top ? rows.filter((r) => r.score === top).map((r) => r.name).join(" & ") : "Nobody scored";
        fin.querySelector(".b").replaceWith(LB.scoreboard(rows));
        fin.append(LB.btn("New game", "primary big", setup));
        root.appendChild(fin);
        LB.sfx.end();
      };
      root.appendChild(el);
    }

    setup();
  },
});
})();
