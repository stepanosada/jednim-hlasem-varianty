/* Jedním hlasem – návrh homepage v3 (prototyp ke schválení, ne finální web). */
(() => {
  "use strict";
  const A = window.JH_ARTICLES || [];
  const $ = (id) => document.getElementById(id);
  const ART = "https://jednimhlasem.framer.website/clanky/";

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  // Česká sazba: jednopísmenné předložky a spojky nezůstávají na konci řádku.
  const nb = (s) => esc(s).replace(/(^|[\s(„])([KkSsVvZzOoUuAaIi]) /g, "$1$2 ").replace(/(\d)\. (?=\d)/g, "$1. ").replace(/ ([–—]) /g, " $1 ");
  const MONTHS = ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"];
  const date = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${d}. ${MONTHS[m - 1]} ${y}`; };
  const img = (a, w) => `${a.img}?scale-down-to=${w}`;
  const author = (a) => (a.author === "Redakce JednímHlasem" ? "Redakce" : a.author);
  const firstSentence = (s) => s.split(/(?<=[.?!])\s/)[0];

  // 12 stálých témat podle Míny. Přiřazení článků je zatím odhad podle klíčových slov,
  // ve Frameru ho nahradí ruční výběr redakce.
  const TOPICS = [
    { id: "historie", name: "Historie", icon: "book-open" },
    { id: "izrael", name: "Izrael – politika a společnost", icon: "bank" },
    { id: "zidovsky-svet", name: "Židovský svět", icon: "star-of-david" },
    { id: "bezpecnost", name: "Bezpečnost a terorismus", icon: "shield-check" },
    { id: "lide", name: "Lidé a příběhy", icon: "users-three" },
    { id: "media", name: "Média a instituce", icon: "monitor" },
    { id: "cesko", name: "Česko", icon: "map-trifold" },
    { id: "antisemitismus", name: "Antisemitismus", icon: "warning" },
    { id: "sionismus", name: "Sionismus", icon: "flag-banner" },
    { id: "7-rijen", name: "7. říjen", icon: "calendar-x" },
    { id: "konflikt", name: "Arabsko-izraelský konflikt", icon: "sword" },
    { id: "veda", name: "Věda a inovace", icon: "flask" },
  ];
  const T = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
  const topicOf = (a) => {
    const s = `${a.title} ${a.perex}`.toLowerCase();
    if (a.cat === "cesi" || /česk|praž|třebíč|pardubic|masaryk/.test(s)) return T.cesko;
    if (/7\. říj|rukojm|masakr/.test(s)) return T["7-rijen"];
    if (/technolog|věd|nobel|medicín|klimat|\bai\b|technion/.test(s)) return T.veda;
    if (a.tag === "Média a instituce" || /médi|osn|bbc|wikipedi|amnesty|novinář/.test(s)) return T.media;
    if (a.tag === "Antisemitismus" || /antisemit|holokaust|pogrom/.test(s)) return T.antisemitismus;
    if (/sionis/.test(s)) return T.sionismus;
    if (/nakb|uprchl|palestin|gaz|arab/.test(s)) return T.konflikt;
    if (a.cat === "tvare" || a.tag === "Hlasy a příběhy") return T.lide;
    if (a.tag === "Bezpečnost a ideologie" || /teror|armád|idf/.test(s)) return T.bezpecnost;
    if (/19\d\d|dějin|histori/.test(s)) return T.historie;
    if (/židov|chanuk|menor/.test(s)) return T["zidovsky-svet"];
    return T.izrael;
  };

  const used = new Set();
  const pick = (fn, n = 1) => {
    const out = A.filter((a) => a.img && !used.has(a.slug) && !/deník dagmar/i.test(a.title) && fn(a)).slice(0, n);
    out.forEach((a) => used.add(a.slug));
    return out;
  };

  // Ikona tématu sedí v rohu fotky jako zářez – stejný tvar jako ocásek značky.
  const card = (a, size) => {
    const t = topicOf(a);
    const w = size === "lead" ? 1200 : 800;
    return `
    <article class="card card--${size}">
      <a href="${ART}${a.slug}" target="_blank" rel="noopener">
        <span class="card__img"><img src="${img(a, w)}" alt="" loading="lazy">
          <span class="card__topic" title="${esc(t.name)}"><i class="ph ph-${t.icon}" aria-hidden="true"></i></span></span>
        <span class="card__body">
          <span class="card__kicker">${t.name}</span>
          <h3 class="card__title">${nb(a.title)}</h3>
          ${size !== "small" ? `<p class="card__perex">${nb(a.perex)}</p>` : ""}
          <span class="card__meta"><span>${esc(author(a))}</span><time datetime="${a.date}">${date(a.date)}</time></span>
        </span>
      </a>
    </article>`;
  };

  // ---------- Hlavička ----------
  const NAV = [
    { label: "Články", sub: ["Nejnovější", "Doporučujeme", "Češi a Izrael", "Studie a analýzy", "Tváře Izraele", "Mediální pitva"] },
    { label: "Témata", sub: TOPICS.map((t) => [t.name, t.icon]), wide: true },
    { label: "Antisemitismus", sub: ["Co je antisemitismus", "Proměny v čase", "Nový antisemitismus", "Kritika, nebo nenávist?"] },
    { label: "O nás" },
    { label: "Zapojte se" },
  ];
  $("hdr").innerHTML = `
    <div class="hdr__bar"><div class="hdr__in">
      <a class="hdr__logo" href="#" aria-label="Jedním hlasem – úvod"><img src="../homepage-v2/img/logo.png" alt="Jedním hlasem"></a>
      <label class="search search--bar"><input type="search" placeholder="Hledat články" aria-label="Hledat články"><i class="ph ph-magnifying-glass" aria-hidden="true"></i></label>
      <a class="pill roll" href="#">Podpořte nás</a>
      <a class="pill pill--red" href="#">Nahlásit incident</a>
      <button class="burger" id="burger" aria-label="Otevřít menu" aria-expanded="false"><i class="ph ph-list"></i></button>
    </div></div>
    <nav class="hdr__nav" aria-label="Hlavní"><div class="hdr__in">
      <ul class="menu">${NAV.map((n) => `
        <li class="${n.sub ? "has-sub" : ""}">
          <a href="#">${n.label}${n.sub ? ' <i class="ph ph-caret-down" aria-hidden="true"></i>' : ""}</a>
          ${n.sub ? `<div class="sub${n.wide ? " sub--wide" : ""}">${n.sub.map((s) => (Array.isArray(s) ? `<a href="#"><i class="ph ph-${s[1]}" aria-hidden="true"></i>${s[0]}</a>` : `<a href="#">${s}</a>`)).join("")}</div>` : ""}
        </li>`).join("")}
      </ul>
      <a class="pill pill--red pill--menu" href="#">Nahlásit incident</a>
      <label class="search search--menu"><input type="search" placeholder="Hledat články" aria-label="Hledat články"><i class="ph ph-magnifying-glass" aria-hidden="true"></i></label>
    </div></nav>`;
  // Bílá tlačítka: text se při najetí přetočí jako kostka (stejně jako na stepanosada.com).
  document.querySelectorAll(".roll").forEach((el) => {
    const t = el.textContent.trim();
    el.setAttribute("aria-label", t);
    el.innerHTML = `<span class="roll__in" aria-hidden="true"><span>${t}</span><span>${t}</span></span>`;
  });

  $("burger").addEventListener("click", (e) => {
    const open = document.body.classList.toggle("nav-open");
    e.currentTarget.setAttribute("aria-expanded", open);
    e.currentTarget.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
    e.currentTarget.innerHTML = `<i class="ph ph-${open ? "x" : "list"}"></i>`;
  });

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
    <li><a href="${ART}${a.slug}" target="_blank" rel="noopener">
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

  // ---------- Patička ----------
  const FLINKS = ["Články", "Témata", "Antisemitismus", "O nás", "Nahlásit incident", "Gaza GenoLIE", "Podpořte nás", "Napište nám"];
  $("ftr").innerHTML = `
    <div class="wrap ftr__in">
      <div class="ftr__row">
        <img src="../homepage-v2/img/logo-footer.png" alt="Jedním hlasem" class="ftr__logo">
        <nav class="ftr__links" aria-label="Patička">${FLINKS.map((l) => `<a href="#">${l}</a>`).join("")}</nav>
      </div>
      <div class="ftr__bottom">
        <span>© 2026 Jedním hlasem</span>
        <span class="ftr__legal"><a href="https://jednimhlasem.framer.website/podminky">Podmínky používání</a><a href="#">Nastavení cookies</a></span>
      </div>
    </div>`;
})();
