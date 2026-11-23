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
  const author = (a) => (/^Redakce/.test(a.author) ? "Redakce JH" : a.author);
  const firstSentence = (s) => s.split(/(?<=[.?!])\s/)[0];

  // 12 stálých témat a jejich klíčová slova podle Míny (Web témata.docx, 19. 11. 2026).
  // Přiřazení článků je v prototypu automatický odhad podle klíčových slov v titulku a perexu,
  // ve Frameru ho nahradí ruční výběr redakce.
  const TOPICS = [
    { id: "historie", name: "Historie", icon: "book-open", kw: /dějin|šoa|holokaust|holocaust|vznik izraele|vznik státu|židé v arabských|pogrom|histori|mýt|stalin|sovět|19[0-4]\d/ },
    { id: "izrael", name: "Izrael – politika a\u00a0společnost", icon: "jh-volby", kw: /izraelsk[áéý] politik|volb|kneset|netanjah|diplomac|zahraniční vztah|vlád|společnost/ },
    { id: "zide-tradice", name: "Židé a\u00a0tradice", icon: "jh-menora", kw: /židovsk[áéý] identit|diaspor|komunit|židovsk[ýé] život|kultur|judaism|chanuk|šabat|svát|skaut|menor|tradic/ },
    { id: "bezpecnost", name: "Bezpečnost a\u00a0terorismus", icon: "shield-check", kw: /\bidf\b|armád|hamás|hizballáh|írán|muslimské bratrstvo|islamis|teror|atentát|voják/ },
    { id: "lide", name: "Lidé a\u00a0příběhy", icon: "users-three", kw: /osobnost|rozhovor|svědectví|odvah|spojen|osobní|příběh|tváře izraele/ },
    { id: "media", name: "Média a\u00a0instituce", icon: "monitor", kw: /medi|médi|zaujat|fact|osn\b|unrwa|ngo|lidskoprávní|amnesty|lékaři bez hranic|wikipedi|\bai\b|bbc|novinář|titulek/ },
    { id: "cesko", name: "Česko", icon: "castle-turret", kw: /česk|čech|praž|praha|třebíč|pardubic|masaryk|smetan/ },
    { id: "antisemitismus", name: "Antisemitismus", icon: "jh-hvezda", kw: /antisemit|antisionis|\bbds\b|incident|delegitimiz|démoniz|nenávist|bojkot|genocid|univerzit/ },
    { id: "sionismus", name: "Sionismus", icon: "star-of-david", kw: /sionis|sebeurčení/ },
    { id: "7-rijen", name: "7. říjen", icon: "heart-break", kw: /7\. říj|masakr|přeživ|rukojm/ },
    { id: "konflikt", name: "Arabsko-izraelský konflikt", icon: "jh-mece", kw: /gaz|západní břeh|judej|palestin|nakb|uprchl|mírov|abrahám|válk|příměří|anex/ },
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

  // Oficiální loga sítí (Simple Icons, CC0), barvu berou z currentColor.
  const BRAND = {
    facebook: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
    x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
    instagram: "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
    whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  };
  const brand = (n) => `<svg class="brand" viewBox="0 0 24 24" aria-hidden="true"><path d="${BRAND[n]}"/></svg>`;
  const SOCIAL = [["facebook", "Facebook", "https://www.facebook.com/JednimHlasem"], ["x", "X", "https://x.com/"], ["instagram", "Instagram", "https://www.instagram.com/"]];
  document.querySelectorAll(".follow__icons").forEach((el) => {
    el.innerHTML = SOCIAL.map(([n, l, h]) => `<a href="${h}" target="_blank" rel="noopener" aria-label="${l}">${brand(n)}</a>`).join("");
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

  return { A, $, esc, nb, date, img, author, firstSentence, TOPICS, T, topicOf, topicsOf, card, brand };
})();
