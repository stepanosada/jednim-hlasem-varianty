/* Jedním hlasem – sdílené části prototypu v3 (hlavička, patička, karty, témata). */
window.JH = (() => {
  "use strict";
  const A = window.JH_ARTICLES || [];
  const $ = (id) => document.getElementById(id);

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  // Česká sazba: jednopísmenné předložky a spojky nezůstávají na konci řádku.
  const nb = (s) => esc(s).replace(/(^|[\s(„])([KkSsVvZzOoUuAaIi]) /g, "$1$2 ").replace(/(\d)\. (?=\d)/g, "$1. ").replace(/ ([–—]) /g, " $1 ");
  const MONTHS = ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"];
  const date = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${d}. ${MONTHS[m - 1]} ${y}`; };
  // Lokální fotky: ořezaná kopie (bílý rámeček v originále) a fotky, které Mína dodala 20. 11. 2026.
  // Ve Frameru je nahradí obrázky v CMS.
  const LOCAL = {
    "hruzy-7-rijna-prekrocily-vse-co-si-dokazete-predstavit": "img/hruzy-7-rijna.jpg",
    ...Object.fromEntries(["dekolonialismus-a-novy-antisemitismus", "gaza-proc-samotna-rekonstrukce-nestaci", "genocida-amnesty-ji-zjistila",
      "iran-slabne-region-se-meni-co-prijde-dal", "jeste-nehori-ale-verejny-prostor-uz-doutna", "kdyz-genocida-nestaci",
      "krive-obvineni-z-genocidy-demonizace-opravnene-obrany", "lekari-bez-hranic-a-iluze-neutrality", "make-bethlehem-christian-again",
      "nova-palestinska-ustava-legitimizace-vecneho-konfliktu-a-nenavisti", "izrael-a-ochrana-zvirat", "od-arabskeho-bojkotu-k-bds",
      "paradox-moderniho-bojiste", "primeri-jako-iluze", "uci-se-cist-psat-a-nenavidet", "vltava-a-hatikva"].map((s) => [s, `img/clanky/${s}.jpg`])),
  };
  A.forEach((a) => { if (LOCAL[a.slug]) a.img = LOCAL[a.slug]; });
  const img = (a, w) => (LOCAL[a.slug] || `${a.img}?scale-down-to=${w}`);
  const author = (a) => (a.author === "Redakce JednímHlasem" ? "Redakce" : a.author);
  const firstSentence = (s) => s.split(/(?<=[.?!])\s/)[0];

  // 12 stálých témat a jejich klíčová slova podle Míny (Web témata.docx, 19. 11. 2026).
  // Přiřazení článků je v prototypu automatický odhad podle klíčových slov v titulku a perexu,
  // ve Frameru ho nahradí ruční výběr redakce.
  const TOPICS = [
    { id: "historie", name: "Historie", icon: "book-open", kw: /dějin|šoa|holokaust|holocaust|vznik izraele|vznik státu|židé v arabských|pogrom|histori|mýt|stalin|sovět|19[0-4]\d/ },
    { id: "izrael", name: "Izrael – politika a\u00a0společnost", icon: "bank", kw: /izraelsk[áéý] politik|volb|kneset|netanjah|diplomac|zahraniční vztah|vlád|společnost/ },
    { id: "zide-tradice", name: "Židé a\u00a0tradice", icon: "star-of-david", kw: /židovsk[áéý] identit|diaspor|komunit|židovsk[ýé] život|kultur|judaism|chanuk|šabat|svát|skaut|menor|tradic/ },
    { id: "bezpecnost", name: "Bezpečnost a\u00a0terorismus", icon: "shield-check", kw: /\bidf\b|armád|hamás|hizballáh|írán|muslimské bratrstvo|islamis|teror|atentát|voják/ },
    { id: "lide", name: "Lidé a\u00a0příběhy", icon: "users-three", kw: /osobnost|rozhovor|svědectví|odvah|spojen|osobní|příběh|tváře izraele/ },
    { id: "media", name: "Média a\u00a0instituce", icon: "monitor", kw: /medi|médi|zaujat|fact|osn\b|unrwa|ngo|lidskoprávní|amnesty|lékaři bez hranic|wikipedi|\bai\b|bbc|novinář|titulek/ },
    { id: "cesko", name: "Česko", icon: "castle-turret", kw: /česk|čech|praž|praha|třebíč|pardubic|masaryk|smetan/ },
    { id: "antisemitismus", name: "Antisemitismus", icon: "warning", kw: /antisemit|antisionis|\bbds\b|incident|delegitimiz|démoniz|nenávist|bojkot|genocid|univerzit/ },
    { id: "sionismus", name: "Sionismus", icon: "flag-banner", kw: /sionis|sebeurčení/ },
    { id: "7-rijen", name: "7. říjen", icon: "calendar-x", kw: /7\. říj|masakr|přeživ|rukojm/ },
    { id: "konflikt", name: "Arabsko-izraelský konflikt", icon: "globe-hemisphere-east", kw: /gaz|západní břeh|judej|palestin|nakb|uprchl|mírov|abrahám|válk|příměří|anex/ },
    { id: "veda", name: "Věda a\u00a0inovace", icon: "flask", kw: /objev|věd|nobel|medicín|technolog|technion|inovac|výzkum|klimat/ },
  ];
  const T = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
  const count = (re, text) => (text.match(new RegExp(re.source, "g")) || []).length;
  const topicOf = (a) => {
    const title = a.title.toLowerCase(), perex = a.perex.toLowerCase();
    if (/deník dagmar/i.test(a.title)) return T.izrael;
    let best = T.izrael, top = 0;
    for (const t of TOPICS) {
      let score = 3 * count(t.kw, title) + count(t.kw, perex);
      if (t.id === "cesko" && a.cat === "cesi") score += 3;
      if (t.id === "lide" && a.cat === "tvare") score += 2;
      // Hlavní tag z dnešního CMS jako nápověda.
      if (t.id === "antisemitismus" && a.tag === "Antisemitismus") score += 2;
      if (t.id === "media" && a.tag === "Média a instituce") score += 2;
      if (score > top) { top = score; best = t; }
    }
    return best;
  };
  // Hlavní téma + až dvě vedlejší (stejné bodování, prah aspoň jedna shoda).
  const topicsOf = (a) => {
    const main = topicOf(a), title = a.title.toLowerCase(), perex = a.perex.toLowerCase();
    const rest = TOPICS.filter((t) => t !== main).map((t) => [t, 3 * count(t.kw, title) + count(t.kw, perex)])
      .filter(([, n]) => n > 0).sort((x, y) => y[1] - x[1]).slice(0, 2).map(([t]) => t);
    return [main, ...rest];
  };


  // Ikona hlavního tématu stojí u jeho názvu nad titulkem.
  const card = (a, size) => {
    const t = topicOf(a);
    const w = size === "lead" ? 1200 : 800;
    return `
    <article class="card card--${size}">
      <a href="clanek.html?slug=${a.slug}">
        <span class="card__img"><img src="${img(a, w)}" alt="" loading="lazy"></span>
        <span class="card__body">
          <span class="card__kicker"><i class="ph ph-${t.icon}" aria-hidden="true"></i>${t.name}</span>
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
      <a class="hdr__logo" href="index.html" aria-label="Jedním hlasem – úvod"><img src="../homepage-v2/img/logo.png" alt="Jedním hlasem"></a>
      <label class="search search--bar"><input type="search" placeholder="Hledat články" aria-label="Hledat články"><i class="ph ph-magnifying-glass" aria-hidden="true"></i></label>
      <a class="pill" href="#">Podpořte nás</a>
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
  $("burger").addEventListener("click", (e) => {
    const open = document.body.classList.toggle("nav-open");
    e.currentTarget.setAttribute("aria-expanded", open);
    e.currentTarget.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
    e.currentTarget.innerHTML = `<i class="ph ph-${open ? "x" : "list"}"></i>`;
  });

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

  return { A, $, esc, nb, date, img, author, firstSentence, TOPICS, T, topicOf, topicsOf, card };
})();
