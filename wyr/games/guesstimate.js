/* Guesstimate: closest number wins. */
(() => {
"use strict";
// [question, answer, unit, approx?]
const Q = [
  ["How many bones are in the adult human body?", 206, "bones"],
  ["How many keys are on a standard piano?", 88, "keys"],
  ["In what year did the first iPhone go on sale?", 2007, ""],
  ["How many countries are members of the United Nations?", 193, "countries"],
  ["How many minutes are in a week?", 10080, "minutes"],
  ["How tall is the Eiffel Tower, in meters, to the tip?", 330, "m", true],
  ["In what year did the Titanic sink?", 1912, ""],
  ["In what year did humans first land on the Moon?", 1969, ""],
  ["How tall is Mount Everest, in meters?", 8849, "m", true],
  ["How far away is the Moon, on average, in kilometers?", 384400, "km", true],
  ["How many Earth days does it take Mars to orbit the Sun?", 687, "days", true],
  ["How many squares are on a chessboard?", 64, "squares"],
  ["How many hours are in a (non-leap) year?", 8760, "hours"],
  ["How many elements are on the periodic table?", 118, "elements"],
  ["How many bones are in a giraffe's neck?", 7, "vertebrae"],
  ["How many teeth does an adult have, including wisdom teeth?", 32, "teeth"],
  ["In what year did the Berlin Wall fall?", 1989, ""],
  ["In what year was Google founded?", 1998, ""],
  ["In what year did YouTube launch?", 2005, ""],
  ["In what year was the first Harry Potter book published?", 1997, ""],
  ["How long is a marathon, in kilometers?", 42.195, "km"],
  ["What is the boiling point of water in Fahrenheit?", 212, "°F"],
  ["How many seconds are in an hour?", 3600, "seconds"],
  ["How many US states border Canada?", 13, "states"],
  ["How many time zones does Russia have?", 11, "time zones"],
  ["In what year was the Eiffel Tower completed?", 1889, ""],
  ["How many players are on the field for one rugby union team?", 15, "players"],
  ["How many legs does a lobster have?", 10, "legs"],
  ["How long is an Olympic swimming pool, in meters?", 50, "m"],
  ["How fast is the speed of sound at sea level, in km/h?", 1235, "km/h", true],
  ["About how many languages are spoken in the world today?", 7000, "languages", true],
  ["What's the world population, in billions (2024)?", 8.1, "billion", true],
  ["How many episodes of Friends were made?", 236, "episodes"],
  ["In what year was the Statue of Liberty dedicated?", 1886, ""],
  ["In what year did World War I begin?", 1914, ""],
  ["How many bones are in one human hand?", 27, "bones"],
  ["How far is it to fly from New York to Los Angeles, in miles?", 2450, "miles", true],
  ["What's the classic \"normal\" body temperature in Fahrenheit?", 98.6, "°F"],
  ["In what year was the first Star Wars movie released?", 1977, ""],
  ["How many Oscars did Titanic win?", 11, "Oscars"],
  ["How many years did the Hundred Years' War actually last?", 116, "years"],
  ["What's the hottest air temperature ever recorded on Earth, in Fahrenheit?", 134, "°F"],
  ["How deep is the deepest point of the ocean, in meters?", 10935, "m", true],
  ["How many countries are in Africa?", 54, "countries"],
  ["In what year was the first PlayStation released in Japan?", 1994, ""],
  ["In what year did Facebook launch?", 2004, ""],
  ["How many dots are there in total on a pair of standard dice?", 42, "dots"],
  ["How tall is the Burj Khalifa, in meters?", 828, "m"],
  ["How many floors does the Burj Khalifa have above ground?", 163, "floors"],
  ["How many hearts does an octopus have?", 3, "hearts"],
  ["How many days are in 10 (non-leap) years?", 3650, "days"],
  ["How many strings does a standard harp have?", 47, "strings"],
  ["How many stairs does it take to reach the top of the Eiffel Tower?", 1665, "steps", true],
];

const fmt = (n, year) => (year && Number.isInteger(n) ? String(n) : n.toLocaleString(undefined, { maximumFractionDigits: 3 }));
const isYear = (q) => /what year/i.test(q[0]);
function parse(s) {
  s = String(s || "").trim().toLowerCase().replace(/[,\s_]/g, "");
  const m = s.match(/^(-?\d*\.?\d+)([kmb])?$/);
  if (!m) return null;
  const mult = { k: 1e3, m: 1e6, b: 1e9 }[m[2]] || 1;
  return parseFloat(m[1]) * mult;
}

LB.register({
  id: "guesstimate",
  name: "Guesstimate",
  emoji: "🎯",
  color: "#0d9488",
  tagline: "Nobody knows the exact number. Closest wins.",
  players: "1+",
  tags: ["solo", "duo", "group"],
  rules: [
    "Read the question. Everyone guesses a number.",
    "Shout it: everyone says a guess out loud, then reveal the answer.",
    "Type it: pass the phone and type guesses in secret. You can type 2k or 1.5m.",
    "Closest guess gets 1 point. Dead-on gets 2.",
  ],
  css: `
.gs-ans { font-size: clamp(44px, 13vw, 68px); font-weight: 800; letter-spacing: -.04em; line-height: 1; margin: 0; }
.gs-unit { font-size: 18px; color: var(--muted); font-weight: 700; }
.gs-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); font-weight: 700; }
.gs-row .n { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gs-row .g { font-family: "JetBrains Mono", monospace; }
.gs-row .d { font-size: 12px; color: var(--muted); font-family: "JetBrains Mono", monospace; min-width: 64px; text-align: right; }
.gs-row.win { background: var(--good); color: #fff; border-color: transparent; }
.gs-row.win .d { color: #fff; opacity: .85; }
.gs-input { font-size: 32px; text-align: center; font-weight: 800; padding: 16px; }
`,
  mount(root, S, api) {
    const store = LB.store;
    let mode = store.get("gs:mode", "shout");
    let rounds = store.get("gs:rounds", 5);
    const deck = LB.deck("gs", Q.length);
    let g = null;

    function setup() {
      api.busy = () => false;
      root.innerHTML = "";
      const pbar = LB.playersBar({ min: 2, max: 10 });
      pbar.classList.toggle("hidden", mode !== "type");
      const el = LB.h('<div class="stack"></div>');
      el.append(
        LB.h('<div class="card center"><div style="font-size:56px;line-height:1">🎯</div><p class="lead">Real numbers, wild guesses. Closest one wins the round.</p></div>'),
        LB.field("Mode", LB.seg([["shout", "Shout it"], ["type", "Type it (secret)"]], mode, (m) => { mode = m; store.set("gs:mode", m); pbar.classList.toggle("hidden", m !== "type"); })),
        pbar,
        LB.field("Rounds", LB.seg([[5, "5"], [10, "10"], [15, "15"]], rounds, (v) => { rounds = v; store.set("gs:rounds", v); })),
        LB.h('<div class="spacer"></div>'),
        LB.btn("Start", "primary big", async () => {
          let players = null;
          if (mode === "type") { players = await pbar.ensure(); if (!players) return; }
          g = { players, scores: players ? players.map(() => 0) : null, round: 0 };
          ask();
        }),
      );
      root.appendChild(el);
    }

    async function ask() {
      if (g.round >= rounds) return finish();
      api.busy = () => g.round > 0;
      const q = Q[deck.next()];
      root.innerHTML = "";
      const head = `<div class="meta mono"><span>ROUND ${g.round + 1} OF ${rounds}</span><span>${isYear(q) ? "year" : q[2] || "number"}</span></div>`;
      if (mode === "shout") {
        const el = LB.h(`<div class="stack">${head}<div class="card fill center"><span class="label">Everyone guess out loud</span><p class="big"></p></div><button class="btn primary big rv">Reveal the answer</button></div>`);
        el.querySelector(".big").textContent = q[0];
        el.querySelector(".rv").onclick = () => reveal(q, null);
        root.appendChild(el);
        return;
      }
      const guesses = [];
      for (let i = 0; i < g.players.length; i++) {
        await LB.pass({ to: g.players[i], sub: i === 0 ? "Read the question and type your guess. Keep it secret." : "Your turn to guess. No peeking at the last one.", button: "I'm ready" });
        if (!S.alive) return;
        const v = await guessScreen(q, g.players[i], head);
        if (!S.alive) return;
        guesses.push(v);
      }
      reveal(q, guesses);
    }

    function guessScreen(q, name, head) {
      return new Promise((resolve) => {
        root.innerHTML = "";
        const el = LB.h(`<div class="stack">${head}
          <div class="card"><span class="label"></span><p class="big" style="font-size:clamp(22px,6vw,28px)"></p></div>
          <input class="input gs-input" inputmode="decimal" autocomplete="off" enterkeyhint="done" aria-label="Your guess">
          <p class="muted small center unit" style="margin:0"></p>
          <button class="btn primary big lock">Lock it in</button>
        </div>`);
        el.querySelector(".label").textContent = `${name}'s guess`;
        el.querySelector(".big").textContent = q[0];
        el.querySelector(".unit").textContent = q[2] ? `in ${q[2]}` : "";
        const inp = el.querySelector("input");
        inp.placeholder = isYear(q) ? "e.g. 1950" : "your number";
        const lock = () => {
          const v = parse(inp.value);
          if (v == null || !isFinite(v)) { LB.toast("Type a number"); inp.focus(); return; }
          LB.sfx.tap(); inp.blur(); resolve(v);
        };
        el.querySelector(".lock").onclick = lock;
        inp.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); lock(); } };
        root.appendChild(el);
        setTimeout(() => inp.focus(), 60);
      });
    }

    function reveal(q, guesses) {
      root.innerHTML = "";
      const [, ans, unit, approx] = q;
      const el = LB.h(`<div class="stack">
        <div class="card center"><span class="label">The answer</span><p class="gs-ans pop"></p><span class="gs-unit"></span><p class="muted small qtext" style="margin:4px 0 0"></p></div>
        <div class="rows stack" style="gap:6px"></div>
        <div class="spacer"></div>
        <button class="btn primary big nx"></button>
        <button class="btn end">End game</button>
      </div>`);
      el.querySelector(".gs-ans").textContent = (approx ? "≈ " : "") + fmt(ans, isYear(q));
      el.querySelector(".gs-unit").textContent = isYear(q) ? "" : unit;
      el.querySelector(".qtext").textContent = q[0];
      if (guesses) {
        const rows = guesses.map((v, i) => ({ i, v, d: Math.abs(v - ans) })).sort((a, b) => a.d - b.d);
        const best = rows[0].d;
        const tol = approx ? Math.abs(ans) * 0.005 : 0;
        rows.forEach((r) => {
          const win = r.d === best;
          if (win) g.scores[r.i] += r.d <= tol ? 2 : 1;
          const row = LB.h(`<div class="gs-row${win ? " win" : ""}"><span class="n"></span><span class="g"></span><span class="d"></span></div>`);
          row.querySelector(".n").textContent = (win ? (r.d <= tol ? "🎯 " : "👑 ") : "") + g.players[r.i];
          row.querySelector(".g").textContent = fmt(r.v, isYear(q));
          row.querySelector(".d").textContent = r.d === 0 ? "exact" : `off ${fmt(+r.d.toFixed(3))}`;
          el.querySelector(".rows").appendChild(row);
        });
      }
      g.round += 1;
      const nx = el.querySelector(".nx");
      nx.textContent = g.round >= rounds ? "Final scores" : "Next question →";
      nx.onclick = ask;
      el.querySelector(".end").onclick = async () => { if (await LB.confirm("End this game?", { yes: "End game" })) finish(); };
      LB.sfx.good();
      root.appendChild(el);
    }

    function finish() {
      api.busy = () => false;
      root.innerHTML = "";
      const el = LB.h('<div class="stack"></div>');
      if (g.scores) {
        const rows = g.players.map((name, i) => ({ name, score: g.scores[i] })).sort((a, b) => b.score - a.score);
        const top = rows[0].score;
        const c = LB.h('<div class="card center pop"><span class="label">Winner</span><p class="big"></p></div>');
        c.querySelector(".big").textContent = top ? rows.filter((r) => r.score === top).map((r) => r.name).join(" & ") : "Nobody scored";
        el.append(c, LB.scoreboard(rows));
      } else {
        el.append(LB.h(`<div class="card center pop"><span class="label">Done</span><p class="big">${g.round} questions</p><p class="muted" style="margin:0">Whoever was closest the most times wins bragging rights.</p></div>`));
      }
      el.append(LB.h('<div class="spacer"></div>'), LB.btn("Play again", "primary big", () => { g = { players: g.players, scores: g.players ? g.players.map(() => 0) : null, round: 0 }; ask(); }), LB.btn("Change setup", "", setup));
      LB.sfx.end();
      root.appendChild(el);
    }

    setup();
  },
});
})();
