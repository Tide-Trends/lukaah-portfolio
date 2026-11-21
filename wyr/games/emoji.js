/* Emoji Decode: guess the title, phrase or word from emoji. */
(() => {
"use strict";
const CATS = [
  { id: "all", name: "Everything" },
  { id: "movie", name: "Movies", color: "#dc2626" },
  { id: "tv", name: "TV shows", color: "#7c3aed" },
  { id: "phrase", name: "Sayings", color: "#2563eb" },
  { id: "word", name: "Compound words", color: "#16a34a" },
  { id: "place", name: "Places", color: "#d97706" },
];
// [cat, emoji, answer]
const P = [
  ["movie", "🦁👑", "The Lion King"],
  ["movie", "🧊❄️👸", "Frozen"],
  ["movie", "🦈🌊🏖️", "Jaws"],
  ["movie", "🚢🧊💔", "Titanic"],
  ["movie", "🦖🏝️🧬", "Jurassic Park"],
  ["movie", "👻🚫🔫", "Ghostbusters"],
  ["movie", "🐠🔍", "Finding Nemo"],
  ["movie", "💍🌋🧙‍♂️", "The Lord of the Rings"],
  ["movie", "🏠🎈👴", "Up"],
  ["movie", "🤖🌱🌍", "WALL-E"],
  ["movie", "🐀👨‍🍳🇫🇷", "Ratatouille"],
  ["movie", "🧸🤠🚀", "Toy Story"],
  ["movie", "👽📞🏠", "E.T."],
  ["movie", "🍫🏭🎫", "Charlie and the Chocolate Factory"],
  ["movie", "🐼🥋", "Kung Fu Panda"],
  ["movie", "🕶️💊🐇", "The Matrix"],
  ["movie", "🌪️🏠👠", "The Wizard of Oz"],
  ["movie", "🔙⏰🚗", "Back to the Future"],
  ["movie", "🦍🏙️✈️", "King Kong"],
  ["movie", "🏃‍♂️🍫🪶", "Forrest Gump"],
  ["movie", "👨‍🚀🌽🕳️⏳", "Interstellar"],
  ["movie", "🍝🐶❤️", "Lady and the Tramp"],
  ["movie", "🐉📚🧒", "How to Train Your Dragon"],
  ["movie", "💤🌀🏙️", "Inception"],
  ["movie", "🏴‍☠️⚓🏝️", "Pirates of the Caribbean"],
  ["movie", "🏠🧒🎄🪤", "Home Alone"],
  ["movie", "👹💚🧅", "Shrek"],
  ["movie", "🎈🤡🚰", "It"],
  ["movie", "🔪🚿😱", "Psycho"],
  ["movie", "🌹👸🐃", "Beauty and the Beast"],
  ["movie", "🧜‍♀️🦀🎶", "The Little Mermaid"],
  ["movie", "🐒🪐", "Planet of the Apes"],
  ["movie", "👨‍👩‍👧‍👦🦸", "The Incredibles"],
  ["movie", "🧠😡😢😄", "Inside Out"],
  ["movie", "💀🎸🌼🇲🇽", "Coco"],
  ["movie", "🧞‍♂️🪔🐒", "Aladdin"],
  ["movie", "🦇🃏", "The Dark Knight"],
  ["movie", "👗😈", "The Devil Wears Prada"],
  ["movie", "🔟🐕‍🦺🐶", "101 Dalmatians"],
  ["movie", "👰💍🎩🎩🎩🎩", "Four Weddings and a Funeral"],
  ["movie", "🥊🇺🇸🏃‍♂️🥩", "Rocky"],
  ["movie", "🐝🎬", "Bee Movie"],
  ["tv", "🧟‍♂️🚶‍♂️", "The Walking Dead"],
  ["tv", "🐉👑🗡️❄️", "Game of Thrones"],
  ["tv", "🧪👨‍🏫🚐💵", "Breaking Bad"],
  ["tv", "🚲🔦👾🧇", "Stranger Things"],
  ["tv", "🦑🎮💰", "Squid Game"],
  ["tv", "🏢📎☕", "The Office"],
  ["tv", "🍩👨‍👩‍👧‍👦💛", "The Simpsons"],
  ["tv", "🧽🍍🌊", "SpongeBob SquarePants"],
  ["tv", "☕🛋️👫👫👫", "Friends"],
  ["tv", "👑🇬🇧", "The Crown"],
  ["tv", "🐻🍳🔪", "The Bear"],
  ["tv", "💸🏦🎭", "Money Heist"],
  ["tv", "🏝️✈️💥", "Lost"],
  ["tv", "🏠🐉", "House of the Dragon"],
  ["tv", "🍷👩‍⚖️⚖️", "Suits"],
  ["tv", "🔍🎻🇬🇧", "Sherlock"],
  ["tv", "📞👦🍺💚", "How I Met Your Mother"],
  ["tv", "🏥🔪❤️‍🩹", "Grey's Anatomy"],
  ["tv", "🤠🐂🏞️", "Yellowstone"],
  ["tv", "🚀🛸🖖", "Star Trek"],
  ["tv", "👰🌹📺", "The Bachelor"],
  ["phrase", "🌧️🐱🐶", "Raining cats and dogs"],
  ["phrase", "🍰🧩", "Piece of cake"],
  ["phrase", "🔨🧊", "Break the ice"],
  ["phrase", "⏰💰", "Time is money"],
  ["phrase", "🐘🛋️", "The elephant in the room"],
  ["phrase", "🐦🐦🪨", "Kill two birds with one stone"],
  ["phrase", "🍎👁️", "The apple of my eye"],
  ["phrase", "🐈👜", "Let the cat out of the bag"],
  ["phrase", "1️⃣💙🌕", "Once in a blue moon"],
  ["phrase", "🥚🥚🥚🧺", "Don't put all your eggs in one basket"],
  ["phrase", "🐂🍽️🏪", "A bull in a china shop"],
  ["phrase", "🍋➡️🥤", "When life gives you lemons, make lemonade"],
  ["phrase", "💥🦵", "Break a leg"],
  ["phrase", "🌅🐦🪱", "The early bird catches the worm"],
  ["phrase", "☁️9️⃣", "On cloud nine"],
  ["phrase", "🌶️🥔", "Hot potato"],
  ["phrase", "🦶🚪", "Foot in the door"],
  ["phrase", "🎁🐴👄🚫", "Don't look a gift horse in the mouth"],
  ["phrase", "🎂🍴🎂", "Have your cake and eat it too"],
  ["phrase", "🚫☕", "Not my cup of tea"],
  ["phrase", "🛑👃🌹", "Stop and smell the roses"],
  ["phrase", "💰🌳🚫", "Money doesn't grow on trees"],
  ["phrase", "🐔🥚❓", "Chicken or the egg"],
  ["phrase", "🙈🙉🙊", "See no evil, hear no evil, speak no evil"],
  ["phrase", "🦶👄", "Put your foot in your mouth"],
  ["phrase", "🌊🌊🚢🚢", "Ships passing in the night"],
  ["phrase", "🔥🚬", "Where there's smoke, there's fire"],
  ["phrase", "🐟🐟🐟🌊", "Plenty of fish in the sea"],
  ["phrase", "🥫🐛", "Open a can of worms"],
  ["phrase", "🍗🥶", "Cold turkey"],
  ["word", "🧈🪰", "Butterfly"],
  ["word", "⭐🐟", "Starfish"],
  ["word", "🌧️🏹", "Rainbow"],
  ["word", "🔥🪰", "Firefly"],
  ["word", "🦶⚽", "Football"],
  ["word", "🍳🎂", "Pancake"],
  ["word", "🌽🐶", "Corn dog"],
  ["word", "☀️🌻", "Sunflower"],
  ["word", "🚪🔔", "Doorbell"],
  ["word", "🌍🫨", "Earthquake"],
  ["word", "🔑🛹", "Keyboard"],
  ["word", "🍯🌙", "Honeymoon"],
  ["word", "🐎🪰", "Horsefly"],
  ["word", "🪨⭐", "Rock star"],
  ["word", "🐌📧", "Snail mail"],
  ["word", "💡🏠", "Lighthouse"],
  ["word", "📚🐛", "Bookworm"],
  ["word", "🦶🖨️", "Footprint"],
  ["word", "🌧️🧥", "Raincoat"],
  ["word", "💧🍈", "Watermelon"],
  ["word", "🥜🧈", "Peanut butter"],
  ["word", "👁️🎾", "Eyeball"],
  ["word", "❄️👨", "Snowman"],
  ["word", "🐮👦", "Cowboy"],
  ["word", "🌙💡", "Moonlight"],
  ["word", "🐶🏠", "Doghouse"],
  ["word", "🥚🌱", "Eggplant"],
  ["word", "🖐️👜", "Handbag"],
  ["word", "🛏️🐛", "Bedbug"],
  ["word", "🌊🐴", "Seahorse"],
  ["place", "🗽🍎", "New York"],
  ["place", "🗼🥖", "Paris"],
  ["place", "🦘🏖️🐨", "Australia"],
  ["place", "🏛️⚔️🛵", "Rome"],
  ["place", "🎰🌵💒", "Las Vegas"],
  ["place", "🌉🌁🚋", "San Francisco"],
  ["place", "🗻🍣🚄", "Japan"],
  ["place", "🐼🧱", "China"],
  ["place", "🕰️☔🚌", "London"],
  ["place", "⭐🎬🌴", "Hollywood"],
  ["place", "🐪🔺", "Egypt"],
  ["place", "🍁🏒🫎", "Canada"],
  ["place", "🌮🌵🪅", "Mexico"],
  ["place", "🍀🍺☘️", "Ireland"],
  ["place", "🌷🚲🧀", "Netherlands"],
  ["place", "🧀🏔️🍫⌚", "Switzerland"],
  ["place", "🌋🌺🏄", "Hawaii"],
  ["place", "🐧🧊🏔️", "Antarctica"],
  ["place", "🕌🏙️🏝️", "Dubai"],
  ["place", "🎭🍺🥨", "Germany"],
  ["place", "💃🥘🐂", "Spain"],
  ["place", "🎻🏰☕", "Vienna"],
  ["place", "🚤🎭🛶", "Venice"],
  ["place", "🤠🛢️⭐", "Texas"],
];
// Guard against duplicate answers so a run never repeats one.
const SEEN = new Set();
const DATA = P.filter((p) => { const k = p[2].toLowerCase(); if (SEEN.has(k)) return false; SEEN.add(k); return true; });

const LABEL = Object.fromEntries(CATS.map((c) => [c.id, c.name]));
const hintFor = (ans) => {
  const words = ans.replace(/[,.]/g, "").split(/\s+/).filter(Boolean);
  return `${words.length} word${words.length === 1 ? "" : "s"} · starts with “${ans[0].toUpperCase()}” · ${words.map((w) => "_".repeat(Math.min(w.replace(/[^A-Za-z0-9]/g, "").length || 1, 12))).join(" ")}`;
};

LB.register({
  id: "emoji",
  name: "Emoji Decode",
  emoji: "🧩",
  color: "#db2777",
  tagline: "Movies, sayings and places, spelled in emoji.",
  players: "1+",
  tags: ["solo", "duo", "group"],
  rules: [
    "Look at the emoji and work out what they spell.",
    "Stuck? Hint shows the number of words and the first letter.",
    "Free play: just reveal and move on.",
    "Race: 90 seconds. Got it scores, Pass doesn't. Beat your best.",
    "Pass-the-phone race: each player gets their own 90 seconds, highest score wins.",
  ],
  css: `
.ed-card { min-height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; text-align: center; }
.ed-emo { font-size: clamp(54px, 17vw, 84px); line-height: 1.15; letter-spacing: .06em; word-break: break-word; }
.ed-ans { font-size: clamp(24px, 7vw, 32px); font-weight: 800; letter-spacing: -.02em; margin: 0; }
.ed-hint { font-family: "JetBrains Mono", monospace; font-size: 13px; color: var(--muted); letter-spacing: .02em; min-height: 1.3em; margin: 0; }
.ed-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ed-race { padding: 14px 16px calc(env(safe-area-inset-bottom) + 18px); display: flex; flex-direction: column; gap: 12px; }
.ed-race .ed-emo { font-size: clamp(64px, 20vw, 110px); }
.ed-race .ed-top { display: flex; justify-content: space-between; align-items: center; font-family: "JetBrains Mono", monospace; font-weight: 700; padding-right: 52px; }
.ed-race .ed-mid { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; text-align: center; }
.ed-race .ed-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ed-race .ed-btns .btn { min-height: 64px; font-size: 18px; }
`,
  mount(root, S, api) {
    const store = LB.store;
    let cat = store.get("ed:cat", "all");
    let mode = store.get("ed:mode", "free");
    if (!LABEL[cat]) cat = "all";
    const pool = () => DATA.map((p, i) => i).filter((i) => cat === "all" || DATA[i][0] === cat);
    const decks = {};
    const nextIdx = () => {
      const list = pool();
      const d = decks[cat] || (decks[cat] = LB.deck("ed:" + cat, list.length));
      return list[d.next()];
    };

    function setup() {
      api.busy = () => false;
      root.innerHTML = "";
      const pbar = LB.playersBar({ min: 2, max: 10 });
      pbar.classList.toggle("hidden", mode !== "party");
      const bestEl = LB.h('<p class="muted center small" style="margin:0"></p>');
      const paintBest = () => { const b = store.get(`ed:best:${cat}`, 0); bestEl.textContent = mode === "race" && b ? `Your best race (${LABEL[cat]}): ${b}` : ""; };
      const el = LB.h('<div class="stack"></div>');
      el.append(
        LB.h('<div class="card center"><div style="font-size:56px;line-height:1">🧩</div><p class="lead">Read the emoji, say the answer.</p></div>'),
        LB.field("Category", LB.chips(CATS.map((c) => ({ id: c.id, name: c.name, color: c.color })), cat, (c) => { cat = c; store.set("ed:cat", c); paintBest(); }, { wrap: true })),
        LB.field("Mode", LB.seg([["free", "Free play"], ["race", "90s race"], ["party", "Pass & race"]], mode, (m) => { mode = m; store.set("ed:mode", m); pbar.classList.toggle("hidden", m !== "party"); paintBest(); })),
        pbar, bestEl,
        LB.h('<div class="spacer"></div>'),
        LB.btn("Start", "primary big", async () => {
          if (mode === "free") return free();
          if (mode === "race") { const n = await race(null); if (n != null) raceDone([{ name: "You", score: n }], true); return; }
          const players = await pbar.ensure(); if (!players) return;
          party(players);
        }),
      );
      paintBest();
      root.appendChild(el);
    }

    // ---------- free play ----------
    function free() {
      api.busy = () => false;
      let got = 0, seen = 0;
      root.innerHTML = "";
      const el = LB.h(`<div class="stack">
        <div class="meta mono"><span class="ct"></span><span class="tally"></span></div>
        <div class="card ed-card fill"><div class="ed-emo" aria-live="polite"></div><p class="ed-hint"></p><p class="ed-ans hidden"></p></div>
        <div class="ed-row ask"><button class="btn hint">Hint</button><button class="btn primary rv">Reveal</button></div>
        <div class="ed-row res hidden"><button class="btn miss">Missed it</button><button class="btn primary got">Got it ✓</button></div>
        <button class="btn back">Change category</button>
      </div>`);
      root.appendChild(el);
      const $ = (s) => el.querySelector(s);
      let cur;
      const show = () => {
        cur = DATA[nextIdx()];
        $(".ct").textContent = LABEL[cur[0]].toUpperCase();
        $(".tally").textContent = seen ? `${got}/${seen} solved` : "";
        $(".ed-emo").textContent = cur[1];
        $(".ed-emo").setAttribute("aria-label", "Emoji clue");
        $(".ed-hint").textContent = "";
        $(".ed-ans").textContent = cur[2];
        $(".ed-ans").classList.add("hidden");
        $(".ask").classList.remove("hidden"); $(".res").classList.add("hidden");
        $(".hint").disabled = false;
      };
      const reveal = () => { $(".ed-ans").classList.remove("hidden"); $(".ed-ans").classList.add("pop"); $(".ask").classList.add("hidden"); $(".res").classList.remove("hidden"); LB.sfx.tap(); };
      const mark = (ok) => { seen++; if (ok) { got++; LB.sfx.good(); } else LB.sfx.skip(); show(); };
      $(".hint").onclick = () => { $(".ed-hint").textContent = hintFor(cur[2]); $(".hint").disabled = true; LB.sfx.tap(); };
      $(".rv").onclick = reveal;
      $(".got").onclick = () => mark(true);
      $(".miss").onclick = () => mark(false);
      $(".back").onclick = setup;
      S.on(document, "keydown", (e) => {
        if (LB.modalOpen() || LB.typing(e)) return;
        const askOpen = !$(".ask").classList.contains("hidden");
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (askOpen) reveal(); else mark(true); }
        else if (e.key.toLowerCase() === "h" && askOpen) $(".hint").click();
        else if ((e.key === "ArrowRight" || e.key.toLowerCase() === "n") && !askOpen) mark(false);
      });
      show();
    }

    // ---------- race (one player, 90 s). Resolves with score, or null if quit. ----------
    function race(name) {
      return new Promise(async (resolve) => {
        api.busy = () => true;
        const R = LB.scope(); S.add(() => R.dispose());
        const full = LB.h(`<div class="full ed-race" role="dialog" aria-label="Emoji race"><button class="icon-btn full-x" aria-label="Quit">${LB.icon.x}</button>
          <div class="ed-top"><span class="who"></span><span class="sc">0</span></div>
          <div class="timerbar"><span></span></div>
          <div class="ed-mid"><div class="ed-emo"></div><p class="ed-hint"></p></div>
          <div class="ed-btns"><button class="btn skp">Pass</button><button class="btn primary got">Got it ✓</button></div>
        </div>`);
        document.body.appendChild(full);
        LB.wake.on();
        const $ = (s) => full.querySelector(s);
        $(".who").textContent = name || LABEL[cat];
        let score = 0, cur, over = false;
        const log = [];
        const finish = (v) => { if (over) return; over = true; R.dispose(); full.remove(); LB.wake.off(); resolve(v); };
        $(".full-x").onclick = async () => { if (await LB.confirm("Quit this race?", { yes: "Quit" })) { finish(null); api.busy = () => false; setup(); } };
        const show = () => { cur = DATA[nextIdx()]; $(".ed-emo").textContent = cur[1]; $(".ed-hint").textContent = ""; };
        const mark = (ok) => {
          if (over || !cur) return;
          log.push([cur, ok]);
          if (ok) { score++; LB.sfx.good(); LB.buzz(25); } else LB.sfx.skip();
          $(".sc").textContent = score; show();
        };
        $(".got").disabled = $(".skp").disabled = true;
        await LB.countdown(full, R);
        if (over) return;
        $(".got").disabled = $(".skp").disabled = false;
        show();
        const bar = $(".timerbar span");
        const T = R.timer({
          seconds: 90,
          onTick(left, s, changed) { bar.style.transform = `scaleX(${left / 90})`; if (changed && s <= 5) LB.sfx.tick(); },
          onDone() {
            LB.sfx.buzzer(); LB.buzz([80, 60, 80]);
            const rows = log;
            over = true; R.dispose(); full.remove(); LB.wake.off();
            showLog(name, score, rows).then(() => resolve(score));
          },
        });
        $(".got").onclick = () => mark(true);
        $(".skp").onclick = () => mark(false);
        R.on(document, "keydown", (e) => {
          if (LB.modalOpen()) return;
          if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") { e.preventDefault(); mark(true); }
          else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "p") mark(false);
        });
        R.on(document, "visibilitychange", () => (document.hidden ? T.pause() : T.resume()));
      });
    }

    function showLog(name, score, rows) {
      const body = LB.h('<div class="stack" style="gap:6px"></div>');
      if (!rows.length) body.append(LB.h('<p class="muted" style="margin:0">Nothing answered this round.</p>'));
      rows.forEach(([p, ok]) => {
        const r = LB.h('<div class="score-row"><span class="mono"></span><span class="n"></span><span class="s"></span></div>');
        r.querySelector(".mono").textContent = p[1];
        r.querySelector(".n").textContent = p[2];
        r.querySelector(".s").textContent = ok ? "✓" : "–";
        if (ok) r.classList.add("lead");
        body.append(r);
      });
      return LB.sheet({ title: `${name ? name + ": " : ""}${score} solved`, body, actions: [{ label: "Continue", value: true, primary: true }], dismissable: false });
    }

    function raceDone(rows, solo) {
      api.busy = () => false;
      root.innerHTML = "";
      const el = LB.h('<div class="stack"></div>');
      if (solo) {
        const n = rows[0].score, key = `ed:best:${cat}`, prev = store.get(key, 0);
        if (n > prev) store.set(key, n);
        el.append(LB.h(`<div class="card center pop"><span class="label">${LB.esc(LABEL[cat])} race</span><p class="big-num">${n}</p><p class="muted" style="margin:0">${n > prev ? (prev ? `New best! Old best was ${prev}.` : "First race logged.") : `Best: ${prev}`}</p></div>`));
      } else {
        rows.sort((a, b) => b.score - a.score);
        const top = rows[0].score;
        const c = LB.h('<div class="card center pop"><span class="label">Winner</span><p class="big"></p></div>');
        c.querySelector(".big").textContent = rows.filter((r) => r.score === top).map((r) => r.name).join(" & ");
        el.append(c, LB.scoreboard(rows));
      }
      el.append(LB.h('<div class="spacer"></div>'), LB.btn("Play again", "primary big", async () => {
        if (solo) { const n = await race(null); if (n != null) raceDone([{ name: "You", score: n }], true); }
        else party(rows.map((r) => r.name).sort((a, b) => order.indexOf(a) - order.indexOf(b)));
      }), LB.btn("Change setup", "", setup));
      LB.sfx.end();
      root.appendChild(el);
    }

    let order = [];
    async function party(players) {
      order = players.slice();
      const rows = [];
      for (const p of players) {
        await LB.pass({ to: p, sub: "Your 90-second race. Everyone else stay quiet.", button: "Start my turn" });
        if (!S.alive) return;
        const n = await race(p);
        if (n == null || !S.alive) return;
        rows.push({ name: p, score: n });
      }
      raceDone(rows, false);
    }

    setup();
  },
});
})();
