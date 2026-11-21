/* Prompt-deck party games: Most Likely To, Never Have I Ever, Hot Seat. */
(() => {
"use strict";

const MLT = {
  classic: ["become famous by accident", "survive a zombie apocalypse", "get lost in their own neighborhood", "cry at a commercial", "show up at the wrong airport", "adopt way too many pets", "forget their own birthday", "talk their way out of a speeding ticket", "start a fight in the group chat", "laugh at the worst possible moment", "eat something off the floor", "fall asleep at a party", "send a text to the wrong person", "become a billionaire", "go viral for something embarrassing", "win a reality show", "get kicked out of a museum", "become best friends with a stranger in line", "have a secret talent nobody knows about", "binge an entire series in one day", "trip over absolutely nothing", "start a business that actually works", "get arrested for something ridiculous", "run for president", "be late to their own wedding", "spend all their money on snacks", "know everyone's business", "actually read the terms and conditions", "trust a stranger way too fast", "move to another country on a whim", "break their phone this year", "give the best advice", "give terrible advice with total confidence", "talk to animals like they're people", "still be awake at 4 a.m.", "forget why they walked into a room", "sing in public with zero shame", "order the same thing every single time", "become a conspiracy theorist", "get a celebrity to reply to them"],
  savage: ["ghost someone after a great first date", "lie on their résumé", "secretly judge everyone's outfit", "get back with an ex they swore off", "pretend to be busy to dodge plans", "screenshot a private conversation and share it", "have a secret second account", "read someone's texts over their shoulder", "take credit for someone else's idea", "re-gift a present", "cancel plans at the last minute", "be the main character in every story they tell", "start drama and then act surprised", "lie about having seen a movie", "leave someone on read for a week", "argue with strangers online", "flirt their way out of trouble", "take a secret to the grave", "spend 20 minutes writing a two-line text", "have checked an ex's profile this week", "humble-brag in the group chat", "eat someone else's leftovers from the fridge", "fake being sick to skip work", "double-text, then triple-text", "remember every embarrassing thing you've ever done", "pretend to know a song they've never heard", "say \"on my way\" before they've left the house", "make a terrible decision at 2 a.m.", "write a long angry message and never send it", "hold a grudge for over a decade", "quietly unfollow someone after an argument", "talk about someone and then be the nicest to their face", "pick a fight just to win it", "lie in this game"],
  future: ["be a millionaire by 40", "have the most kids", "end up living on a farm", "write a book", "end up in a documentary", "marry someone they met online", "become a teacher", "live to 100", "become a famous chef", "move to Mars if they got the chance", "get a tattoo they regret", "run a marathon", "end up as a CEO", "quit their job to travel the world", "still be friends with everyone here in 20 years", "become an influencer", "buy a boat they can't afford", "win the lottery and lose it all", "be the cool grandparent", "go back to school at 50", "invent something", "get married first", "live in a van by choice", "star in a commercial", "become a meme"],
};

const NHIE = {
  mild: ["broken a bone", "been on TV", "met a celebrity", "fallen asleep in a movie theater", "lied about my age", "forgotten someone's name seconds after meeting them", "cried at a movie in public", "sung karaoke", "gone a whole day without my phone", "pretended to get a joke I didn't get", "stayed up all night", "won a contest", "been stuck in an elevator", "dyed my hair a wild color", "read a whole book in one day", "had a crush on a teacher", "talked to myself out loud in public", "snooped through someone's stuff", "faked being sick to skip school", "walked into a glass door", "eaten an entire pizza by myself", "looked for my phone while holding it", "broken something and blamed someone else", "ridden in an ambulance", "flown on a plane alone", "hidden from someone I knew in a store", "forgotten a close friend's birthday", "gotten a speeding ticket", "had a nickname I hated", "cut my own hair"],
  awkward: ["waved back at someone who wasn't waving at me", "called a teacher \"Mom\" or \"Dad\"", "sent a text about someone to that person", "fallen in public and pretended it didn't happen", "had my card declined on a date", "liked an old photo while stalking someone", "laughed so hard I snorted", "walked into the wrong bathroom", "been caught singing alone", "replied-all by accident", "said \"you too\" when a server said \"enjoy your meal\"", "had food in my teeth for an entire date", "gotten my head stuck in something", "been caught talking about someone behind their back", "practiced a conversation in the mirror", "worn my shirt inside out all day", "googled myself", "run a fan account", "video-called someone by accident", "fallen asleep on a bus or train and missed my stop", "cried to get out of trouble", "been kicked out of a store or restaurant", "pushed a door that clearly said pull, twice", "forgotten my lines in front of a crowd", "pretended to be on the phone to avoid someone"],
  wild: ["been kicked out of a bar", "kissed someone I'd just met", "gone skinny-dipping", "gotten a tattoo I regret", "dated two people at once", "lied to get out of a date", "had a crush on a friend's partner", "been on a blind date", "slid into someone's DMs", "stayed out until sunrise", "snuck into a concert or event", "texted an ex at 2 a.m.", "ghosted someone", "been in a fistfight", "gone on a date from a dating app", "woken up with no idea how I got home", "lied during this game", "had a secret relationship", "broken up with someone over text", "regretted a text the second I sent it", "faked an emergency to escape a date", "had a crush on someone in this room", "snuck out of the house", "lied about where I was", "been the third wheel for a whole trip"],
  travel: ["been to another continent", "missed a flight", "eaten bugs", "slept in an airport", "gotten food poisoning on vacation", "been somewhere I didn't speak the language at all", "eaten something without knowing what it was", "camped for more than one night", "ridden a horse", "been on a cruise", "done a road trip over 10 hours", "eaten a whole meal standing over the sink", "sent food back at a restaurant", "left a restaurant without paying", "been seasick", "gotten lost in a foreign city", "traveled alone", "eaten breakfast for dinner", "eaten at a Michelin-star restaurant", "tried a food on a dare"],
};

const HOT = {
  easy: ["What's the last thing you searched on your phone?", "What's your go-to karaoke song?", "What food could you eat every day?", "What's the worst gift you've ever gotten?", "What's your most useless talent?", "Who here would you call first in an emergency?", "What's your most-used emoji?", "What's the best concert you've ever been to?", "What's your comfort movie?", "What smell instantly takes you back somewhere?", "Never use social media again, or never watch TV again?", "What's the weirdest thing in your fridge right now?", "What app do you spend way too much time on?", "What was your first job?", "What's the strangest dream you remember?", "What did you want to be when you were a kid?", "What's a hill you'll die on?", "What's the best thing you've bought for under $50?", "What's your guilty-pleasure song?", "What would your walk-up song be?", "Morning person or night owl, and why?", "What trend did you secretly like?", "What's the most overrated food?", "What skill would you love to learn overnight?", "What's your worst habit?", "What's the best advice you've ever gotten?", "What's the last thing that made you laugh out loud?", "If you had a warning label, what would it say?", "What's your exact coffee or drink order?", "What movie does everyone love that you can't stand?"],
  deep: ["What's something you've changed your mind about recently?", "What's a fear you've never told anyone?", "When did you last cry, and why?", "What's the hardest thing you've ever done?", "What do you hope people say about you when you're not in the room?", "What moment would you love to relive?", "What's something you wish you'd done differently?", "Who's had the biggest impact on your life?", "What do you think your biggest flaw is?", "What are you proud of that nobody knows about?", "What's a goal you haven't told anyone?", "What's a compliment you've never forgotten?", "What does a perfect day look like for you?", "What do you need more of in your life right now?", "What have you forgiven but not forgotten?", "What would your younger self think of you now?", "What's a lesson you learned the hard way?", "What's something you pretend to like?", "What's the best decision you've ever made?", "When do you feel most like yourself?", "What are you still trying to get over?", "What would you do if you knew you couldn't fail?", "What's the kindest thing a stranger has done for you?", "Which friendship has meant the most to you?", "What do you wish more people asked you about?", "What are you avoiding right now?", "What's one thing you'd change about how you were raised?", "When do you feel most alone?", "What do you believe that most people here would disagree with?", "What scares you about the future?"],
  spicy: ["Who here would you trust with your unlocked phone?", "What's the most embarrassing thing in your camera roll?", "What's the biggest lie you've ever told?", "What's your biggest red flag?", "What was your most awkward date?", "Have you ever had a crush on someone in this room?", "What's the pettiest thing you've ever done?", "What's a secret you've kept from your parents?", "What's the worst thing you've done that nobody found out about?", "Who would you call to help you hide a body, and why them?", "What's the last lie you told?", "Who here would you least want to be stranded with?", "What have you done that you'd never admit to your boss?", "What's the most trouble you've ever been in?", "Rate your last relationship out of 10. Explain.", "What's your worst habit in relationships?", "What's the weirdest thing you do when you're home alone?", "Who's the last person you looked up online?", "What's the most childish thing you still do?", "What's the worst thing you've said in an argument?", "What opinion do you keep to yourself to avoid drama?", "Which ex would you actually get back with?", "What's the most money you've wasted on one thing?", "What rumor about you was actually true?", "Who here has the best taste?", "Who here gives the worst advice?", "What's the cringiest thing you've done to impress someone?", "What would you hate for your crush to find out about you?", "What's your go-to excuse to get out of plans?", "What's one thing you'd change about the person on your left?"],
  whatif: ["If you could live in any decade, which one and why?", "If you could have dinner with anyone, alive or dead, who?", "If your life were a movie, who would play you?", "If you won $10 million tomorrow, what's the first thing you'd buy?", "If you could master any instrument instantly, which one?", "If you could swap lives with someone here for a day, who?", "If you had to delete every app but three, which three stay?", "If you could uninvent one thing, what would it be?", "If you could only eat one cuisine forever, which one?", "If you were famous, what would it be for?", "If you could relive one year of your life, which one?", "If you had to pick a new first name, what would it be?", "If you could get a true answer to one question, what would you ask?", "If you could be an expert in any field overnight, which one?", "If animals could talk, which would be the rudest?", "If you were a ghost, who would you haunt?", "If you could live anywhere in the world, where?", "If you had one trip in a time machine, past or future?", "If you had to have a lame superpower, which one would you pick?", "If you could make one rule everyone had to follow, what is it?", "If you could erase one memory, would you? Which?", "If you started a band, what would it be called?", "If you had to wear one outfit forever, what is it?", "If you could switch off one emotion, which one?", "If you had to open a business tomorrow, what would it be?", "If you could text your past self one sentence, what would it say?", "If you were a villain, what would your evil plan be?", "If you could redo one decision, which one?", "If you could be fluent in any language, which one?", "If you could see one stat about your life, what would it be?"],
};

// Shared prompt-deck game builder.
function promptGame(cfg) {
  const ALL = [];
  cfg.cats.forEach((c) => cfg.data[c.id].forEach((t) => ALL.push([c.id, t])));
  const catName = Object.fromEntries(cfg.cats.map((c) => [c.id, c.name]));
  const catColor = Object.fromEntries(cfg.cats.map((c) => [c.id, c.color]));
  LB.register({
    id: cfg.id, name: cfg.name, emoji: cfg.emoji, color: cfg.color, tagline: cfg.tagline,
    players: cfg.players, tags: cfg.tags, rules: cfg.rules,
    css: `.pd-card .pd-meta { position: absolute; top: 16px; left: 20px; right: 20px; }
` + (cfg.css || ""),
    mount(root, S, api) {
      const store = LB.store, K = (k) => `${cfg.id}:${k}`;
      let cat = store.get(K("cat"), "all");
      if (cat !== "all" && !catName[cat]) cat = "all";
      const decks = {};
      const pool = () => ALL.map((_, i) => i).filter((i) => cat === "all" || ALL[i][0] === cat);
      const draw = () => { const list = pool(); const d = decks[cat] || (decks[cat] = LB.deck(`${cfg.id}:${cat}`, list.length)); return list[d.next()]; };
      const hist = []; let pos = -1;

      root.innerHTML = "";
      const el = LB.h(`<div class="stack">
        <div class="chipslot"></div>
        <div class="card fill pd-card" style="position:relative"><div class="meta mono small pd-meta"><span class="tag"><span class="dot"></span><span class="cn"></span></span><span class="num"></span></div><span class="label pre"></span><p class="big txt" aria-live="polite"></p><div class="pd-in"></div></div>
        <div class="extra"></div>
        <div class="bottom"><button class="icon-btn prev" aria-label="Previous">${LB.icon.back}</button><button class="btn primary big nx">Next</button><button class="icon-btn sh" aria-label="Share">${LB.icon.share}</button></div>
      </div>`);
      root.appendChild(el);
      const $ = (s) => el.querySelector(s);
      const opts = [{ id: "all", name: "All" }, ...cfg.cats.map((c) => ({ id: c.id, name: c.name, color: c.color }))];
      $(".chipslot").replaceWith(LB.chips(opts, cat, (c) => { cat = c; store.set(K("cat"), c); hist.length = 0; pos = -1; go(1); }));
      $(".pre").textContent = cfg.prefix;

      const ext = cfg.extra ? cfg.extra({ root, el, S, api, card: $(".pd-card"), inner: $(".pd-in"), slot: $(".extra"), store, K }) : {};

      function paint() {
        const [c, t] = ALL[hist[pos]];
        $(".cn").textContent = catName[c];
        $(".pd-card .dot").style.background = catColor[c];
        $(".num").textContent = `#${pos + 1}`;
        const txt = $(".txt");
        txt.textContent = cfg.format ? cfg.format(t) : t;
        txt.classList.remove("pop"); void txt.offsetWidth; txt.classList.add("pop");
        $(".prev").disabled = pos <= 0;
      }
      function go(dir) {
        if (dir > 0) {
          if (pos >= 0 && ext.beforeNext && ext.beforeNext() === false) return;
          if (pos < hist.length - 1) pos++;
          else { hist.push(draw()); pos = hist.length - 1; }
          LB.sfx.tap();
        } else {
          if (pos <= 0) return;
          if (ext.beforePrev && ext.beforePrev() === false) return;
          pos--;
        }
        paint();
        if (ext.after) ext.after(dir, ALL[hist[pos]]);
      }
      ext.go = go;
      $(".nx").onclick = () => go(1);
      $(".prev").onclick = () => go(-1);
      $(".sh").onclick = () => { const [, t] = ALL[hist[pos]]; LB.share(`${cfg.prefix} ${cfg.format ? cfg.format(t) : t}`); };
      LB.swipe(S, $(".pd-card"), { left: () => go(1), right: () => go(-1) });
      S.on(document, "keydown", (e) => {
        if (LB.modalOpen() || LB.typing(e) || document.querySelector(".full")) return;
        if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") { if (e.target.closest && e.target.closest("button") && e.key !== "ArrowRight") return; e.preventDefault(); go(1); }
        else if (e.key === "ArrowLeft") go(-1);
        else if (ext.key) ext.key(e);
      });
      go(1);
    },
  });
}

// ---------- Most Likely To ----------
promptGame({
  id: "mostlikely", name: "Most Likely To", emoji: "👉", color: "#ea580c",
  tagline: "Count to three. Everyone points. No take-backs.",
  players: "3+", tags: ["group"],
  rules: [
    "Read the card out loud.",
    "Hit Point. On \"Point!\" everyone points at the person most likely to do it.",
    "Whoever gets the most fingers has to explain themselves (or take a forfeit you agree on).",
    "Swipe or tap Next for a new card.",
  ],
  prefix: "Who's most likely to…",
  format: (t) => t.charAt(0).toUpperCase() + t.slice(1) + "?",
  cats: [
    { id: "classic", name: "Classic", color: "#ea580c" },
    { id: "savage", name: "Savage", color: "#dc2626" },
    { id: "future", name: "Future", color: "#2563eb" },
  ],
  data: MLT,
  css: `.ml-point { font-size: clamp(72px, 24vw, 120px); font-weight: 800; letter-spacing: -.05em; }`,
  extra({ slot, card, S }) {
    let busy = false;
    const b = LB.btn("3 · 2 · 1 · Point!", "", async () => {
      if (busy) return; busy = true; b.disabled = true;
      await LB.countdown(card, S, 3);
      if (!S.alive) return;
      const p = LB.h('<div class="countdown"><span class="ml-point pop">👉 Point!</span></div>');
      p.querySelector("span").style.fontSize = "clamp(44px, 14vw, 72px)";
      card.appendChild(p); LB.buzz([40, 30, 40]);
      S.timeout(() => { p.remove(); busy = false; b.disabled = false; }, 1600);
    });
    slot.appendChild(b);
    return { key: (e) => { if (e.key.toLowerCase() === "p") b.click(); } };
  },
});

// ---------- Never Have I Ever ----------
promptGame({
  id: "neverhave", name: "Never Have I Ever", emoji: "✋", color: "#0891b2",
  tagline: "Hold up five fingers. Put one down every time you've done it.",
  players: "2+", tags: ["duo", "group"],
  rules: [
    "Everyone holds up five fingers.",
    "Read the card. Anyone who HAS done it puts a finger down and explains if asked.",
    "Out of fingers? You're out. Last person with fingers up wins.",
    "Turn on Track fingers and the phone keeps count: tap the people who have done it, then Next.",
  ],
  prefix: "Never have I ever…",
  format: (t) => t + ".",
  cats: [
    { id: "mild", name: "Mild", color: "#16a34a" },
    { id: "awkward", name: "Awkward", color: "#d97706" },
    { id: "wild", name: "Wild", color: "#dc2626" },
    { id: "travel", name: "Travel & food", color: "#0891b2" },
  ],
  data: NHIE,
  css: `
.nh-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 6px; }
.nh-p { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); font-weight: 700; text-align: left; min-height: 52px; }
.nh-p .nm { font-size: 14px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nh-p .f { font-size: 12px; letter-spacing: 1px; color: var(--muted); }
.nh-p[aria-pressed="true"] { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.nh-p[aria-pressed="true"] .f { color: var(--bg); opacity: .8; }
.nh-p.out { opacity: .35; text-decoration: line-through; }
.nh-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
`,
  extra({ slot, S, store, K, api }) {
    const START = 5;
    let on = store.get(K("track"), false);
    let players = LB.players(), fingers = players.map(() => START), marked = new Set();
    const snaps = []; // fingers before each committed Next, for Back
    const wrap = LB.h('<div class="stack" style="gap:8px"></div>');
    const head = LB.h('<div class="nh-head"></div>');
    const tog = LB.toggle("Track fingers", on, (v) => { on = v; store.set(K("track"), v); if (v) reset(); paint(); });
    tog.style.flex = "1";
    const edit = LB.btn("Players", "", async () => { const r = await LB.editPlayers({ min: 2, max: 12 }); if (r) { players = r; reset(); paint(); } });
    edit.style.cssText = "min-height:44px;padding:8px 12px;font-size:14px;flex:none";
    head.append(tog, edit);
    const grid = LB.h('<div class="nh-grid"></div>');
    wrap.append(head, grid);
    slot.appendChild(wrap);
    function reset() { players = LB.players(); fingers = players.map(() => START); marked.clear(); snaps.length = 0; }
    function alive() { return fingers.filter((f) => f > 0).length; }
    function paint() {
      edit.classList.toggle("hidden", !on);
      grid.classList.toggle("hidden", !on);
      api.busy = () => on && snaps.length > 0;
      grid.innerHTML = "";
      players.forEach((name, i) => {
        const b = LB.h('<button type="button" class="nh-p"><span class="nm"></span><span class="f"></span></button>');
        b.querySelector(".nm").textContent = name;
        b.querySelector(".f").textContent = fingers[i] > 0 ? "●".repeat(fingers[i]) + "○".repeat(START - fingers[i]) : "out";
        b.setAttribute("aria-pressed", String(marked.has(i)));
        b.setAttribute("aria-label", `${name}, ${fingers[i]} fingers left${marked.has(i) ? ", has done it" : ""}`);
        if (fingers[i] <= 0) { b.classList.add("out"); b.disabled = true; }
        b.onclick = () => { if (marked.has(i)) marked.delete(i); else marked.add(i); LB.sfx.tap(); paint(); };
        grid.appendChild(b);
      });
    }
    paint();
    return {
      beforeNext() {
        if (!on) return true;
        if (alive() <= 1 && snaps.length) { reset(); paint(); LB.toast("New game: everyone back to 5"); return true; }
        snaps.push(fingers.slice());
        const outNow = [];
        marked.forEach((i) => { fingers[i] = Math.max(0, fingers[i] - 1); if (fingers[i] === 0) outNow.push(players[i]); });
        marked.clear();
        if (outNow.length) { LB.sfx.bad(); LB.toast(`${outNow.join(" & ")} ${outNow.length > 1 ? "are" : "is"} out!`); }
        const left = fingers.map((f, i) => [f, i]).filter(([f]) => f > 0);
        if (left.length <= 1 && players.length > 1) {
          paint();
          const who = left.length ? players[left[0][1]] : "Nobody";
          LB.sfx.end();
          LB.sheet({ title: left.length ? `${who} wins!` : "Everybody's out!", body: `<p class="muted" style="margin:0">${left.length ? "Last one with a finger up. Most innocent person here, apparently." : "You all ran out on the same card. Impressive."}</p>`, actions: [{ label: "Play again", value: true, primary: true }] }).then(() => { reset(); paint(); });
          return true;
        }
        paint();
        return true;
      },
      beforePrev() {
        if (on && snaps.length) { fingers = snaps.pop(); marked.clear(); paint(); }
        return true;
      },
    };
  },
});

// ---------- Hot Seat ----------
promptGame({
  id: "hotseat", name: "Hot Seat", emoji: "🔥", color: "#e11d48",
  tagline: "One person, rapid questions, no dodging.",
  players: "2+", tags: ["duo", "group"],
  rules: [
    "One person sits in the hot seat. Everyone else reads them questions.",
    "They answer honestly. One pass allowed per turn.",
    "Turn on Pick the person and the phone chooses who's in the seat and rotates every few questions.",
    "Spicy questions are for friends who can take it. Choose a category up top.",
  ],
  prefix: "Question",
  cats: [
    { id: "easy", name: "Easy", color: "#16a34a" },
    { id: "deep", name: "Deep", color: "#7c3aed" },
    { id: "spicy", name: "Spicy", color: "#dc2626" },
    { id: "whatif", name: "What if", color: "#2563eb" },
  ],
  data: HOT,
  css: `
.hs-seat { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 14px; background: var(--ink); color: var(--bg); font-weight: 800; }
.hs-seat .n { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 17px; }
.hs-seat .q { font-family: "JetBrains Mono", monospace; font-size: 12px; opacity: .75; }
.hs-opts { display: flex; gap: 8px; align-items: center; }
.hs-opts .toggle { flex: 1; }
`,
  extra({ slot, store, K, el }) {
    let on = store.get(K("pick"), false);
    let per = store.get(K("per"), 3);
    let order = [], who = -1, count = 0;
    const turnHist = [];
    const seat = LB.h('<div class="hs-seat"><span>🔥</span><span class="n"></span><span class="q"></span></div>');
    el.querySelector(".pd-card").before(seat);
    const opts = LB.h('<div class="hs-opts"></div>');
    const perSeg = LB.seg([[1, "1"], [3, "3"], [5, "5"]], per, (v) => { per = v; store.set(K("per"), v); paint(); });
    perSeg.style.flex = "none"; perSeg.setAttribute("aria-label", "Questions per turn");
    const tog = LB.toggle("Pick the person", on, async (v) => {
      if (v) { const r = await LB.playersBar({ min: 2, max: 16 }).ensure(); if (!r) { tog.querySelector("input").checked = false; return; } }
      on = v; store.set(K("pick"), v); order = []; who = -1; turnHist.length = 0; if (on) { rotate(); count = 1; } paint();
    });
    const edit = LB.btn("Players", "", async () => { const r = await LB.editPlayers({ min: 2, max: 16 }); if (r && on) { order = []; who = -1; turnHist.length = 0; rotate(); count = 1; paint(); } });
    edit.style.cssText = "min-height:44px;padding:8px 12px;font-size:14px;flex:none";
    opts.append(tog, perSeg, edit);
    slot.appendChild(opts);
    function rotate() {
      const p = LB.players();
      if (!order.length) { order = LB.shuffle(p.map((_, i) => i)); if (order.length > 1 && order[0] === who) order.push(order.shift()); }
      who = order.shift(); count = 0;
    }
    function paint() {
      seat.classList.toggle("hidden", !on);
      perSeg.classList.toggle("hidden", !on);
      edit.classList.toggle("hidden", !on);
      if (!on) return;
      const p = LB.players();
      seat.querySelector(".n").textContent = `In the seat: ${p[who] || "?"}`;
      seat.querySelector(".q").textContent = `${Math.min(count, per)}/${per}`;
    }
    if (on) { if (LB.players().length >= 2) { rotate(); count = 1; } else on = false; }
    paint();
    return {
      beforeNext() {
        if (!on) return true;
        turnHist.push([order.slice(), who, count]);
        if (count >= per) { rotate(); LB.buzz(30); }
        count++;
        return true;
      },
      beforePrev() {
        if (on && turnHist.length) { const [o, w, c] = turnHist.pop(); order = o; who = w; count = c; }
        return true;
      },
      after() { paint(); },
    };
  },
});
})();
