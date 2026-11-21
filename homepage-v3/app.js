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
    ["2026-11-21", "Redakce připravuje přehled reakcí českých politiků na dění v Gaze"],
    ["2026-11-20", "Nová evropská zpráva o antisemitských incidentech na univerzitách"],
    ["2026-11-20", "Proč titulek „Izrael útočí“ říká jen půlku příběhu"],
    ["2026-11-17", "V Praze proběhne debata o česko-izraelských vztazích, vstup volný"],
    ["2026-11-16", "Na sítích koluje sestřih videa vytržený z kontextu"],
  ];
  $("news").innerHTML = NEWS.map(([d, t]) => `
    <li><a href="#"><time class="news__time" datetime="${d}">${+d.slice(8)}. ${+d.slice(5, 7)}.</time><span class="news__title">${nb(t)}</span></a></li>`).join("");

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
    { name: "Češi a Izrael", fn: (a) => a.cat === "cesi" },
    { name: "Studie a analýzy", fn: (a) => a.cat === "studie" },
    { name: "Tváře Izraele", fn: (a) => a.cat === "tvare" },
    { name: "Nejnovější", fn: () => true },
  ];
  $("rubriky").innerHTML = RUBRIKY.map((r) => `
    <div class="sec">
      <div class="sec-head"><h2>${r.name}</h2></div>
      ${pick(r.fn, 1).map((a) => card(a, "mid")).join("")}
      <div class="sec-foot"><a href="#" class="more"><span>Všechny články</span><i class="ph ph-arrow-right" aria-hidden="true"></i></a></div>
    </div>`).join("");

  // ---------- Témata ----------
  $("topics").innerHTML = TOPICS.map((t) => `<a class="topic" href="#"><i class="ph ph-${t.icon}" aria-hidden="true"></i><span>${t.name}</span></a>`).join("");

  // ---------- Gaza GenoLIE: střídání hlášek z puzzle na gazagenolie.com/cs ----------
  const GG = [
    "Obvinění z genocidy začala 8. října 2023",
    "Překrucování právního rámce „genocidy“",
    "Válka proti Hamásu, nikoli proti Palestincům",
    "Krevní pověra namířená proti všem Židům",
    "Podvod s „válkou proti novinářům“",
    "Strategie Hamásu založená na lidských štítech",
    "Využívání nemocných dětí k vykonstruování hladomoru",
    "Nové obvinění, stará kampaň",
  ];
  const rot = $("gg-rot");
  rot.innerHTML = GG.map((t, i) => `<span${i ? ' aria-hidden="true"' : ' class="is-on"'}>${nb(t)}</span>`).join("");
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const items = [...rot.children];
    let cur = 0;
    setInterval(() => {
      items[cur].classList.remove("is-on"); items[cur].setAttribute("aria-hidden", "true");
      cur = (cur + 1) % items.length;
      items[cur].classList.add("is-on"); items[cur].removeAttribute("aria-hidden");
    }, 3000);
  }

  // ---------- Deník Dagmar Langové (nejnovější díl) ----------
  const den = A.find((a) => /deník dagmar/i.test(a.title));
  if (den) {
    $("denik-title").textContent = firstSentence(den.perex).replace(/\.$/, "");
    $("denik-date").textContent = date(den.date);
  }
})();
