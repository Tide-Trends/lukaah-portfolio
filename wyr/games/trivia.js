/* Trivia: multiple choice, solo or pass-and-play. Answer listed first, then 3 wrong ones. */
(() => {
"use strict";
const CATS = [
  { id: "general", name: "General", color: "#64748b" },
  { id: "science", name: "Science", color: "#7c5cff" },
  { id: "geo", name: "Geography", color: "#06b6d4" },
  { id: "history", name: "History", color: "#b45309" },
  { id: "pop", name: "Movies, TV & Music", color: "#ec4899" },
  { id: "food", name: "Food", color: "#f97316" },
  { id: "sports", name: "Sports", color: "#16a34a" },
  { id: "animals", name: "Animals", color: "#84cc16" },
];
const Q = [
  // science
  ["science","Which planet is known as the Red Planet?","Mars","Venus","Jupiter","Mercury"],
  ["science","Which gas do plants take in from the air for photosynthesis?","Carbon dioxide","Oxygen","Nitrogen","Helium"],
  ["science","What is the chemical symbol for gold?","Au","Ag","Gd","Go"],
  ["science","How many bones are in the adult human body?","206","186","226","256"],
  ["science","What is the hardest natural substance?","Diamond","Quartz","Titanium","Granite"],
  ["science","What is the largest planet in our solar system?","Jupiter","Saturn","Neptune","Earth"],
  ["science","In a human cell, where is most of the DNA kept?","The nucleus","The ribosomes","The cell wall","The membrane"],
  ["science","What is the closest star to Earth?","The Sun","Proxima Centauri","Sirius","Polaris"],
  ["science","At sea level, water boils at what temperature?","100 °C","90 °C","110 °C","120 °C"],
  ["science","What is the most common gas in Earth's atmosphere?","Nitrogen","Oxygen","Carbon dioxide","Argon"],
  ["science","What is the chemical symbol for sodium?","Na","So","Sd","Sn"],
  ["science","How many planets are in our solar system?","8","9","7","10"],
  ["science","Which blood type is known as the universal donor?","O negative","AB positive","A negative","B positive"],
  ["science","Light travels at roughly how fast?","300,000 km per second","30,000 km per second","3,000 km per second","3 million km per second"],
  ["science","What is the largest organ of the human body?","Skin","Liver","Brain","Lungs"],
  ["science","Which planet is famous for its big, bright rings?","Saturn","Jupiter","Mars","Mercury"],
  ["science","What does DNA stand for?","Deoxyribonucleic acid","Dinitrogen acid","Dual nucleic acid","Deoxyribose nitrate"],
  ["science","Which part of the body has a cornea and a retina?","The eye","The ear","The heart","The skin"],
  ["science","What is the freezing point of water in Fahrenheit?","32 °F","0 °F","12 °F","100 °F"],
  ["science","Which planet is closest to the Sun?","Mercury","Venus","Mars","Earth"],
  ["science","What is the largest bone in the human body?","Femur","Tibia","Skull","Humerus"],
  // geography
  ["geo","What is the capital of Australia?","Canberra","Sydney","Melbourne","Perth"],
  ["geo","What is the largest ocean on Earth?","Pacific","Atlantic","Indian","Arctic"],
  ["geo","As of 2024, which country has the most people?","India","China","United States","Indonesia"],
  ["geo","What is the capital of Canada?","Ottawa","Toronto","Vancouver","Montreal"],
  ["geo","What is the largest hot desert in the world?","Sahara","Gobi","Kalahari","Mojave"],
  ["geo","What is the tallest mountain above sea level?","Mount Everest","K2","Kilimanjaro","Denali"],
  ["geo","What is the capital of Japan?","Tokyo","Kyoto","Osaka","Hiroshima"],
  ["geo","Which country is shaped like a boot?","Italy","Greece","Portugal","Chile"],
  ["geo","What is the largest US state by area?","Alaska","Texas","California","Montana"],
  ["geo","What is the smallest country in the world?","Vatican City","Monaco","San Marino","Liechtenstein"],
  ["geo","The Great Barrier Reef is off the coast of which country?","Australia","Indonesia","Philippines","New Zealand"],
  ["geo","What is the capital of Egypt?","Cairo","Alexandria","Giza","Luxor"],
  ["geo","Which river flows through Paris?","Seine","Thames","Danube","Rhine"],
  ["geo","Machu Picchu is in which country?","Peru","Mexico","Chile","Bolivia"],
  ["geo","What is the capital of Brazil?","Brasília","Rio de Janeiro","São Paulo","Salvador"],
  ["geo","What is the largest country by area?","Russia","Canada","China","United States"],
  ["geo","What is the capital of Turkey?","Ankara","Istanbul","Izmir","Antalya"],
  ["geo","Which city is nicknamed the Big Apple?","New York City","Chicago","Boston","Los Angeles"],
  ["geo","Mount Kilimanjaro is in which country?","Tanzania","Kenya","Uganda","Ethiopia"],
  ["geo","How many continents are there?","7","5","6","8"],
  ["geo","Which country has a maple leaf on its flag?","Canada","Switzerland","Norway","New Zealand"],
  ["geo","What is the longest river in Africa?","Nile","Congo","Niger","Zambezi"],
  // history
  ["history","In what year did World War II end?","1945","1944","1946","1939"],
  ["history","Who was the first person to walk on the Moon?","Neil Armstrong","Buzz Aldrin","Yuri Gagarin","John Glenn"],
  ["history","Who was the first president of the United States?","George Washington","Abraham Lincoln","Thomas Jefferson","John Adams"],
  ["history","In what year did the Titanic sink?","1912","1905","1915","1920"],
  ["history","Who built the pyramids of Giza?","Ancient Egyptians","Romans","Greeks","Maya"],
  ["history","In what year did the Berlin Wall fall?","1989","1991","1985","1979"],
  ["history","Who painted the Mona Lisa?","Leonardo da Vinci","Michelangelo","Raphael","Vincent van Gogh"],
  ["history","In what year did Columbus first reach the Americas?","1492","1520","1607","1453"],
  ["history","Julius Caesar was a leader of which ancient civilization?","Rome","Greece","Persia","Egypt"],
  ["history","Who was the main author of the Declaration of Independence?","Thomas Jefferson","Benjamin Franklin","George Washington","John Adams"],
  ["history","Which ship carried the Pilgrims to America in 1620?","Mayflower","Santa María","Endeavour","Beagle"],
  ["history","What was the first artificial satellite in space?","Sputnik 1","Apollo 1","Explorer 1","Vostok 1"],
  ["history","Who was the British prime minister for most of World War II?","Winston Churchill","Neville Chamberlain","Clement Attlee","Margaret Thatcher"],
  ["history","In which city was President John F. Kennedy assassinated?","Dallas","Houston","Washington, D.C.","Chicago"],
  ["history","Which British monarch reigned for 70 years?","Elizabeth II","Victoria","Elizabeth I","George III"],
  ["history","Who is credited with patenting the first telephone?","Alexander Graham Bell","Thomas Edison","Nikola Tesla","Guglielmo Marconi"],
  ["history","In what year did the Wright brothers make their first powered flight?","1903","1899","1911","1920"],
  ["history","Which US war was fought between the North and the South?","The Civil War","The Revolutionary War","The War of 1812","The Spanish–American War"],
  ["history","What did Rosa Parks refuse to give up in 1955?","Her bus seat","Her vote","Her job","Her library card"],
  ["history","The Great Wall was built in which country?","China","Japan","Mongolia","India"],
  ["history","Which ancient wonder stood in Alexandria?","The Lighthouse","The Hanging Gardens","The Colossus","The Temple of Artemis"],
  // pop culture
  ["pop","What is the name of Harry Potter's owl?","Hedwig","Errol","Pigwidgeon","Fawkes"],
  ["pop","Which band recorded \"Hey Jude\"?","The Beatles","The Rolling Stones","Queen","The Who"],
  ["pop","In Finding Nemo, what kind of fish is Nemo?","Clownfish","Angelfish","Blue tang","Goldfish"],
  ["pop","What is the name of the cowboy in Toy Story?","Woody","Buzz","Jessie","Bullseye"],
  ["pop","Which superhero is secretly Bruce Wayne?","Batman","Superman","Iron Man","Green Lantern"],
  ["pop","Who is known as the King of Pop?","Michael Jackson","Elvis Presley","Prince","Justin Timberlake"],
  ["pop","In Frozen, what is the snowman's name?","Olaf","Sven","Kristoff","Hans"],
  ["pop","What is the name of Mario's brother?","Luigi","Wario","Toad","Yoshi"],
  ["pop","Which show features a parallel dimension called the Upside Down?","Stranger Things","Dark","Lost","The OA"],
  ["pop","\"May the Force be with you\" comes from which franchise?","Star Wars","Star Trek","The Matrix","Dune"],
  ["pop","Which instrument does Lisa Simpson play?","Saxophone","Trumpet","Clarinet","Violin"],
  ["pop","Who sang \"Shake It Off\"?","Taylor Swift","Katy Perry","Ariana Grande","Selena Gomez"],
  ["pop","Which movie has the line \"I'll be back\"?","The Terminator","Rambo","Die Hard","Predator"],
  ["pop","What is the coffee shop called in Friends?","Central Perk","Monk's Café","The Grind","Java Joe's"],
  ["pop","Which city does Batman protect?","Gotham City","Metropolis","Star City","Central City"],
  ["pop","Which game has you build with blocks and avoid Creepers?","Minecraft","Roblox","Fortnite","Terraria"],
  ["pop","Who directed Jaws and E.T.?","Steven Spielberg","George Lucas","Martin Scorsese","James Cameron"],
  ["pop","How many Infinity Stones are there in the Marvel movies?","6","5","7","8"],
  ["pop","In The Lion King, who is Simba's father?","Mufasa","Scar","Rafiki","Zazu"],
  ["pop","Who is SpongeBob's best friend?","Patrick Star","Squidward","Sandy Cheeks","Plankton"],
  ["pop","Which Pokémon is Ash's partner?","Pikachu","Charmander","Eevee","Squirtle"],
  ["pop","What color is Pac-Man?","Yellow","Red","Blue","Green"],
  // food
  ["food","What is the main ingredient in guacamole?","Avocado","Lime","Tomato","Green pepper"],
  ["food","Sushi comes from which country?","Japan","China","Korea","Thailand"],
  ["food","Which nut is used to make marzipan?","Almond","Cashew","Hazelnut","Peanut"],
  ["food","What is the main ingredient in hummus?","Chickpeas","Lentils","Black beans","Peas"],
  ["food","Parmesan cheese comes from which country?","Italy","France","Switzerland","Greece"],
  ["food","Raisins are dried what?","Grapes","Plums","Cranberries","Figs"],
  ["food","Which spice gives curry most of its yellow color?","Turmeric","Cumin","Paprika","Cinnamon"],
  ["food","Sauerkraut is made from which vegetable?","Cabbage","Cucumber","Onion","Lettuce"],
  ["food","Traditional mozzarella was first made from which animal's milk?","Water buffalo","Cow","Goat","Sheep"],
  ["food","What is tofu made from?","Soybeans","Rice","Chickpeas","Wheat"],
  ["food","Which fruit wears its seeds on the outside?","Strawberry","Raspberry","Kiwi","Blueberry"],
  ["food","Paella comes from which country?","Spain","Italy","Mexico","Portugal"],
  ["food","What is the main herb in traditional pesto?","Basil","Parsley","Mint","Cilantro"],
  ["food","What makes bread dough rise?","Yeast","Salt","Sugar","Butter"],
  ["food","Which drink is made from fermented honey?","Mead","Sake","Kombucha","Cider"],
  ["food","Kimchi comes from which country?","Korea","Japan","Vietnam","Thailand"],
  ["food","Which is NOT a type of pasta?","Chorizo","Penne","Farfalle","Rigatoni"],
  ["food","Which country is the origin of the pizza Margherita?","Italy","Greece","Spain","United States"],
  // sports
  ["sports","How many players does a soccer team have on the field?","11","10","9","12"],
  ["sports","How many points is a touchdown worth before the extra point?","6","7","3","5"],
  ["sports","In tennis, what do you call a score of zero?","Love","Nil","Zip","Duck"],
  ["sports","How many rings are on the Olympic flag?","5","4","6","7"],
  ["sports","Which sport uses a shuttlecock?","Badminton","Squash","Table tennis","Volleyball"],
  ["sports","How long is a marathon?","26.2 miles","24 miles","25 miles","30 miles"],
  ["sports","In basketball, how many points is a shot from behind the arc?","3","2","4","1"],
  ["sports","Which sport is played at Wimbledon?","Tennis","Cricket","Golf","Polo"],
  ["sports","In golf, what is one under par on a hole called?","Birdie","Eagle","Bogey","Albatross"],
  ["sports","How many holes are in a standard round of golf?","18","9","12","21"],
  ["sports","Which sport does Lionel Messi play?","Soccer","Basketball","Tennis","Rugby"],
  ["sports","In bowling, what are three strikes in a row called?","A turkey","A hat trick","A triple","An eagle"],
  ["sports","Which city hosted the 2016 Summer Olympics?","Rio de Janeiro","London","Tokyo","Beijing"],
  ["sports","How long is a regular soccer match, not counting stoppage time?","90 minutes","80 minutes","100 minutes","60 minutes"],
  ["sports","In which sport would you see a slam dunk?","Basketball","Volleyball","Water polo","Handball"],
  ["sports","How many bases are on a baseball diamond, counting home plate?","4","3","5","6"],
  ["sports","What is the highest belt color in most karate styles?","Black","Red","Brown","Purple"],
  // animals
  ["animals","What is the largest mammal?","Blue whale","African elephant","Giraffe","Sperm whale"],
  ["animals","How many legs does a spider have?","8","6","10","12"],
  ["animals","What is a baby kangaroo called?","Joey","Cub","Kit","Calf"],
  ["animals","What is the fastest land animal?","Cheetah","Lion","Pronghorn","Greyhound"],
  ["animals","How many hearts does an octopus have?","3","1","2","8"],
  ["animals","What is a group of crows called?","A murder","A flock of doom","A parliament","A pack"],
  ["animals","Which mammal can truly fly?","Bat","Flying squirrel","Sugar glider","Colugo"],
  ["animals","What do giant pandas mostly eat?","Bamboo","Fish","Berries","Insects"],
  ["animals","What is a group of lions called?","A pride","A pack","A herd","A troop"],
  ["animals","Which of these mammals lays eggs?","Platypus","Otter","Beaver","Seal"],
  ["animals","How many legs does an insect have?","6","8","4","10"],
  ["animals","What is the largest species of shark?","Whale shark","Great white","Hammerhead","Tiger shark"],
  ["animals","What does a camel mostly store in its hump?","Fat","Water","Blood","Muscle"],
  ["animals","What is a female deer called?","Doe","Sow","Mare","Ewe"],
  ["animals","Which bird can fly backwards?","Hummingbird","Swallow","Sparrow","Kingfisher"],
  ["animals","What do caterpillars turn into?","Butterflies or moths","Beetles","Dragonflies","Bees"],
  ["animals","Which animal has the longest neck?","Giraffe","Ostrich","Camel","Llama"],
  ["animals","What is a baby goat called?","Kid","Lamb","Foal","Calf"],
  // general
  ["general","How many days are in a leap year?","366","365","364","367"],
  ["general","How many sides does a hexagon have?","6","5","7","8"],
  ["general","What is the square root of 144?","12","14","11","16"],
  ["general","What color do you get when you mix blue and yellow?","Green","Purple","Orange","Brown"],
  ["general","How many minutes are in a day?","1,440","1,240","1,640","2,400"],
  ["general","How many keys are on a standard piano?","88","76","92","100"],
  ["general","Which language has the most native speakers?","Mandarin Chinese","English","Spanish","Hindi"],
  ["general","What is the currency of Japan?","Yen","Won","Yuan","Ringgit"],
  ["general","Who wrote Romeo and Juliet?","William Shakespeare","Charles Dickens","Jane Austen","Mark Twain"],
  ["general","How many zeros are in one million?","6","5","7","9"],
  ["general","Which month has the fewest days?","February","April","June","November"],
  ["general","How many strings does a standard guitar have?","6","4","5","8"],
  ["general","In which language does \"merci\" mean thank you?","French","Spanish","Italian","Portuguese"],
  ["general","What shape is a standard stop sign?","Octagon","Hexagon","Pentagon","Circle"],
  ["general","How many cards are in a standard deck, without jokers?","52","54","48","56"],
  ["general","Which company makes the iPhone?","Apple","Samsung","Google","Microsoft"],
  ["general","What is the Roman numeral for 10?","X","V","L","C"],
  ["general","How many colors are in a traditional rainbow?","7","6","5","8"],
  ["general","What is 15% of 200?","30","15","25","35"],
  ["general","How many weeks are in a year?","52","48","50","56"],
];

LB.register({
  id: "trivia",
  name: "Trivia",
  emoji: "🧠",
  color: "#0284c7",
  tagline: "Quick-fire questions. Solo or pass the phone.",
  players: "1+",
  tags: ["solo", "duo", "group"],
  rules: [
    "Pick a category and how many questions.",
    "Tap your answer before the timer runs out. One point per right answer.",
    "Pass the phone: players take turns, and each gets their own questions.",
    "Most points at the end wins. Your best solo score per category is saved.",
  ],
  css: `
.tv-q { font-size: clamp(21px, 5.6vw, 26px); font-weight: 800; line-height: 1.2; letter-spacing: -.015em; margin: 0; }
.tv-opts { display: flex; flex-direction: column; gap: 8px; }
.tv-opt { display: flex; align-items: center; gap: 12px; text-align: left; border: 1px solid var(--line); background: var(--surface); border-radius: 14px; padding: 13px 14px; font-weight: 700; font-size: 17px; min-height: 56px; }
.tv-opt .k { width: 28px; height: 28px; border-radius: 8px; background: var(--surface-2); display: grid; place-items: center; font-family: "JetBrains Mono", monospace; font-size: 13px; flex: none; }
.tv-opt.right { background: var(--good); color: #fff; border-color: transparent; }
.tv-opt.right .k, .tv-opt.wrong .k { background: rgba(255,255,255,.25); }
.tv-opt.wrong { background: var(--bad); color: #fff; border-color: transparent; }
.tv-opt.dim { opacity: .45; }
.tv-who { font-weight: 800; }
`,
  mount(root, S, api) {
    const store = LB.store;
    let cat = store.get("tv:cat", "mix");
    let mode = store.get("tv:mode", "solo");
    let per = store.get("tv:per", 10);
    let timed = store.get("tv:timed", true);
    const SECS = 15;
    const decks = {};
    let onKey = null;
    S.on(document, "keydown", (e) => { if (onKey && !LB.modalOpen() && !LB.typing(e)) onKey(e); });
    const poolFor = (c) => Q.map((_, i) => i).filter((i) => c === "mix" || Q[i][0] === c);
    const deckFor = (c) => (decks[c] = decks[c] || LB.deck("tv:" + c, poolFor(c).length));

    function setup() {
      api.busy = () => false;
      root.innerHTML = "";
      const pbar = LB.playersBar({ min: 2, max: 8 });
      pbar.classList.toggle("hidden", mode !== "pass");
      const el = LB.h('<div class="stack"></div>');
      const best = LB.h('<p class="muted center small" style="margin:0"></p>');
      const paintBest = () => { const b = store.get(`tv:best:${cat}:${per}`, null); best.textContent = mode === "solo" && b != null ? `Your best here: ${b}/${per}` : ""; };
      el.append(
        LB.field("Mode", LB.seg([["solo", "Solo"], ["pass", "Pass the phone"]], mode, (m) => { mode = m; store.set("tv:mode", m); pbar.classList.toggle("hidden", m !== "pass"); paintBest(); })),
        pbar,
        LB.field("Category", LB.chips([{ id: "mix", name: "Mixed", color: "var(--ink)" }, ...CATS], cat, (c) => { cat = c; store.set("tv:cat", c); paintBest(); }, { wrap: true })),
        LB.field("Questions each", LB.seg([[5, "5"], [10, "10"], [15, "15"]], per, (v) => { per = v; store.set("tv:per", v); paintBest(); })),
        LB.toggle(`${SECS}-second timer`, timed, (v) => { timed = v; store.set("tv:timed", v); }),
        best,
        LB.h('<div class="spacer"></div>'),
        LB.btn("Start", "primary big", async () => {
          let players = ["You"];
          if (mode === "pass") { players = await pbar.ensure(); if (!players) return; }
          const pool = poolFor(cat), d = deckFor(cat);
          const total = Math.min(per * players.length, pool.length);
          const qs = []; const used = new Set();
          while (qs.length < total) { const i = pool[d.next()]; if (!used.has(i)) { used.add(i); qs.push(i); } }
          play({ players, scores: players.map(() => 0), qs, n: 0, streak: 0, bestStreak: 0 });
        }),
      );
      paintBest();
      root.appendChild(el);
    }

    function play(g) {
      api.busy = () => g.n > 0 && g.n < g.qs.length;
      if (g.n >= g.qs.length) return results(g);
      root.innerHTML = "";
      const qi = g.qs[g.n], [c, text, answer, ...wrong] = Q[qi];
      const cInfo = CATS.find((x) => x.id === c);
      const p = g.n % g.players.length;
      const opts = LB.shuffle([answer, ...wrong]);
      const el = LB.h(`<div class="stack">
        <div class="meta mono"><span class="tag"><span class="dot"></span><span class="cn"></span></span><span class="pos"></span></div>
        ${g.players.length > 1 ? '<div class="tv-who"></div>' : ""}
        ${timed ? '<div class="timerbar"><span></span></div>' : ""}
        <div class="card"><p class="tv-q"></p></div>
        <div class="tv-opts"></div>
        <div class="spacer"></div>
        <button class="btn primary big next hidden">Next →</button>
      </div>`);
      el.querySelector(".dot").style.background = cInfo.color;
      el.querySelector(".cn").textContent = cInfo.name.toUpperCase();
      el.querySelector(".pos").textContent = g.players.length > 1 ? `${g.n + 1}/${g.qs.length}` : `${g.n + 1}/${g.qs.length} · score ${g.scores[0]}`;
      if (g.players.length > 1) el.querySelector(".tv-who").textContent = `${g.players[p]}'s question · ${g.scores[p]} pts`;
      el.querySelector(".tv-q").textContent = text;
      const box = el.querySelector(".tv-opts");
      let done = false, t = null;
      const btns = opts.map((o, i) => {
        const b = LB.h(`<button class="tv-opt"><span class="k">${"ABCD"[i]}</span><span class="v"></span></button>`);
        b.querySelector(".v").textContent = o;
        b.onclick = () => answerIt(o);
        box.appendChild(b);
        return b;
      });
      const next = el.querySelector(".next");
      function answerIt(choice) {
        if (done) return; done = true;
        if (t) t.stop();
        const ok = choice === answer;
        btns.forEach((b, i) => {
          if (opts[i] === answer) b.classList.add("right");
          else if (opts[i] === choice) b.classList.add("wrong");
          else b.classList.add("dim");
          b.disabled = true;
        });
        if (ok) { g.scores[p] += 1; g.streak += 1; g.bestStreak = Math.max(g.bestStreak, g.streak); LB.sfx.good(); LB.buzz(20); }
        else { g.streak = 0; LB.sfx.bad(); LB.buzz([40, 30, 40]); }
        if (choice == null) LB.toast("Time's up");
        else if (ok && g.streak >= 3 && g.players.length === 1) LB.toast(`${g.streak} in a row`);
        g.n += 1;
        next.textContent = g.n >= g.qs.length ? "See results" : g.players.length > 1 ? `Pass to ${g.players[g.n % g.players.length]} →` : "Next →";
        next.classList.remove("hidden");
        next.focus({ preventScroll: true });
      }
      next.onclick = () => play(g);
      onKey = (e) => {
        if (!el.isConnected) return;
        if (done && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); next.click(); return; }
        const k = e.key.toUpperCase();
        const i = "ABCD".indexOf(k) >= 0 ? "ABCD".indexOf(k) : "1234".indexOf(k);
        if (!done && i >= 0 && i < btns.length) btns[i].click();
      };
      root.appendChild(el);
      if (timed) {
        const bar = el.querySelector(".timerbar span");
        t = S.timer({
          seconds: SECS,
          onTick: (left, s, ch) => { bar.style.transform = `scaleX(${left / SECS})`; bar.style.background = left < 4 ? "var(--bad)" : "var(--ink)"; if (ch && s <= 3 && s > 0) LB.sfx.tick(); },
          onDone: () => answerIt(null),
        });
      }
    }

    function results(g) {
      api.busy = () => false;
      root.innerHTML = "";
      const el = LB.h('<div class="stack"></div>');
      if (g.players.length === 1) {
        const s = g.scores[0], n = g.qs.length;
        const key = `tv:best:${cat}:${per}`, prev = store.get(key, null);
        const isBest = prev == null || s > prev;
        if (isBest) store.set(key, s);
        const line = s === n ? "Perfect score." : s >= n * 0.8 ? "Big brain energy." : s >= n * 0.5 ? "Solid." : "The line was distracting you.";
        el.append(LB.h(`<div class="card center pop"><span class="label">Your score</span><div class="big-num">${s}/${n}</div><p class="lead">${line}</p><p class="muted small" style="margin:0">${isBest && s > 0 ? "New personal best" : prev != null ? `Best: ${Math.max(prev, s)}/${n}` : ""} · Best streak: ${g.bestStreak}</p></div>`));
      } else {
        const rows = g.players.map((name, i) => ({ name, score: g.scores[i] })).sort((a, b) => b.score - a.score);
        const top = rows[0].score, w = rows.filter((r) => r.score === top).map((r) => r.name);
        const card = LB.h('<div class="card center pop"><span class="label">Winner</span><p class="big"></p></div>');
        card.querySelector(".big").textContent = w.length > 1 ? `Tie: ${w.join(" & ")}` : w[0];
        el.append(card, LB.scoreboard(rows));
      }
      el.append(LB.h('<div class="spacer"></div>'), LB.btn("Play again", "primary big", () => {
        const pool = poolFor(cat), d = deckFor(cat), total = g.qs.length, qs = [], used = new Set();
        while (qs.length < total) { const i = pool[d.next()]; if (!used.has(i)) { used.add(i); qs.push(i); } }
        play({ players: g.players, scores: g.players.map(() => 0), qs, n: 0, streak: 0, bestStreak: 0 });
      }), LB.btn("Change setup", "", setup));
      LB.sfx.end();
      root.appendChild(el);
    }

    setup();
  },
});
})();
