/* Five Seconds: name 3 things before the clock runs out. */
(() => {
"use strict";
const PROMPTS = ["pizza toppings","dog breeds","things in a fridge","countries in Africa","Harry Potter characters","things at the beach","car brands","things that are yellow","breakfast foods","sports played with a ball","Disney princesses","vegetables","things in a bathroom","superheroes","musical instruments","US presidents","planets","types of shoes","things that fly","ice cream flavors","board games","ocean animals","fast food chains","things in a classroom","colors of the rainbow","apps on your phone","things you plug in","famous singers","things that are cold","kitchen appliances","Olympic sports","words that rhyme with \"cake\"","things in a wallet","ways to cook an egg","things that are sticky","bones in the body","cartoon characters","cereal brands","things at a wedding","dances","pasta shapes","things with wheels","insects","things in a first aid kit","birds","holidays","things that are round","things that are soft","card games","cheeses","desserts","red fruits","things in the sky","capital cities","languages","jobs that need a uniform","things you'd take camping","Pokémon","video game characters","reality TV shows","things that smell good","things that smell bad","excuses for being late","things you can't take on a plane","things at a gym","social media apps","tricks a dog can do","nuts","things you do every morning","things in a toolbox","flowers","things in a purse","famous athletes","things that make noise","things in a hospital","mythical creatures","types of trees","things in an office","things with buttons","cocktails","condiments","hairstyles","things in space","things that are green","things that are hot","types of weather","things that bounce","animals with tails","sandwiches","soups","ways to say hello in another language","things you shouldn't say on a first date","things your mom always says","zoo animals","movie villains","sitcoms","emojis you use the most","things you do at a sleepover","Marvel characters","things in a car","chocolate bars","things that need batteries","things people collect","things that are scary","words that start with Z","things that are expensive","rappers","things you can fold","spicy foods","things at a birthday party","things at a movie theater","things that are orange","school subjects","things you wear on your head","famous landmarks","holiday songs","things that are tiny","things in a garden","things that come in pairs","things in a junk drawer","things you'd buy at a gas station","reasons to cancel plans","words with double letters","things with stripes","things that melt","things on a farm","things you do while waiting in line","things people always lose","airlines","US cities","European cities","foods you eat with your hands","magic words or spells","things that are shiny","things in a backpack","ways to get around a city","coffee drinks","famous duos","things in a hotel room","fictional dogs","things that are purple","things with a screen","pizza chains","words that rhyme with \"light\"","brands of soda","things you find under a couch","things you say when you stub your toe","famous scientists","Taylor Swift songs","Christmas movies","things that are fluffy","things you'd find at a carnival","things in a pencil case"];

LB.register({
  id: "fiveseconds",
  name: "Five Seconds",
  emoji: "⏱️",
  color: "#0ea5e9",
  tagline: "Name 3 things before time runs out.",
  players: "2+",
  tags: ["duo", "group"],
  rules: [
    "On your turn, tap Go. A category appears and the clock starts.",
    "Name 3 things that fit, out loud, before the buzzer.",
    "The group decides if all 3 count, then taps Yes or No.",
    "Pass the phone to the next player. Highest score wins.",
    "Too hard? Switch the timer to 10 seconds.",
  ],
  css: `
.fs-ring { position: relative; width: 180px; height: 180px; margin: 0 auto; }
.fs-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.fs-ring circle { fill: none; stroke-width: 14; }
.fs-ring .bg { stroke: var(--line); }
.fs-ring .fg { stroke: #0ea5e9; stroke-linecap: round; transition: stroke .2s; }
.fs-ring .n { position: absolute; inset: 0; display: grid; place-items: center; font-size: 64px; font-weight: 800; letter-spacing: -.04em; }
.fs-name3 { font-size: 15px; font-weight: 800; color: #0ea5e9; text-transform: uppercase; letter-spacing: .08em; font-family: "JetBrains Mono", monospace; }
`,
  mount(root, S, api) {
    const store = LB.store;
    let secs = store.get("fs:secs", 5);
    let keepScore = store.get("fs:score", true);
    const deck = LB.deck("fs", PROMPTS.length);
    let g = null; // { players, scores, turn, rounds }

    function setup() {
      api.busy = () => false;
      root.innerHTML = "";
      const pbar = LB.playersBar({ min: 2, max: 12 });
      pbar.classList.toggle("hidden", !keepScore);
      const el = LB.h('<div class="stack"></div>');
      el.append(
        LB.h('<div class="card center"><div style="font-size:56px;line-height:1">⏱️</div><p class="lead">Name 3 things. You get five seconds. It\'s harder than it sounds.</p></div>'),
        LB.field("Timer", LB.seg([[5, "5 seconds"], [10, "10 seconds"]], secs, (v) => { secs = v; store.set("fs:secs", v); })),
        LB.toggle("Keep score", keepScore, (v) => { keepScore = v; store.set("fs:score", v); pbar.classList.toggle("hidden", !v); }),
        pbar,
        LB.h('<div class="spacer"></div>'),
        LB.btn("Start", "primary big", async () => {
          let players = ["You"];
          if (keepScore) { players = await pbar.ensure(); if (!players) return; }
          g = { players, scores: players.map(() => 0), turn: 0 };
          ready();
        }),
      );
      root.appendChild(el);
    }

    function ready() {
      api.busy = () => keepScore && g.scores.some((s) => s > 0);
      root.innerHTML = "";
      const name = g.players[g.turn % g.players.length];
      const el = LB.h(`<div class="stack">
        <div class="card fill center"><span class="label"></span><p class="big"></p><p class="muted" style="margin:0">Tap Go when you're ready. The category shows up and the clock starts right away.</p></div>
        <button class="btn primary big go">Go</button>
        <div class="row"><button class="btn board">Scores</button><button class="btn end">End game</button></div>
      </div>`);
      el.querySelector(".label").textContent = keepScore ? "Up next" : "Ready?";
      el.querySelector(".big").textContent = keepScore ? name : "Name 3…";
      if (!keepScore) el.querySelector(".board").remove();
      else el.querySelector(".board").onclick = () => LB.sheet({ title: "Scores", body: board() });
      el.querySelector(".go").onclick = () => run(name);
      el.querySelector(".end").onclick = () => finish();
      root.appendChild(el);
    }

    function board() {
      return LB.scoreboard(g.players.map((name, i) => ({ name, score: g.scores[i] })).sort((a, b) => b.score - a.score));
    }

    function run(name) {
      api.busy = () => true;
      root.innerHTML = "";
      const C = 2 * Math.PI * 80;
      const el = LB.h(`<div class="stack">
        <div class="card fill center"><span class="fs-name3">Name 3</span><p class="big prompt"></p>
          <div class="fs-ring"><svg viewBox="0 0 180 180"><circle class="bg" cx="90" cy="90" r="80"/><circle class="fg" cx="90" cy="90" r="80" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg><div class="n">${secs}</div></div>
        </div>
        <button class="btn big stop">Done early</button>
      </div>`);
      el.querySelector(".prompt").textContent = PROMPTS[deck.next()];
      root.appendChild(el);
      const fg = el.querySelector(".fg"), n = el.querySelector(".n");
      LB.sfx.go(); LB.buzz(30);
      const t = S.timer({
        seconds: secs,
        onTick: (left, s, ch) => {
          fg.style.strokeDashoffset = String(C * (1 - left / secs));
          fg.style.stroke = left < 2 ? "var(--bad)" : "#0ea5e9";
          n.textContent = s;
          if (ch && s > 0) LB.sfx.tick();
        },
        onDone: () => { LB.sfx.buzzer(); LB.buzz([150, 50, 150]); judge(name, el); },
      });
      el.querySelector(".stop").onclick = () => { t.stop(); LB.sfx.good(); judge(name, el); };
    }

    function judge(name, el) {
      const stop = el.querySelector(".stop"); if (stop) stop.remove();
      const p = LB.h(`<div class="panel stack"><p class="lead" style="margin:0;font-size:18px;color:var(--ink)"></p><div class="row"><button class="btn bad no">No</button><button class="btn good yes">Yes, all 3</button></div></div>`);
      p.querySelector(".lead").textContent = keepScore ? `Did ${name} get all 3?` : "Did you get all 3?";
      const go = (ok) => {
        if (ok) { g.scores[g.turn % g.players.length] += 1; LB.sfx.good(); } else LB.sfx.skip();
        g.turn += 1;
        if (keepScore) { ready(); LB.toast(ok ? `+1 ${name}` : "No point"); } else ready();
      };
      p.querySelector(".no").onclick = () => go(false);
      p.querySelector(".yes").onclick = () => go(true);
      el.appendChild(p);
    }

    function finish() {
      if (!keepScore) return setup();
      api.busy = () => false;
      root.innerHTML = "";
      const rows = g.players.map((name, i) => ({ name, score: g.scores[i] })).sort((a, b) => b.score - a.score);
      const el = LB.h(`<div class="stack"><div class="card center pop"><span class="label">Winner</span><p class="big"></p></div><div class="b"></div><div class="spacer"></div><button class="btn primary big again">Play again</button><button class="btn setup">Change setup</button></div>`);
      const top = rows[0].score, winners = rows.filter((r) => r.score === top);
      el.querySelector(".big").textContent = top === 0 ? "Nobody scored" : winners.map((w) => w.name).join(" & ");
      el.querySelector(".b").replaceWith(LB.scoreboard(rows));
      el.querySelector(".again").onclick = () => { g = { players: g.players, scores: g.players.map(() => 0), turn: 0 }; ready(); };
      el.querySelector(".setup").onclick = setup;
      root.appendChild(el);
      LB.sfx.end();
    }

    setup();
  },
});
})();
