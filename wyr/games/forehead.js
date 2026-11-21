/* Forehead: phone-on-forehead guessing (tilt) + charades (tap). */
(() => {
"use strict";
const DECKS = [
  { id: "animals", name: "Animals", emoji: "🦒", words: ["Elephant","Giraffe","Penguin","Kangaroo","Octopus","Flamingo","Sloth","Shark","Gorilla","Peacock","Squirrel","Jellyfish","Crocodile","Owl","Bat","Koala","Zebra","Camel","Hedgehog","Dolphin","Chicken","Snake","Frog","Lobster","Panda","Horse","Rabbit","Spider","Butterfly","Seal","Hippo","Raccoon","Goat","Turtle","Eagle","Llama","Skunk","Polar bear","Pigeon","Cat"] },
  { id: "act", name: "Act It Out", emoji: "🎭", words: ["Brushing your teeth","Surfing","Changing a diaper","Walking a dog","Flying a kite","Bowling","Doing yoga","Riding a horse","Fishing","Taking a selfie","Ice skating","Juggling","Painting a wall","Sneezing","Lifting weights","Playing guitar","Getting a haircut","Typing on a keyboard","Chopping onions","Swimming","Climbing a ladder","Blowing up a balloon","Stepping on a Lego","Waking up late","Riding a roller coaster","Opening a stuck jar","Parallel parking","Walking on ice","Being a zombie","Conducting an orchestra","Directing traffic","Playing tennis","Milking a cow","Doing a magic trick","Proposing","Skydiving","Baking a cake","Running for the bus","Hailing a taxi","Waiting in line"] },
  { id: "movies", name: "Movies", emoji: "🎬", words: ["Titanic","Frozen","Jaws","Star Wars","The Lion King","Toy Story","Shrek","Finding Nemo","Jurassic Park","Harry Potter","The Matrix","Home Alone","Back to the Future","Spider-Man","Barbie","Avatar","Mean Girls","The Wizard of Oz","E.T.","Rocky","Ghostbusters","Top Gun","The Godfather","Up","Inception","Cars","Grease","Mamma Mia!","The Incredibles","Pirates of the Caribbean","Despicable Me","Black Panther","The Dark Knight","Forrest Gump","Moana","Jumanji","Ratatouille","Twilight","The Hunger Games","Oppenheimer"] },
  { id: "people", name: "Famous People", emoji: "🌟", words: ["Taylor Swift","Beyoncé","Elon Musk","Oprah","Albert Einstein","Michael Jordan","Lionel Messi","Cristiano Ronaldo","Rihanna","Shakespeare","Abraham Lincoln","Cleopatra","Napoleon","Barack Obama","Kim Kardashian","The Rock","Leonardo DiCaprio","Lady Gaga","Serena Williams","LeBron James","Gordon Ramsay","Bill Gates","Steve Jobs","Marilyn Monroe","Elvis Presley","Michael Jackson","Frida Kahlo","Isaac Newton","Mozart","Picasso","Queen Elizabeth II","Martin Luther King Jr.","Ed Sheeran","Adele","Snoop Dogg","Tom Hanks","Keanu Reeves","Usain Bolt","MrBeast","Neil Armstrong"] },
  { id: "characters", name: "Characters", emoji: "🦸", words: ["Mickey Mouse","SpongeBob","Batman","Hermione Granger","Darth Vader","Donkey from Shrek","Mario","Pikachu","Sherlock Holmes","Elsa","Homer Simpson","Scooby-Doo","Winnie the Pooh","Buzz Lightyear","Wonder Woman","The Hulk","Yoda","Cinderella","Santa Claus","The Tooth Fairy","Dracula","Frankenstein's monster","Peter Pan","Sonic the Hedgehog","Kermit the Frog","Garfield","Shrek","Gollum","The Joker","Superman","Captain America","Tinker Bell","Big Bird","Bugs Bunny","The Grinch","Willy Wonka","Snow White","Cookie Monster","Peppa Pig","Spider-Man"] },
  { id: "food", name: "Food & Drink", emoji: "🍕", words: ["Pizza","Sushi","Taco","Spaghetti","Pancakes","Popcorn","Hot dog","Ice cream","Avocado toast","Burrito","Croissant","Cotton candy","Corn on the cob","Fried chicken","Lasagna","Pretzel","Bubble tea","Ramen","Cheesecake","Watermelon","Smoothie","Nachos","Grilled cheese","Donut","French fries","Chocolate fondue","Lemonade","Cupcake","Pineapple","Burger","Bacon","Salad","Waffles","Mashed potatoes","Coconut","Popsicle","Dumplings","Espresso","Peanut butter","Cereal"] },
  { id: "jobs", name: "Jobs", emoji: "👩‍🚒", words: ["Firefighter","Dentist","Pilot","Chef","Lifeguard","Astronaut","Plumber","Teacher","Barista","Magician","Mail carrier","Surgeon","Librarian","Referee","Farmer","Hairdresser","Police officer","DJ","Lawyer","Zookeeper","Tattoo artist","Uber driver","Flight attendant","Photographer","Mechanic","Personal trainer","Wedding planner","Influencer","Archaeologist","Nurse","Construction worker","Detective","Weather forecaster","Life coach","Bartender","Janitor","Real estate agent","Comedian","Tour guide","Dog walker"] },
  { id: "sports", name: "Sports & Games", emoji: "🏀", words: ["Soccer","Basketball","Baseball","Golf","Tennis","Bowling","Surfing","Skateboarding","Boxing","Chess","Ping pong","Volleyball","Ice hockey","Figure skating","Gymnastics","Sumo wrestling","Darts","Rock climbing","Skiing","Snowboarding","Archery","Fencing","Marathon","Hide and seek","Monopoly","Jenga","Rock paper scissors","Tug of war","Dodgeball","Limbo","Twister","Musical chairs","Poker","Hula hoop","Badminton","Water polo","Curling","Bungee jumping","Karate","Mini golf"] },
  { id: "house", name: "Around the House", emoji: "🛋️", words: ["Toaster","Toilet paper","Remote control","Vacuum","Microwave","Pillow","Alarm clock","Shower curtain","Doorbell","Couch","Fridge","Blender","Toothbrush","Washing machine","Lamp","Mirror","Ceiling fan","Smoke detector","Coat hanger","Fork","Bathtub","Rubber duck","Laundry basket","Ironing board","Candle","Keys","Wi-Fi router","Plunger","Bunk bed","Light switch","Mop","Cereal box","Sticky note","Tape measure","Trash can","Doormat","Rug","Air fryer","Phone charger","Junk drawer"] },
  { id: "places", name: "Places", emoji: "🗺️", words: ["Paris","The beach","The moon","Hospital","Airport","Las Vegas","Library","Gym","Disneyland","New York City","Grocery store","Haunted house","Desert","Volcano","Igloo","Space station","Movie theater","Zoo","Water park","Egypt","Japan","Antarctica","Jail","Casino","Dentist's office","Campsite","Wedding","Mall","Farm","Rainforest","Bowling alley","Hawaii","Mount Everest","The DMV","Subway","Cruise ship","Treehouse","Castle","Graveyard","Laundromat"] },
  { id: "brands", name: "Brands & Apps", emoji: "📱", words: ["Google","TikTok","Instagram","Netflix","Amazon","McDonald's","Starbucks","Apple","Nike","Coca-Cola","Disney","Lego","IKEA","Tesla","Uber","Spotify","YouTube","Snapchat","WhatsApp","Taco Bell","Target","Walmart","Costco","Adidas","Ferrari","Nintendo","PlayStation","Minecraft","Fortnite","Roblox","Pokémon","Crocs","Red Bull","Doritos","Oreo","Post-it","Duolingo","ChatGPT","Wikipedia","Zoom"] },
  { id: "hard", name: "Hard Mode", emoji: "🧠", words: ["Déjà vu","Procrastination","Gravity","Jealousy","Nostalgia","Sarcasm","Inflation","Karma","Awkward silence","Midlife crisis","Ghosting","Imposter syndrome","Daylight saving time","Peer pressure","Brain freeze","Small talk","FOMO","Writer's block","Beginner's luck","Mondays","Leap year","Spoiler alert","Secondhand embarrassment","Plot twist","Jet lag","Butterflies in your stomach","Hangry","Retirement","Conspiracy theory","Echo","Shadow","Hiccups","Daydreaming","Gossip","Overthinking","Gut feeling","Comfort zone","Rush hour","Snooze button","Group project"] },
];
DECKS.unshift({ id: "mix", name: "Everything", emoji: "🎲", words: DECKS.flatMap((d) => d.words) });

LB.register({
  id: "forehead",
  name: "Forehead",
  emoji: "🤳",
  color: "#7c5cff",
  tagline: "Phone on your head. Friends shout clues.",
  players: "2+",
  tags: ["duo", "group"],
  rules: [
    "One person holds the phone sideways on their forehead, screen facing out. They can't see the word.",
    "Everyone else gives clues without saying the word.",
    "Got it? Tilt the phone down (screen to the floor). Want to pass? Tilt it up (screen to the sky).",
    "No tilt sensor? Anyone can tap: right half = got it, left half = pass.",
    "Charades mode: the actor reads the word and acts it out silently, then taps Got it or Pass.",
    "Most correct before time runs out wins. Rotate who's guessing.",
  ],
  css: `
.fh-full .full-x { background: rgba(0,0,0,.18); border-color: rgba(255,255,255,.35); color: #fff; }
.fh-decks { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.fh-deck { border: 1px solid var(--line); background: var(--surface); border-radius: 14px; padding: 8px 10px; text-align: left; display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 14px; line-height: 1.15; min-height: 46px; }
.fh-deck .e { font-size: 20px; }
.fh-deck .b { margin-left: auto; font-family: "JetBrains Mono", monospace; font-size: 11px; color: var(--muted); font-weight: 500; }
.fh-deck[aria-pressed="true"] { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.fh-deck[aria-pressed="true"] .b { color: inherit; opacity: .7; }
.fh-full { padding: 0; background: #7c5cff; color: #fff; overflow: hidden; }
.fh-full.ok { background: #16a34a; }
.fh-full.no { background: #ea580c; }
.fh-full.end { background: var(--bg); color: var(--ink); }
.fh-stage { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; overflow: hidden; }
.fh-hud { display: flex; justify-content: space-between; align-items: center; padding: max(14px, env(safe-area-inset-top)) 64px 0 20px; font-family: "JetBrains Mono", monospace; font-size: 20px; font-weight: 500; }
.fh-word { flex: 1; display: grid; place-items: center; text-align: center; padding: 10px 24px; font-size: clamp(40px, 11vmin, 92px); font-weight: 800; line-height: 1.02; letter-spacing: -.03em; overflow-wrap: anywhere; }
.fh-hint { text-align: center; font-size: 14px; opacity: .8; padding: 0 16px calc(env(safe-area-inset-bottom) + 18px); }
.fh-zones { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 1fr; z-index: 1; }
.fh-zones button { border: 0; background: transparent; }
.fh-hud, .fh-word, .fh-hint { position: relative; z-index: 2; pointer-events: none; }
.fh-btns { position: relative; z-index: 3; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 16px calc(env(safe-area-inset-bottom) + 28px); }
.fh-btns .btn { min-height: 64px; font-size: 19px; border: 0; }
.fh-prep { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 16px; padding: 24px; text-align: center; align-items: center; }
.fh-prep .ph { font-size: 64px; }
.fh-prep h2 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -.02em; }
.fh-prep p { margin: 0; font-size: 17px; opacity: .9; max-width: 34ch; }
.fh-prep .btn { min-width: 220px; background: #fff; color: #111; border: 0; }
.fh-res { flex: 1; overflow-y: auto; padding: max(18px, env(safe-area-inset-top)) 18px calc(env(safe-area-inset-bottom) + 28px); display: flex; flex-direction: column; gap: 12px; max-width: 560px; width: 100%; margin: 0 auto; }
.fh-list { display: flex; flex-wrap: wrap; gap: 6px; }
.fh-list span { padding: 7px 11px; border-radius: 99px; font-weight: 700; font-size: 14px; border: 1px solid var(--line); }
.fh-list .y { background: var(--good); color: #fff; border-color: transparent; }
.fh-list .n { color: var(--muted); text-decoration: line-through; }
`,
  mount(root, S, api) {
    const store = LB.store;
    let deckId = store.get("fh:deck", "animals");
    if (!DECKS.some((d) => d.id === deckId)) deckId = "animals";
    let mode = store.get("fh:mode", "tilt");
    let secs = store.get("fh:secs", 60);
    const bestKey = (d) => `fh:best:${mode}:${d}:${secs}`;

    const el = LB.h('<div class="stack"></div>');
    root.appendChild(el);
    const grid = LB.h('<div class="fh-decks" role="group" aria-label="Deck"></div>');
    const paintDecks = () => {
      grid.innerHTML = "";
      DECKS.forEach((d) => {
        const b = LB.h(`<button class="fh-deck"><span class="e" aria-hidden="true">${d.emoji}</span><span class="t"></span><span class="b"></span></button>`);
        b.querySelector(".t").textContent = d.name;
        const best = store.get(bestKey(d.id), null);
        b.querySelector(".b").textContent = best != null ? `best ${best}` : "";
        b.setAttribute("aria-pressed", String(d.id === deckId));
        b.onclick = () => { deckId = d.id; store.set("fh:deck", d.id); LB.sfx.tap(); paintDecks(); };
        grid.appendChild(b);
      });
    };
    el.append(
      LB.field("Mode", LB.seg([["tilt", "Forehead (tilt)"], ["act", "Charades (tap)"]], mode, (m) => { mode = m; store.set("fh:mode", m); paintDecks(); })),
      LB.field("Round length", LB.seg([[60, "60 sec"], [90, "90 sec"], [120, "2 min"]], secs, (s) => { secs = s; store.set("fh:secs", s); paintDecks(); })),
      LB.field("Deck", grid),
    );
    paintDecks();
    const start = LB.btn("Start round", "primary big sticky-go", () => play());
    el.append(start);

    // ---------- a round ----------
    async function play() {
      const deck = DECKS.find((d) => d.id === deckId);
      const draw = LB.deck("fh:" + deck.id, deck.words.length);
      const R = LB.scope(); S.add(() => R.dispose());
      let phase = "prep", score = 0, results = [], word = null, wordDone = false, armed = false, lockUntil = 0, rot = 0, sensor = false, timer = null;
      api.busy = () => phase === "count" || phase === "play";

      const full = LB.h(`<div class="full fh-full" role="dialog" aria-label="Forehead round"><button class="icon-btn full-x" aria-label="End round">${LB.icon.x}</button><div class="fh-stage"></div></div>`);
      document.body.appendChild(full);
      const stage = full.querySelector(".fh-stage");
      const close = () => { R.dispose(); LB.wake.off(); exitFull(); full.remove(); api.busy = () => false; paintDecks(); };
      full.querySelector(".full-x").onclick = async () => {
        if (phase === "play" || phase === "count") { if (timer) timer.pause(); const ok = await LB.confirm("End this round?", { yes: "End it" }); if (!ok) { if (timer) timer.resume(); return; } }
        close();
      };

      // Size + rotate the stage so text reads upright for the people facing the screen.
      const layout = () => {
        const W = window.innerWidth, H = window.innerHeight;
        const portrait = H > W;
        const r = mode === "tilt" && portrait && (phase === "count" || phase === "play") ? rot || 90 : 0;
        stage.style.width = (r ? H : W) + "px";
        stage.style.height = (r ? W : H) + "px";
        stage.style.transform = `translate(-50%, -50%) rotate(${r}deg)`;
      };
      R.on(window, "resize", layout);
      layout();

      // ----- prep screen -----
      stage.innerHTML = "";
      const prep = LB.h(`<div class="fh-prep"><div class="ph" aria-hidden="true">${mode === "tilt" ? "🤳" : "🎭"}</div><h2></h2><p></p><button class="btn big">Ready</button></div>`);
      prep.querySelector("h2").textContent = mode === "tilt" ? deck.name : `Charades: ${deck.name}`;
      prep.querySelector("p").textContent = mode === "tilt"
        ? "Hold the phone sideways on your forehead, screen facing out. Tilt down when you get it, tilt up to pass."
        : "Read the word, act it out with no talking, and tap Got it or Pass.";
      stage.appendChild(prep);

      prep.querySelector("button").onclick = async () => {
        if (mode === "tilt") {
          // iOS needs permission, and it has to be requested inside this tap.
          try {
            if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
              const res = await DeviceOrientationEvent.requestPermission();
              if (res !== "granted") LB.toast("Motion access denied: tap the sides instead");
            }
          } catch {}
          R.on(window, "deviceorientation", onOrient);
        }
        LB.wake.on();
        enterFull();
        phase = "count";
        stage.innerHTML = "";
        layout();
        await LB.countdown(stage, R);
        if (!R.alive) return;
        if (mode === "tilt" && !sensor) LB.toast("No tilt sensor found: tap right for got it, left for pass");
        begin();
      };

      function onOrient(e) {
        if (e.beta == null || e.gamma == null) return;
        sensor = true;
        const b = (e.beta * Math.PI) / 180, g = (e.gamma * Math.PI) / 180;
        const f = Math.cos(b) * Math.cos(g);     // +1 screen to sky, -1 screen to floor
        const xUp = -Math.cos(b) * Math.sin(g);  // which long edge points up when held sideways
        if (Math.abs(f) < 0.35 && Math.abs(xUp) > 0.6) {
          const r = xUp > 0 ? 90 : -90;
          if (r !== rot) { rot = r; layout(); }
        }
        if (phase !== "play") return;
        if (!armed) { if (Math.abs(f) < 0.3) armed = true; return; }
        if (performance.now() < lockUntil) return;
        if (f < -0.6) mark(true);
        else if (f > 0.6) mark(false);
      }

      function begin() {
        phase = "play";
        stage.innerHTML = `
          <div class="fh-hud"><span class="t"></span><span class="s">0</span></div>
          <div class="fh-word" aria-live="assertive"></div>
          ${mode === "tilt"
            ? '<div class="fh-hint">Tilt down: got it · Tilt up: pass</div><div class="fh-zones"><button aria-label="Pass"></button><button aria-label="Got it"></button></div>'
            : '<div class="fh-btns"><button class="btn warn">Pass</button><button class="btn good">Got it</button></div>'}`;
        if (mode === "tilt") {
          const z = stage.querySelectorAll(".fh-zones button");
          z[0].onclick = () => mark(false); z[1].onclick = () => mark(true);
        } else {
          const bs = stage.querySelectorAll(".fh-btns button");
          bs[0].onclick = () => mark(false); bs[1].onclick = () => mark(true);
        }
        R.on(document, "keydown", (e) => {
          if (LB.modalOpen()) return;
          if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "Enter") { e.preventDefault(); mark(true); }
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); mark(false); }
        });
        const tEl = stage.querySelector(".t");
        timer = R.timer({
          seconds: secs,
          onTick: (left, s, changed) => {
            tEl.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
            if (changed && s <= 5 && s > 0) LB.sfx.tick();
          },
          onDone: finish,
        });
        nextWord();
      }

      function nextWord() {
        word = deck.words[draw.next()]; wordDone = false;
        const w = stage.querySelector(".fh-word");
        if (w) { w.textContent = word; w.classList.remove("pop"); void w.offsetWidth; w.classList.add("pop"); }
        full.classList.remove("ok", "no");
      }

      function mark(ok) {
        if (phase !== "play" || performance.now() < lockUntil || !word || wordDone) return;
        wordDone = true;
        lockUntil = performance.now() + 900;
        armed = false;
        results.push({ word, ok });
        if (ok) { score++; LB.sfx.good(); LB.buzz(30); } else { LB.sfx.skip(); LB.buzz([20, 40, 20]); }
        full.classList.add(ok ? "ok" : "no");
        const w = stage.querySelector(".fh-word"); if (w) w.textContent = ok ? "Correct!" : "Pass";
        const s = stage.querySelector(".s"); if (s) s.textContent = score;
        R.timeout(() => { if (phase === "play") nextWord(); }, 700);
      }

      function finish() {
        if (phase !== "play") return;
        phase = "done";
        if (word && !wordDone) results.push({ word, ok: false });
        LB.sfx.end(); LB.buzz([60, 60, 120]);
        LB.wake.off(); exitFull();
        full.classList.remove("ok", "no"); full.classList.add("end");
        layout();
        const prevBest = store.get(bestKey(deck.id), null);
        const isBest = prevBest == null || score > prevBest;
        if (isBest) store.set(bestKey(deck.id), score);
        stage.innerHTML = "";
        const res = LB.h(`<div class="fh-res">
          <div class="label">Time's up · ${LB.esc(deck.name)}</div>
          <div class="big-num pop"></div>
          <div class="muted best"></div>
          <div class="fh-list"></div>
          <div class="spacer"></div>
          <div class="row"><button class="btn again primary big">Next guesser</button></div>
          <div class="row"><button class="btn done">Change deck</button></div>
        </div>`);
        res.querySelector(".big-num").textContent = `${score} correct`;
        res.querySelector(".best").textContent = isBest && score > 0 ? "New best for this deck!" : prevBest != null ? `Best: ${Math.max(prevBest, score)}` : "";
        const list = res.querySelector(".fh-list");
        results.forEach((r) => { const s = document.createElement("span"); s.className = r.ok ? "y" : "n"; s.textContent = r.word; list.appendChild(s); });
        if (!results.length) list.innerHTML = '<span class="muted">No words played.</span>';
        res.querySelector(".again").onclick = () => { close(); play(); };
        res.querySelector(".done").onclick = close;
        stage.appendChild(res);
      }
    }

    function enterFull() {
      try {
        const d = document.documentElement;
        if (mode === "tilt" && d.requestFullscreen && !document.fullscreenElement) {
          d.requestFullscreen({ navigationUI: "hide" }).then(() => { try { screen.orientation.lock("landscape").catch(() => {}); } catch {} }).catch(() => {});
        }
      } catch {}
    }
    function exitFull() {
      try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch {}
      try { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {}); } catch {}
    }
    S.add(exitFull);
  },
});
})();
