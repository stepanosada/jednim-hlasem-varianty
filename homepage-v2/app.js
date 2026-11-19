/* Jedním hlasem – návrh nové homepage (prototyp ke schválení, ne finální web). */
(() => {
  "use strict";
  const A = window.JH_ARTICLES || [];
  const $ = (id) => document.getElementById(id);

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  // Česká sazba: jednopísmenné předložky a spojky nezůstávají na konci řádku.
  const nb = (s) => esc(s).replace(/(^|[\s(„])([KkSsVvZzOoUuAaIi]) /g, "$1$2 ").replace(/(\d)\. (?=\d)/g, "$1. ").replace(/ ([–—]) /g, " $1 ");
  const date = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${d}. ${m}. ${y}`; };
  const img = (a, w = 1024) => (a.img ? `${a.img}?scale-down-to=${w}` : "");

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

  const badge = (a) => { const t = topicOf(a); return `<span class="badge" title="${esc(t.name)}"><i class="ph ph-${t.icon}"></i></span>`; };
  const card = (a, size) => `
    <a class="card card--${size}" href="https://jednimhlasem.framer.website/clanky/${a.slug}" target="_blank" rel="noopener">
      <span class="card__img"><img src="${img(a, size === "big" ? 800 : 1024)}" alt="" loading="lazy">${badge(a)}</span>
      <span class="card__body">
        <strong class="card__title">${nb(a.title)}</strong>
        ${size === "big" ? `<span class="card__perex">${nb(a.perex)}</span>` : ""}
      </span>
    </a>`;

  // ---------- Hlavička ----------
  const NAV = [
    { label: "Články", sub: ["Nejnovější", "Doporučujeme", "Češi a Izrael", "Studie a analýzy", "Tváře Izraele", "Mediální pitva"] },
    { label: "Témata", sub: TOPICS.map((t) => t.name), wide: true },
    { label: "Antisemitismus", sub: ["Co je antisemitismus", "Proměny v čase", "Nový antisemitismus", "Kritika, nebo nenávist?"] },
    { label: "O nás" },
    { label: "Zapojte se" },
  ];
  $("hdr").innerHTML = `
    <div class="hdr__bar"><div class="hdr__in">
      <a class="hdr__logo" href="#" aria-label="Jedním hlasem"><img src="img/logo.png" alt="Jedním hlasem"></a>
      <label class="search search--bar"><input type="search" placeholder="Vyhledat" aria-label="Vyhledat"><i class="ph ph-magnifying-glass"></i></label>
      <a class="pill" href="#">Podpořte nás</a>
      <button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><i class="ph ph-list"></i></button>
    </div></div>
    <nav class="hdr__nav" id="nav"><div class="hdr__in">
      <ul class="menu">${NAV.map((n) => `
        <li class="${n.sub ? "has-sub" : ""}">
          <a href="#">${n.label}${n.sub ? ' <i class="ph-bold ph-caret-down"></i>' : ""}</a>
          ${n.sub ? `<div class="sub${n.wide ? " sub--wide" : ""}">${n.sub.map((s) => `<a href="#">${s}</a>`).join("")}</div>` : ""}
        </li>`).join("")}
      </ul>
      <label class="search search--menu"><input type="search" placeholder="Vyhledat" aria-label="Vyhledat"><i class="ph ph-magnifying-glass"></i></label>
    </div></nav>`;
  $("burger").addEventListener("click", (e) => {
    const open = document.body.classList.toggle("nav-open");
    e.currentTarget.setAttribute("aria-expanded", open);
    e.currentTarget.innerHTML = `<i class="ph ph-${open ? "x" : "list"}"></i>`;
  });

  // ---------- Aktuality (ukázka) ----------
  const NEWS = [
    ["Redakce připravuje přehled reakcí českých politiků na dění v Gaze", "19. 11. 2026", "10:40"],
    ["Krátce: nová evropská zpráva o antisemitských incidentech na univerzitách", "18. 11. 2026", "16:05"],
    ["Komentář dne: proč titulek „Izrael útočí“ říká jen půlku příběhu", "18. 11. 2026", "09:12"],
    ["V Praze proběhne debata o česko-izraelských vztazích, vstup volný", "17. 11. 2026", "14:30"],
    ["Upozornění: na sítích koluje sestřih videa vytržený z kontextu", "16. 11. 2026", "20:15"],
  ];
  $("news").innerHTML = NEWS.map(([t, d, h]) => `<li><a href="#"><strong>${nb(t)}</strong><span>${d} · ${h}</span></a></li>`).join("");

  // ---------- Mediální pitva ----------
  const pitva = A.filter((a) => a.tag === "Média a instituce" && a.img).slice(0, 4);
  pitva.forEach((a) => used.add(a.slug));
  $("pitva").innerHTML = pitva.map((a) => `
    <li><a href="https://jednimhlasem.framer.website/clanky/${a.slug}" target="_blank" rel="noopener">
      <strong>${nb(a.title)}</strong><span>${nb(a.perex.split(/(?<=[.?!])\s/)[0])}</span>
    </a></li>`).join("");

  // ---------- Doporučujeme + rubriky ----------
  $("rec").innerHTML = pick((a) => a.rec, 3).map((a) => card(a, "big")).join("");
  const RUBRIKY = [
    { name: "Češi a Izrael", more: "Více z rubriky", fn: (a) => a.cat === "cesi" },
    { name: "Studie a analýzy", more: "Více ze studií", fn: (a) => a.cat === "studie" },
    { name: "Tváře Izraele", more: "Více z rubriky", fn: (a) => a.cat === "tvare" },
    { name: "Nejnovější články", more: "Všechny články", fn: () => true },
  ];
  $("rubriky").innerHTML = RUBRIKY.map((r) => `
    <div class="block">
      <div class="head head--sm"><h2>${r.name}</h2><a href="#" class="more">${r.more} <i class="ph-bold ph-arrow-right"></i></a></div>
      ${pick(r.fn, 1).map((a) => card(a, "wide")).join("")}
    </div>`).join("");

  // ---------- Témata ----------
  $("topics").innerHTML = TOPICS.map((t) => `<a class="topic" href="#"><i class="ph ph-${t.icon}"></i><span>${t.name}</span></a>`).join("");

  // ---------- Deník Dagmar Langové (nejnovější díl) ----------
  const den = A.find((a) => /deník dagmar/i.test(a.title));
  if (den) {
    $("denik-title").textContent = den.perex.split(/(?<=[.?!])\s/)[0].replace(/\.$/, "");
    $("denik-date").textContent = date(den.date);
  }

  // ---------- Patička ----------
  const FLINKS = ["Články", "Témata", "Antisemitismus", "O nás", "Nahlásit incident", "Gaza GenoLIE", "Podpořte nás", "Napište nám"];
  $("ftr").innerHTML = `
    <div class="wrap ftr__in">
      <div class="ftr__row">
        <img src="img/logo-footer.png" alt="Jedním hlasem" class="ftr__logo">
        <nav class="ftr__links">${FLINKS.map((l) => `<a href="#">${l}</a>`).join('<span aria-hidden="true">|</span>')}</nav>
      </div>
      <div class="ftr__bottom">
        <span>© 2026 Jedním hlasem</span>
        <span class="ftr__legal"><a href="https://jednimhlasem.framer.website/podminky">Podmínky používání</a><a href="#">Nastavení cookies</a></span>
      </div>
    </div>`;
})();
