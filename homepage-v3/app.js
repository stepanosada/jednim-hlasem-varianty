/* Jedním hlasem – homepage v3 (prototyp ke schválení, ne finální web). */
(() => {
  "use strict";
  const { A, $, nb, date, firstSentence, TOPICS, card } = window.JH;

  const used = new Set();
  const pick = (fn, n = 1) => {
    const out = A.filter((a) => a.img && !used.has(a.slug) && !/deník dagmar/i.test(a.title) && fn(a)).slice(0, n);
    out.forEach((a) => used.add(a.slug));
    return out;
  };

  // ---------- Aktuality (ukázka) ----------
  const NEWS = [
    ["10:40", "Dnes", "Redakce připravuje přehled reakcí českých politiků na dění v Gaze"],
    ["16:05", "Včera", "Nová evropská zpráva o antisemitských incidentech na univerzitách"],
    ["09:12", "Včera", "Proč titulek „Izrael útočí“ říká jen půlku příběhu"],
    ["14:30", "17. listopadu", "V Praze proběhne debata o česko-izraelských vztazích, vstup volný"],
    ["20:15", "16. listopadu", "Na sítích koluje sestřih videa vytržený z kontextu"],
  ];
  $("news").innerHTML = NEWS.map(([h, d, t]) => `
    <li><a href="#"><span class="news__time"><b>${h}</b>${d}</span><span class="news__title">${nb(t)}</span></a></li>`).join("");

  // ---------- Mediální pitva ----------
  const pitva = A.filter((a) => a.tag === "Média a instituce" && a.img).slice(0, 4);
  pitva.forEach((a) => used.add(a.slug));
  $("pitva").innerHTML = pitva.map((a) => `
    <li><a href="clanek.html?slug=${a.slug}">
      <h3>${nb(a.title)}</h3><p>${nb(firstSentence(a.perex))}</p>
    </a></li>`).join("");

  // ---------- Doporučujeme: jeden hlavní + dva menší ----------
  const rec = pick((a) => a.rec, 3);
  $("rec").innerHTML = card(rec[0], "lead") + `<div class="rec__side">${rec.slice(1).map((a) => card(a, "small")).join("")}</div>`;

  // ---------- Rubriky ----------
  const RUBRIKY = [
    { name: "Češi a Izrael", more: "Více z rubriky", fn: (a) => a.cat === "cesi" },
    { name: "Studie a analýzy", more: "Více studií", fn: (a) => a.cat === "studie" },
    { name: "Tváře Izraele", more: "Více z rubriky", fn: (a) => a.cat === "tvare" },
    { name: "Nejnovější", more: "Archiv článků", fn: () => true },
  ];
  $("rubriky").innerHTML = RUBRIKY.map((r) => `
    <div class="sec">
      <div class="sec-head"><h2>${r.name}</h2><a href="#" class="more">${r.more}</a></div>
      ${pick(r.fn, 1).map((a) => card(a, "mid")).join("")}
    </div>`).join("");

  // ---------- Témata ----------
  $("topics").innerHTML = TOPICS.map((t) => `<a class="topic" href="#"><i class="ph ph-${t.icon}" aria-hidden="true"></i><span>${t.name}</span></a>`).join("");

  // ---------- Deník Dagmar Langové (nejnovější díl) ----------
  const den = A.find((a) => /deník dagmar/i.test(a.title));
  if (den) {
    $("denik-title").textContent = firstSentence(den.perex).replace(/\.$/, "");
    $("denik-date").textContent = date(den.date);
  }
})();
