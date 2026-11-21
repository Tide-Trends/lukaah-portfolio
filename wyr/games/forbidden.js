/* Forbidden Words: describe the word without the banned words. Two teams. */
(() => {
"use strict";
const CARDS = [
  ["Pizza","cheese","slice","Italian","delivery","pepperoni"],
  ["Beach","sand","ocean","sun","waves","swim"],
  ["Coffee","drink","morning","caffeine","Starbucks","cup"],
  ["Birthday","cake","candles","party","age","presents"],
  ["Dentist","teeth","doctor","cavity","floss","drill"],
  ["Netflix","watch","show","stream","movies","binge"],
  ["Airport","plane","fly","gate","security","luggage"],
  ["Snowman","snow","winter","carrot","build","cold"],
  ["Vampire","blood","Dracula","bite","fangs","night"],
  ["Wedding","marry","bride","groom","ring","dress"],
  ["Homework","school","teacher","assignment","study","due"],
  ["Selfie","photo","phone","camera","picture","Instagram"],
  ["Toilet","bathroom","flush","seat","paper","pee"],
  ["Gym","workout","exercise","weights","treadmill","muscles"],
  ["Rainbow","colors","rain","sky","arc","pot of gold"],
  ["Pirate","ship","treasure","parrot","sea","eye patch"],
  ["Alarm clock","wake","morning","snooze","ring","time"],
  ["Hospital","doctor","nurse","sick","emergency","patient"],
  ["Volcano","lava","erupt","mountain","hot","ash"],
  ["Halloween","costume","candy","October","trick","pumpkin"],
  ["Dinosaur","extinct","T. rex","fossil","Jurassic","big"],
  ["Chocolate","sweet","candy","brown","cocoa","bar"],
  ["Elevator","floor","button","up","down","building"],
  ["Passport","travel","country","photo","ID","border"],
  ["Library","books","read","quiet","borrow","librarian"],
  ["Moon","night","sky","space","full","Earth"],
  ["Wi-Fi","internet","password","connection","router","wireless"],
  ["Sneeze","nose","cold","achoo","bless you","tissue"],
  ["Superhero","powers","cape","save","villain","Marvel"],
  ["Pajamas","sleep","bed","night","clothes","wear"],
  ["Traffic","cars","road","jam","stuck","rush hour"],
  ["Ghost","spooky","dead","haunted","boo","white"],
  ["Camping","tent","outdoors","fire","woods","sleeping bag"],
  ["Sushi","fish","rice","Japanese","raw","roll"],
  ["Hiccups","breath","sound","stomach","water","scare"],
  ["Tattoo","ink","skin","needle","permanent","arm"],
  ["Zombie","undead","brains","walk","apocalypse","bite"],
  ["Karaoke","sing","song","microphone","lyrics","bar"],
  ["Umbrella","rain","wet","open","handle","weather"],
  ["Breakup","relationship","dump","ex","end","sad"],
  ["Penguin","bird","ice","black","white","Antarctica"],
  ["Lottery","ticket","win","money","numbers","jackpot"],
  ["Mosquito","bite","bug","itch","blood","summer"],
  ["Roller coaster","ride","theme park","loop","scream","fast"],
  ["Taxes","money","government","April","pay","IRS"],
  ["Sunscreen","sun","burn","beach","skin","SPF"],
  ["Fireworks","explode","sky","Fourth of July","New Year","boom"],
  ["Magician","magic","trick","rabbit","hat","wand"],
  ["Ice cream","cold","cone","scoop","dessert","flavor"],
  ["Job interview","hire","boss","questions","resume","work"],
  ["Spaghetti","pasta","noodles","sauce","Italian","meatballs"],
  ["Dragon","fire","fly","myth","scales","wings"],
  ["Cactus","desert","plant","spikes","water","green"],
  ["Thunderstorm","rain","lightning","loud","weather","clouds"],
  ["Grandma","old","family","mother","cookies","grandpa"],
  ["Ninja","Japan","sneaky","black","sword","fight"],
  ["Lemon","sour","yellow","fruit","juice","lime"],
  ["Snooze button","alarm","sleep","morning","minutes","wake"],
  ["Group chat","text","friends","message","phone","people"],
  ["Bowling","pins","ball","strike","alley","lane"],
  ["Mermaid","ocean","tail","fish","Ariel","swim"],
  ["Treadmill","run","gym","machine","walk","exercise"],
  ["Hangover","drink","alcohol","headache","morning","party"],
  ["Astronaut","space","NASA","rocket","moon","suit"],
  ["Pancakes","breakfast","syrup","flip","flat","batter"],
  ["Robot","machine","metal","AI","beep","computer"],
  ["Jealous","envy","want","feeling","green","partner"],
  ["Clown","circus","funny","red nose","makeup","scary"],
  ["Ghosting","ignore","text","disappear","date","reply"],
  ["Popcorn","movie","butter","kernel","pop","corn"],
  ["Doorbell","ring","door","visitor","button","knock"],
  ["Shark","ocean","teeth","fish","Jaws","bite"],
  ["Spa","massage","relax","facial","robe","sauna"],
  ["Hide and seek","game","count","find","hiding","kids"],
  ["Instagram","photo","app","post","followers","social media"],
  ["Pickle","cucumber","green","jar","sour","sandwich"],
  ["Escalator","stairs","moving","mall","up","down"],
  ["Bald","hair","head","shave","shiny","no"],
  ["Spider","legs","web","eight","bug","scary"],
  ["Graduation","school","cap","gown","diploma","finish"],
  ["Microwave","heat","food","kitchen","beep","popcorn"],
  ["Unicorn","horse","horn","magic","rainbow","myth"],
  ["Yoga","stretch","mat","pose","meditation","flexible"],
  ["Las Vegas","casino","gamble","Nevada","Strip","Sin City"],
  ["Baby","infant","cry","diaper","young","born"],
  ["Mustache","hair","lip","face","beard","shave"],
  ["Cheerleader","pom-poms","sports","cheer","team","chant"],
  ["Avocado","guacamole","green","toast","fruit","pit"],
  ["Bubble","soap","float","pop","blow","round"],
  ["Detective","mystery","solve","crime","clue","Sherlock"],
  ["Garage sale","sell","cheap","yard","used","weekend"],
  ["Monday","day","week","work","start","weekend"],
  ["Chopsticks","eat","Chinese","sushi","two","sticks"],
  ["Dog walker","leash","job","pets","walk","pay"],
  ["Fortune cookie","Chinese","message","paper","dessert","future"],
  ["Hot tub","water","bubbles","warm","Jacuzzi","relax"],
  ["Jet lag","travel","time zone","tired","flight","sleep"],
  ["Influencer","social media","followers","post","sponsor","famous"],
  ["Sleepwalking","sleep","night","walk","bed","dream"],
  ["Brain freeze","cold","ice cream","head","pain","fast"],
];

LB.register({
  id: "forbidden",
  name: "Forbidden Words",
  emoji: "🚫",
  color: "#f59e0b",
  tagline: "Describe it. Don't say the 5 banned words.",
  players: "4+",
  tags: ["group"],
  rules: [
    "Split into two teams. One person on the playing team is the describer.",
    "The describer gets the word to describe plus 5 forbidden words. Get your team to say the word without using any of them, or any part of them.",
    "No gestures, no \"sounds like\", no \"starts with\".",
    "Someone from the other team watches the screen and calls Buzz when a forbidden word slips out (−1).",
    "Got it = +1. Skip = free, or −1 if you turn on the skip penalty.",
    "Teams alternate turns. First team to the target score wins.",
  ],
  css: `
.fw-full { gap: 12px; }
.fw-hud { display: flex; justify-content: space-between; align-items: center; padding-right: 52px; font-weight: 800; }
.fw-hud .t { font-family: "JetBrains Mono", monospace; font-size: 22px; font-weight: 500; }
.fw-card { flex: 1; display: flex; flex-direction: column; border-radius: 24px; overflow: hidden; border: 1px solid var(--line); background: var(--surface); max-width: 520px; width: 100%; margin: 0 auto; min-height: 0; }
.fw-word { background: #f59e0b; color: #111; padding: 26px 20px; text-align: center; font-size: clamp(34px, 10vw, 52px); font-weight: 800; letter-spacing: -.03em; line-height: 1.05; overflow-wrap: anywhere; }
.fw-ban { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px; padding: 14px 20px; }
.fw-ban span { text-align: center; font-size: clamp(21px, 5.8vw, 27px); font-weight: 700; padding: 7px 0; border-bottom: 1px solid var(--line); }
.fw-ban span:last-child { border-bottom: 0; }
.fw-btns { display: grid; grid-template-columns: 1fr 1fr 1.3fr; gap: 8px; max-width: 520px; width: 100%; margin: 0 auto; }
.fw-btns .btn { min-height: 62px; font-size: 17px; }
.fw-sum { display: flex; flex-wrap: wrap; gap: 6px; }
.fw-sum span { padding: 7px 11px; border-radius: 99px; font-weight: 700; font-size: 14px; border: 1px solid var(--line); background: var(--surface); }
.fw-sum .got { background: var(--good); color: #fff; border-color: transparent; }
.fw-sum .buzz { background: var(--bad); color: #fff; border-color: transparent; }
.fw-sum .skip { color: var(--muted); }
.fw-teams { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.fw-score { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.fw-score div { border: 1px solid var(--line); background: var(--surface); border-radius: 16px; padding: 14px; text-align: center; }
.fw-score div.on { border-color: var(--ink); box-shadow: inset 0 0 0 1px var(--ink); }
.fw-score b { display: block; font-size: 40px; letter-spacing: -.03em; }
.fw-score span { font-weight: 700; font-size: 14px; color: var(--muted); }
`,
  mount(root, S, api) {
    const store = LB.store;
    const cfg = Object.assign({ names: ["Team Orange", "Team Blue"], secs: 60, target: 15, skipPenalty: false }, store.get("fw:cfg", {}));
    const save = () => store.set("fw:cfg", cfg);
    const deck = LB.deck("fw", CARDS.length);
    let game = null;

    function setup() {
      api.busy = () => false;
      root.innerHTML = "";
      const el = LB.h('<div class="stack"></div>');
      const teams = LB.h('<div class="fw-teams"></div>');
      cfg.names.forEach((n, i) => {
        const inp = LB.h('<input class="input" maxlength="18" autocomplete="off" autocapitalize="words">');
        inp.value = n; inp.placeholder = i ? "Team Blue" : "Team Orange";
        inp.oninput = () => { cfg.names[i] = inp.value; save(); };
        teams.appendChild(inp);
      });
      el.append(
        LB.field("Teams", teams),
        LB.field("Turn length", LB.seg([[45, "45 sec"], [60, "60 sec"], [90, "90 sec"]], cfg.secs, (v) => { cfg.secs = v; save(); })),
        LB.field("First to", LB.seg([[10, "10 pts"], [15, "15 pts"], [25, "25 pts"]], cfg.target, (v) => { cfg.target = v; save(); })),
        LB.toggle("Skipping costs a point", cfg.skipPenalty, (v) => { cfg.skipPenalty = v; save(); }),
        LB.h('<div class="spacer"></div>'),
        LB.btn("Start game", "primary big", () => {
          const names = cfg.names.map((n, i) => (n || "").trim() || (i ? "Team Blue" : "Team Orange"));
          game = { names, scores: [0, 0], team: 0, turns: 0 };
          intro();
        }),
      );
      root.appendChild(el);
    }

    function scoreBox() {
      const b = LB.h('<div class="fw-score"><div><b></b><span></span></div><div><b></b><span></span></div></div>');
      [0, 1].forEach((i) => {
        const d = b.children[i];
        d.querySelector("b").textContent = game.scores[i];
        d.querySelector("span").textContent = game.names[i];
        d.classList.toggle("on", i === game.team);
      });
      return b;
    }

    function intro() {
      api.busy = () => game.turns > 0;
      root.innerHTML = "";
      const el = LB.h(`<div class="stack">
        <div class="card center"><span class="label">Up next</span><p class="big"></p><p class="muted" style="margin:0">Pick a describer. Someone on the other team watches the screen for forbidden words.</p></div>
        <div class="score-slot"></div>
        <div class="muted center small"></div>
        <div class="spacer"></div>
        <button class="btn primary big go">Start turn</button>
        <button class="btn end">End game</button>
      </div>`);
      el.querySelector(".big").textContent = game.names[game.team];
      el.querySelector(".score-slot").replaceWith(scoreBox());
      el.querySelector(".small").textContent = `First to ${cfg.target} wins · ${cfg.secs}s turns`;
      el.querySelector(".go").onclick = turn;
      el.querySelector(".end").onclick = async () => { if (await LB.confirm("End this game?", { yes: "End game" })) setup(); };
      root.appendChild(el);
    }

    async function turn() {
      api.busy = () => true;
      const R = LB.scope(); S.add(() => R.dispose());
      const log = [];
      let pts = 0, card = null, live = false;
      const full = LB.h(`<div class="full fw-full" role="dialog" aria-label="Turn"><button class="icon-btn full-x" aria-label="Pause">${LB.icon.x}</button>
        <div class="fw-hud"><span class="tm"></span><span class="t">${cfg.secs}</span></div>
        <div class="fw-card"><div class="fw-word"></div><div class="fw-ban"></div></div>
        <div class="fw-btns"><button class="btn bad">Buzz −1</button><button class="btn warn">Skip</button><button class="btn good">Got it +1</button></div>
      </div>`);
      full.querySelector(".tm").textContent = game.names[game.team];
      document.body.appendChild(full);
      LB.wake.on();
      let timer = null;
      full.querySelector(".full-x").onclick = async () => {
        if (timer) timer.pause();
        const ok = await LB.confirm("Turn paused", { yes: "End turn", no: "Resume" });
        if (!ok) { if (timer) timer.resume(); return; }
        if (timer) timer.stop();
        done();
      };
      const show = () => {
        card = CARDS[deck.next()];
        full.querySelector(".fw-word").textContent = card[0];
        const ban = full.querySelector(".fw-ban"); ban.innerHTML = "";
        card.slice(1).forEach((w) => { const s = document.createElement("span"); s.textContent = w; ban.appendChild(s); });
        const c = full.querySelector(".fw-card"); c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop");
      };
      const act = (kind) => {
        if (!live) return;
        if (kind === "got") { pts += 1; LB.sfx.good(); LB.buzz(25); }
        else if (kind === "buzz") { pts -= 1; LB.sfx.bad(); LB.buzz([40, 30, 40]); }
        else { if (cfg.skipPenalty) pts -= 1; LB.sfx.skip(); }
        log.push({ w: card[0], kind });
        show();
      };
      const [bBuzz, bSkip, bGot] = full.querySelectorAll(".fw-btns .btn");
      bBuzz.onclick = () => act("buzz"); bSkip.onclick = () => act("skip"); bGot.onclick = () => act("got");
      if (cfg.skipPenalty) bSkip.textContent = "Skip −1";
      R.on(document, "keydown", (e) => {
        if (LB.modalOpen()) return;
        if (e.key === "ArrowRight" || e.key === "Enter") { e.preventDefault(); act("got"); }
        else if (e.key === "ArrowLeft") act("skip");
        else if (e.key === "ArrowDown" || e.key === "b") act("buzz");
      });
      const cardEl = full.querySelector(".fw-card");
      cardEl.style.position = "relative";
      await LB.countdown(cardEl, R);
      if (!R.alive) return;
      live = true;
      show();
      const tEl = full.querySelector(".t");
      timer = R.timer({
        seconds: cfg.secs,
        onTick: (l, s, ch) => { tEl.textContent = s; if (ch && s <= 5 && s > 0) LB.sfx.tick(); },
        onDone: () => { LB.sfx.buzzer(); LB.buzz([120, 60, 120]); done(); },
      });
      function done() {
        live = false;
        R.dispose(); full.remove(); LB.wake.off();
        game.scores[game.team] += pts;
        game.turns += 1;
        summary(log, pts);
      }
    }

    function summary(log, pts) {
      root.innerHTML = "";
      const team = game.team;
      const won = game.scores[team] >= cfg.target;
      const el = LB.h(`<div class="stack">
        <div class="card center pop"><span class="label"></span><p class="big"></p></div>
        <div class="score-slot"></div>
        <div class="fw-sum"></div>
        <div class="spacer"></div>
        <button class="btn primary big next"></button>
        <button class="btn end"></button>
      </div>`);
      el.querySelector(".label").textContent = won ? "Winner" : `${game.names[team]} this turn`;
      el.querySelector(".big").textContent = won ? `${game.names[team]} wins!` : `${pts >= 0 ? "+" : ""}${pts} point${Math.abs(pts) === 1 ? "" : "s"}`;
      const sum = el.querySelector(".fw-sum");
      log.filter((l) => l.kind !== "left").forEach((l) => {
        const s = document.createElement("span"); s.className = l.kind; s.textContent = (l.kind === "got" ? "✓ " : l.kind === "buzz" ? "✗ " : "↷ ") + l.w; sum.appendChild(s);
      });
      if (!won) game.team = 1 - team;
      el.querySelector(".score-slot").replaceWith(scoreBox());
      const nx = el.querySelector(".next"), end = el.querySelector(".end");
      if (won) {
        LB.sfx.end(); LB.buzz([60, 40, 60, 40, 160]);
        api.busy = () => false;
        nx.textContent = "Rematch";
        nx.onclick = () => { game = { names: game.names, scores: [0, 0], team: 0, turns: 0 }; intro(); };
        end.textContent = "Change setup"; end.onclick = setup;
      } else {
        nx.textContent = `${game.names[game.team]}'s turn →`;
        nx.onclick = intro;
        end.textContent = "End game";
        end.onclick = async () => { if (await LB.confirm("End this game?", { yes: "End game" })) setup(); };
      }
      root.appendChild(el);
    }

    setup();
  },
});
})();
