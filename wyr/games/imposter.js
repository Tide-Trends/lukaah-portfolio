/* Imposter: everyone gets the secret word except the imposter. */
(() => {
"use strict";
const CATS = [
  { id: "food", name: "Food", color: "#f97316", words: ["Pizza","Sushi","Tacos","Pancakes","Ramen","Burger","Ice cream","Popcorn","Spaghetti","Croissant","Burrito","Donut","Salad","Steak","Cheesecake","Curry","Hot dog","Waffles","Nachos","Dumplings","Lasagna","Fried chicken","Mac and cheese","Smoothie","Pretzel","Avocado","Watermelon","Cereal","Omelette","Popsicle"] },
  { id: "places", name: "Places", color: "#06b6d4", words: ["Airport","Hospital","Beach","Library","Casino","Gym","Movie theater","Zoo","School","Church","Prison","Cruise ship","Space station","Supermarket","Hotel","Museum","Theme park","Wedding","Farm","Restaurant","Subway","Camping trip","Ski resort","Dentist's office","Nightclub","Bowling alley","Laundromat","Car wash","Hair salon","Concert"] },
  { id: "animals", name: "Animals", color: "#22c55e", words: ["Dog","Cat","Elephant","Penguin","Shark","Giraffe","Kangaroo","Snake","Owl","Monkey","Horse","Frog","Lion","Bee","Spider","Dolphin","Cow","Panda","Octopus","Chicken","Bat","Turtle","Crocodile","Rabbit","Pigeon","Bear","Mosquito","Flamingo","Sloth","Goldfish"] },
  { id: "jobs", name: "Jobs", color: "#a855f7", words: ["Doctor","Teacher","Chef","Pilot","Firefighter","Dentist","Lawyer","Plumber","Barista","Police officer","Farmer","Astronaut","Lifeguard","Mechanic","Hairdresser","Influencer","Uber driver","Waiter","Nurse","Photographer","Judge","DJ","Magician","Mail carrier","Librarian","Personal trainer","Tattoo artist","Real estate agent","Zookeeper","Flight attendant"] },
  { id: "things", name: "Things", color: "#eab308", words: ["Umbrella","Toothbrush","Phone charger","Sunglasses","Backpack","Pillow","Mirror","Candle","Scissors","Wallet","Headphones","Keys","Toilet paper","Remote control","Microwave","Bicycle","Guitar","Lipstick","Passport","Shopping cart","Treadmill","Stapler","Balloon","Ladder","Hammock","Fire extinguisher","Vacuum","Lunchbox","Alarm clock","Skateboard"] },
  { id: "fun", name: "Activities", color: "#ef4444", words: ["Karaoke","Camping","Bowling","Skydiving","Fishing","Road trip","Yoga","Surfing","Ice skating","Cooking","Gardening","Bungee jumping","Moving house","Job interview","First date","Birthday party","Sleepover","Doing taxes","Black Friday shopping","Going to the dentist","Hiking","Snowball fight","Escape room","Laser tag","Babysitting","Painting","Rock climbing","Video gaming","Spring cleaning","Waiting in line"] },
];
const MIX = { id: "mix", name: "Mixed", color: "var(--ink)" };

LB.register({
  id: "imposter",
  name: "Imposter",
  emoji: "🕵️",
  color: "#ef4444",
  tagline: "Everyone knows the word but one.",
  players: "3–12",
  tags: ["group"],
  rules: [
    "Pass the phone around. Each person secretly sees the word, except the imposter, who only learns they're the imposter.",
    "Go around the group. Each person says one word or short clue about the secret word.",
    "Be vague enough that the imposter can't guess it, but clear enough to prove you know it.",
    "After a round or two, vote on who the imposter is.",
    "Caught the imposter? They get one guess at the word. Right guess = imposter steals the win.",
  ],
  css: `
.imp-role { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; gap: 14px; padding: 24px; }
.imp-role .k { font-size: 15px; font-weight: 700; opacity: .7; text-transform: uppercase; letter-spacing: .08em; font-family: "JetBrains Mono", monospace; }
.imp-role .w { font-size: clamp(40px, 12vw, 64px); font-weight: 800; letter-spacing: -.03em; line-height: 1.02; overflow-wrap: anywhere; }
.imp-role .s { font-size: 17px; opacity: .8; max-width: 30ch; }
.imp-role .btn { margin-top: 18px; min-width: 220px; }
.imp-full.bad { background: #b91c1c; color: #fff; }
.imp-full.bad .btn { background: #fff; color: #111; border: 0; }
.imp-timer { font-family: "JetBrains Mono", monospace; font-size: 40px; text-align: center; }
`,
  mount(root, S, api) {
    const store = LB.store;
    let cat = store.get("imp:cat", "mix");
    let hint = store.get("imp:hint", true);
    let impCount = store.get("imp:count", 1);
    const decks = {};
    const deckFor = (c) => (decks[c.id] = decks[c.id] || LB.deck("imp:" + c.id, c.words.length));

    function setup() {
      api.busy = () => false;
      root.innerHTML = "";
      const el = LB.h('<div class="stack"></div>');
      const pbar = LB.playersBar({ min: 3, max: 12 });
      el.append(
        LB.field("Players", pbar),
        LB.field("Word category", LB.chips([MIX, ...CATS], cat, (c) => { cat = c; store.set("imp:cat", c); }, { wrap: true })),
        LB.field("Imposters", LB.seg([[1, "1 imposter"], [2, "2 imposters"]], impCount, (n) => { impCount = n; store.set("imp:count", n); })),
        LB.toggle("Imposter gets the category as a hint", hint, (v) => { hint = v; store.set("imp:hint", v); }),
      );
      const go = LB.btn("Deal roles", "primary big", async () => {
        const players = await pbar.ensure();
        if (!players) return;
        if (impCount === 2 && players.length < 6) { LB.toast("2 imposters needs at least 6 players"); return; }
        round(players);
      });
      el.append(LB.h('<div class="spacer"></div>'), go);
      root.appendChild(el);
    }

    function roleScreen(isImp, word, catName) {
      return new Promise((resolve) => {
        const full = LB.h(`<div class="full imp-full${isImp ? " bad" : ""}" role="dialog"><div class="imp-role"></div></div>`);
        const r = full.querySelector(".imp-role");
        if (isImp) {
          r.innerHTML = `<div class="k">Your role</div><div class="w">You're the imposter</div><div class="s"></div><button class="btn big">Hide it</button>`;
          r.querySelector(".s").textContent = hint ? `Blend in. The category is ${catName}.` : "Blend in. You don't know the word. Listen and bluff.";
        } else {
          r.innerHTML = `<div class="k">The secret word</div><div class="w"></div><div class="s">Don't say it. Give clues that prove you know it.</div><button class="btn primary big">Hide it</button>`;
          r.querySelector(".w").textContent = word;
        }
        r.querySelector("button").onclick = () => { LB.sfx.tap(); full.remove(); resolve(); };
        document.body.appendChild(full);
        LB.buzz(isImp ? [40, 60, 40] : 20);
      });
    }

    async function round(players) {
      api.busy = () => true;
      const c = cat === "mix" ? LB.pick(CATS) : CATS.find((x) => x.id === cat) || CATS[0];
      const word = c.words[deckFor(c).next()];
      const n = players.length;
      const imps = LB.shuffle([...Array(n).keys()]).slice(0, impCount);
      LB.wake.on();
      for (let i = 0; i < n; i++) {
        await LB.pass({ to: players[i], sub: i === 0 ? "Only you look. Everyone else look away." : "Pass it on. Everyone else look away.", button: "Show my role" });
        if (!S.alive) return;
        await roleScreen(imps.includes(i), word, c.name);
        if (!S.alive) return;
      }
      discuss(players, imps, word, c);
    }

    function discuss(players, imps, word, c) {
      root.innerHTML = "";
      const first = LB.pick(players);
      const el = LB.h(`<div class="stack">
        <div class="card center"><span class="label">Everyone has their role</span><p class="big"></p><p class="muted" style="margin:0">Go around the circle. Each person says one word about the secret word. Then vote.</p></div>
        <div class="card center timer-card"><div class="imp-timer">2:00</div><div class="row" style="width:100%"><button class="btn tbtn">Start 2-minute timer</button></div></div>
        <div class="spacer"></div>
        <button class="btn primary big reveal">Reveal the imposter</button>
      </div>`);
      el.querySelector(".big").textContent = `${first} goes first`;
      const tEl = el.querySelector(".imp-timer"), tb = el.querySelector(".tbtn");
      let t = null;
      tb.onclick = () => {
        if (t && t.running) { t.pause(); tb.textContent = "Resume"; return; }
        if (t && t.left > 0) { t.resume(); tb.textContent = "Pause"; return; }
        tb.textContent = "Pause";
        t = S.timer({
          seconds: 120,
          onTick: (l, s, ch) => { tEl.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; if (ch && s <= 5 && s > 0) LB.sfx.tick(); },
          onDone: () => { LB.sfx.buzzer(); LB.buzz([100, 50, 100]); tb.textContent = "Time's up: vote!"; tb.disabled = true; },
        });
      };
      el.querySelector(".reveal").onclick = async () => {
        const ok = await LB.confirm("Everyone voted?", { yes: "Reveal" });
        if (!ok) return;
        if (t) t.stop();
        reveal(players, imps, word, c);
      };
      root.appendChild(el);
    }

    function reveal(players, imps, word, c) {
      api.busy = () => false;
      LB.wake.off();
      root.innerHTML = "";
      const names = imps.map((i) => players[i]);
      const el = LB.h(`<div class="stack">
        <div class="card center pop"><span class="label"></span><p class="big"></p></div>
        <div class="card center"><span class="label">The word was</span><p class="big word"></p><span class="muted small cat"></span></div>
        <p class="muted center" style="margin:0">Imposter caught? They get one guess at the word to steal the win.</p>
        <div class="spacer"></div>
        <button class="btn primary big again">New round, same players</button>
        <button class="btn change">Change setup</button>
      </div>`);
      el.querySelector(".label").textContent = names.length > 1 ? "The imposters were" : "The imposter was";
      el.querySelector(".big").textContent = names.join(" & ");
      el.querySelector(".word").textContent = word;
      el.querySelector(".cat").textContent = c.name;
      el.querySelector(".again").onclick = () => round(players);
      el.querySelector(".change").onclick = setup;
      root.appendChild(el);
      LB.sfx.end();
    }

    setup();
  },
});
})();
