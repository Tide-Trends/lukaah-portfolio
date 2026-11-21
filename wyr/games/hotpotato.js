/* Hot Potato: say one, pass the phone, don't be holding it when it blows. */
(() => {
"use strict";
const PROMPTS = ["Pizza toppings","Things in a fridge","Countries in Europe","Dog breeds","Words that rhyme with \"cat\"","Car brands","Things that are red","Breakfast foods","Disney movies","Sports with a ball","Fruits","Vegetables","Body parts","Things in a bathroom","Ice cream flavors","Board games","Superheroes","Musical instruments","Things you'd take camping","US states","Animals with four legs","Things that fly","Fast food chains","Cereal brands","Things at the beach","School subjects","Jobs with a uniform","Kitchen tools","Pokémon","Video games","Words starting with \"ST\"","Things that are cold","Things in a wallet","Apps on your phone","Colors","Things with wheels","Halloween costumes","Candy","Drinks","Clothing","Famous singers","Things that are sticky","Shapes","Capital cities","Things in a classroom","Excuses for being late","Things you plug in","Things in space","Flowers","Things that are round","Ocean animals","Insects","Birds","Things with buttons","Words that rhyme with \"day\"","Things you say to a baby","Pasta shapes","Things that smell bad","Things at a wedding","Things in a purse","Cartoon characters","Things that make noise","Hairstyles","Things in a hospital","Olympic sports","Things with a screen","Dances","Things that are yellow","Movie villains","Sandwich fillings","Things that are soft","Car parts","Things you do in the morning","Types of shoes","Things in a gym","Mythical creatures","Things at a birthday party","Words that start with \"Q\"","Pets","Ways to say hello","Things you can't take on a plane","Desserts","Weather words","Things people collect","Zoo animals","Card games","Spicy foods","Words ending in \"-ing\"","Things that are hot","Things that are green","Things in a toolbox","Famous athletes","TV shows","Sneaker brands","Things in an office","Things in the sky","Things you can fold","Things that bounce","Animals with a tail","Holiday traditions","Cheeses","Languages","Planets and moons","Things in a car","Social media apps","Things at the movies","Coffee drinks","Things that melt","Farm animals","Things that come in pairs"];
const FUSES = { short: [10, 25], normal: [20, 45], long: [35, 70] };

LB.register({
  id: "hotpotato",
  name: "Hot Potato",
  emoji: "💣",
  color: "#dc2626",
  tagline: "Name one, pass it fast. Don't hold it when it blows.",
  players: "3+",
  tags: ["group"],
  rules: [
    "Start the round and read the category out loud.",
    "Whoever holds the phone says something that fits, then passes it to the next person. No repeats.",
    "The fuse is hidden and random. The ticking speeds up as it burns.",
    "Whoever's holding the phone when it explodes loses the round.",
    "Stuck on a category? Tap New category. The fuse keeps burning.",
  ],
  css: `
.hp-full { background: #1c1917; color: #fafaf9; text-align: center; overflow: hidden; }
.hp-full .icon-btn { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.2); color: #fff; }
.hp-body { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 18px; padding: 0 8px; }
.hp-bomb { font-size: 96px; line-height: 1; transition: transform .08s ease; }
.hp-bomb.beat { transform: scale(1.12); }
.hp-k { font-family: "JetBrains Mono", monospace; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; opacity: .65; }
.hp-p { font-size: clamp(30px, 9vw, 46px); font-weight: 800; letter-spacing: -.025em; line-height: 1.08; max-width: 16ch; overflow-wrap: anywhere; }
.hp-s { opacity: .7; font-size: 16px; }
.hp-new { background: rgba(255,255,255,.1); color: #fff; border-color: rgba(255,255,255,.2); }
.hp-full.boom { background: #dc2626; animation: shake .45s; }
.hp-full.boom .btn { background: #fff; color: #111; border: 0; }
.hp-boom { font-size: clamp(64px, 20vw, 110px); font-weight: 800; letter-spacing: -.05em; line-height: 1; }
.hp-who { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; max-width: 480px; }
.hp-who .chip { background: rgba(255,255,255,.14); color: #fff; border-color: rgba(255,255,255,.35); }
.hp-actions { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 480px; margin: 0 auto; }
@keyframes shake { 0%,100% { transform: none; } 20% { transform: translateX(-12px); } 40% { transform: translateX(10px); } 60% { transform: translateX(-7px); } 80% { transform: translateX(4px); } }
`,
  mount(root, S, api) {
    const store = LB.store;
    let fuse = store.get("hp:fuse", "normal");
    if (!FUSES[fuse]) fuse = "normal";
    let keepScore = store.get("hp:score", false);
    let booms = {};
    const deck = LB.deck("hp", PROMPTS.length);

    function setup() {
      api.busy = () => false;
      root.innerHTML = "";
      const el = LB.h('<div class="stack"></div>');
      const pbar = LB.playersBar({ min: 2, max: 16 });
      pbar.classList.toggle("hidden", !keepScore);
      const board = LB.h('<div class="board-slot"></div>');
      const paintBoard = () => {
        board.innerHTML = "";
        const rows = Object.entries(booms).map(([name, score]) => ({ name, score })).sort((a, b) => b.score - a.score);
        if (keepScore && rows.length) { board.append(LB.h('<div class="label" style="margin-bottom:6px">Explosions (fewest wins)</div>'), LB.scoreboard(rows)); }
      };
      el.append(
        LB.h('<div class="card center"><div style="font-size:64px;line-height:1">💣</div><p class="lead">Say one, pass the phone. Don\'t be holding it when it blows.</p></div>'),
        LB.field("Fuse", LB.seg([["short", "Short"], ["normal", "Normal"], ["long", "Long"]], fuse, (v) => { fuse = v; store.set("hp:fuse", v); })),
        LB.toggle("Track who blows up", keepScore, (v) => { keepScore = v; store.set("hp:score", v); pbar.classList.toggle("hidden", !v); paintBoard(); }),
        pbar, board,
        LB.h('<div class="spacer"></div>'),
        LB.btn("Light the fuse", "primary big", play),
      );
      if (Object.keys(booms).length) el.append(LB.btn("Reset scores", "", () => { booms = {}; paintBoard(); }));
      paintBoard();
      root.appendChild(el);
    }

    function play() {
      api.busy = () => true;
      const R = LB.scope(); S.add(() => R.dispose());
      const [lo, hi] = FUSES[fuse];
      const total = LB.rand(lo, hi) * 1000;
      let elapsed = 0, last = performance.now(), live = true, paused = false;
      const full = LB.h(`<div class="full hp-full" role="dialog" aria-label="Hot potato"><button class="icon-btn full-x" aria-label="Stop">${LB.icon.x}</button>
        <div class="hp-body"><div class="hp-bomb" aria-hidden="true">💣</div><div class="hp-k">Name one, then pass</div><div class="hp-p" aria-live="polite"></div><div class="hp-s">No repeats. No long pauses.</div></div>
        <div class="hp-actions"><button class="btn hp-new">New category</button></div></div>`);
      document.body.appendChild(full);
      LB.wake.on();
      const pEl = full.querySelector(".hp-p"), bomb = full.querySelector(".hp-bomb");
      const newPrompt = () => { pEl.textContent = PROMPTS[deck.next()]; pEl.classList.remove("pop"); void pEl.offsetWidth; pEl.classList.add("pop"); };
      newPrompt();
      full.querySelector(".hp-new").onclick = () => { LB.sfx.tap(); newPrompt(); };
      full.querySelector(".full-x").onclick = async () => {
        paused = true;
        const ok = await LB.confirm("Stop this round?", { yes: "Stop", no: "Keep going" });
        if (!ok) { paused = false; last = performance.now(); return; }
        end();
      };
      // Pause the fuse when the page is hidden so it can't blow up in a pocket.
      R.on(document, "visibilitychange", () => { if (document.visibilityState === "visible") last = performance.now(); });
      let tickAt = 0, flip = false;
      const loop = (now) => {
        if (!live) return;
        const dt = Math.min(now - last, 250); last = now;
        if (!paused && document.visibilityState === "visible") elapsed += dt;
        const p = elapsed / total;
        if (p >= 1) return boom();
        if (!paused && elapsed >= tickAt) {
          const gap = Math.max(110, 700 - 600 * p);
          tickAt = elapsed + gap;
          (flip = !flip) ? LB.sfx.tick() : LB.sfx.tock();
          bomb.classList.add("beat"); R.timeout(() => bomb.classList.remove("beat"), 70);
        }
        raf = requestAnimationFrame(loop);
      };
      let raf = requestAnimationFrame(loop);
      R.add(() => cancelAnimationFrame(raf));

      function boom() {
        live = false;
        LB.sfx.boom(); LB.buzz([400, 80, 300]);
        full.classList.add("boom");
        const body = full.querySelector(".hp-body");
        body.innerHTML = '<div class="hp-boom pop">BOOM</div><div class="hp-s">Whoever\'s holding it loses this round.</div>';
        const acts = full.querySelector(".hp-actions"); acts.innerHTML = "";
        if (keepScore) {
          const who = LB.h('<div class="hp-who" role="group" aria-label="Who was holding it?"></div>');
          body.append(LB.h('<div class="hp-k" style="opacity:.85">Who was holding it?</div>'), who);
          LB.players().forEach((n) => {
            const c = LB.h('<button class="chip"></button>'); c.textContent = n;
            c.onclick = () => { booms[n] = (booms[n] || 0) + 1; LB.sfx.tap(); end(); };
            who.appendChild(c);
          });
          acts.append(LB.btn("Skip", "", end));
        } else {
          acts.append(LB.btn("Next round", "big", () => { end(); play(); }), LB.btn("Done", "", end));
        }
      }
      function end() { live = false; R.dispose(); full.remove(); LB.wake.off(); setup(); }
    }

    setup();
  },
});
})();
