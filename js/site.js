/* Jedním hlasem – sdílený skript prototypu: hlavička, patička, přepínač variant, komponenty. */
(() => {
  "use strict";
  const JH = (window.JH = window.JH || {});

  const PAGES = [
    { id: "home", href: "index.html", label: "Homepage" },
    { id: "clanky", href: "clanky.html", label: "Články" },
    { id: "clanek", href: "clanek.html", label: "Článek (šablona)" },
    { id: "autor", href: "autor.html", label: "Autor (šablona)" },
    { id: "antisemitismus", href: "antisemitismus.html", label: "Antisemitismus" },
    { id: "o-nas", href: "o-nas.html", label: "O nás" },
    { id: "podporte-nas", href: "podporte-nas.html", label: "Podpořte nás" },
    { id: "nahlasit-incident", href: "nahlasit-incident.html", label: "Nahlásit incident" },
    { id: "kontakt", href: "kontakt.html", label: "Kontakt" },
  ];
  const NAV = [
    { id: "clanky", href: "clanky.html", label: "Články", match: ["clanky", "clanek", "autor"] },
    { id: "antisemitismus", href: "antisemitismus.html", label: "Antisemitismus", match: ["antisemitismus", "nahlasit-incident"] },
    { id: "o-nas", href: "o-nas.html", label: "O nás", match: ["o-nas"] },
    { id: "zapojte", href: "o-nas.html#zapojte-se", label: "Zapojte se", match: [] },
  ];

  const ICON = {
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.88v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.4l-5-6.5L5.8 22H2.7l7.3-8.3L1.5 2H8l4.5 6 6.4-6Zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20Z"/></svg>',
    li: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
    burger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 3 4.5 6.9 4.5c2.1 0 3.6 1.1 5.1 3 1.5-1.9 3-3 5.1-3 3.9 0 6 4 4.5 7.3C19.5 16.4 12 21 12 21z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  };
  JH.ICON = ICON;

  // ---------- Pomocné funkce ----------
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  // Česká sazba: krátká slova a čísla s jednotkami nesmí zůstat na konci řádku.
  const nbsp = (s) =>
    String(s ?? "")
      .replace(/(^|[\s(„])([KkSsVvZzOoUuAaIi]|[Oo]d|[Dd]o|[Nn]a|[Pp]o|[Pp]ro|[Pp]ři|[Zz]a|[Vv]e|[Kk]e|[Ss]e|[Zz]e|[Čč]i) /g, "$1$2 ")
      .replace(/(\d)\. (?=\d)/g, "$1. ")
      .replace(/(\d) (?=Kč|%)/g, "$1 ")
      .replace(/ ([–—]) /g, " $1 ");
  const t = (s) => esc(nbsp(s));
  const fmtDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
  };
  const fmtKc = (n) => `${n.toLocaleString("cs-CZ")} Kč`;
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => [...el.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  Object.assign(JH, { esc, nbsp, t, fmtDate, fmtKc, qs, qsa, params });

  // ---------- Data ----------
  const A = JH.articles || [];
  JH.bySection = (s) => A.filter((a) => a.sections.includes(s));
  JH.byAuthor = (id) => A.filter((a) => a.author === id);
  JH.byTag = (tag) => A.filter((a) => a.tag === tag || a.tags.includes(tag));
  JH.article = (slug) => A.find((a) => a.slug === slug);
  JH.pick = (slugs) => slugs.map((s) => JH.article(s)).filter(Boolean);
  JH.authorName = (a) => (a.kind === "translation" && a.original ? a.original.name : (JH.authors[a.author] || {}).name || "Redakce");
  JH.articleUrl = (a) => `clanek.html?slug=${encodeURIComponent(a.slug)}`;
  JH.authorUrl = (id) => `autor.html?id=${encodeURIComponent(id)}`;
  JH.tagUrl = (tag) => `clanky.html?tag=${encodeURIComponent(tag)}`;
  JH.topTags = (n) => {
    const c = {};
    A.forEach((a) => a.tags.forEach((x) => (c[x] = (c[x] || 0) + 1)));
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => ({ tag: k, count: v }));
  };
  JH.SECTIONS = [
    { id: "nove", label: "Nové" },
    { id: "doporucujeme", label: "Doporučujeme" },
    { id: "cesi-a-izrael", label: "Češi a Izrael" },
    { id: "studie", label: "Studie a analýzy" },
    { id: "sloupky", label: "Sloupky" },
    { id: "vse", label: "Všechny texty" },
  ];
  JH.inSection = (id) => {
    if (id === "nove" || id === "vse") return A;
    if (id === "sloupky") return A.filter((a) => a.kind === "column");
    return JH.bySection(id);
  };

  // ---------- Komponenty ----------
  const authorBit = (a) => {
    const name = JH.authorName(a);
    const href = JH.authorUrl(a.author);
    return a.kind === "translation" ? `Překlad · <a href="${href}">${esc(name)}</a>` : `<a href="${href}">${esc(name)}</a>`;
  };
  JH.authorBit = authorBit;

  JH.card = (a, o = {}) => `
    <article class="card${o.lg ? " card--lg" : ""}${o.noImg ? " card--text" : ""}">
      ${o.noImg ? "" : `<img class="card-img" src="${a.img}" alt="" loading="lazy" decoding="async" width="960" height="540">`}
      <div class="card-meta"><a class="tag${a.kind === "column" ? " tag--gold" : ""}" href="${JH.tagUrl(a.tag)}">${esc(a.tag)}</a><span>${fmtDate(a.iso)}</span></div>
      <h3 class="card-title"><a href="${JH.articleUrl(a)}">${t(a.title)}</a></h3>
      ${o.noPerex ? "" : `<p class="card-perex">${t(a.perex)}</p>`}
      ${o.byline ? `<p class="card-by">${authorBit(a)} · ${a.min} min</p>` : ""}
    </article>`;

  JH.row = (a) => `
    <article class="row">
      <img src="${a.thumb}" alt="" loading="lazy" decoding="async" width="480" height="360">
      <div>
        <div class="meta"><a class="tag${a.kind === "column" ? " tag--gold" : ""}" href="${JH.tagUrl(a.tag)}">${esc(a.tag)}</a><span>${fmtDate(a.iso)}</span><span>${a.min} min čtení</span></div>
        <h3><a href="${JH.articleUrl(a)}">${t(a.title)}</a></h3>
        <p>${t(a.perex)}</p>
      </div>
    </article>`;

  JH.pager = (page, total, opts = {}) => {
    if (total <= 1) return "";
    const keep = [...new Set([1, total, page - 1, page, page + 1])].filter((n) => n >= 1 && n <= total).sort((x, y) => x - y);
    let nums = "";
    keep.forEach((n, i) => {
      if (i && n - keep[i - 1] > 1) nums += '<span class="gap">…</span>';
      nums += `<button type="button" class="num" data-page="${n}" ${n === page ? 'aria-current="page"' : ""}>${n}</button>`;
    });
    return `<nav class="pager" aria-label="Stránkování">
      <div class="pager-row">
        <button type="button" data-page="${page - 1}" ${page <= 1 ? "disabled" : ""}>Předchozí</button>
        ${nums}
        <button type="button" data-page="${page + 1}" ${page >= total ? "disabled" : ""}>Další</button>
      </div>
      ${opts.allHref ? `<a class="link-arrow" href="${opts.allHref}">${opts.allLabel || "Všechny texty v rubrice"}</a>` : ""}
    </nav>`;
  };

  JH.newsletter = (o = {}) => `
    <div class="newsletter${o.light ? " newsletter--light" : ""}">
      <div>
        <p class="kicker">${o.kicker || "Newsletter"}</p>
        <h2 style="margin-top:10px">${t(o.title || "Fakta místo algoritmu. Jednou týdně do e-mailu.")}</h2>
        <p>${t(o.text || "Výběr nejdůležitějších textů týdne, bez spamu. Odhlásíte se jedním klikem.")}</p>
      </div>
      <div>
        <form class="nl-form" data-newsletter>
          <label class="sr-only" for="nl-${o.id || "x"}">E-mail</label>
          <input id="nl-${o.id || "x"}" type="email" required placeholder="vas@email.cz" autocomplete="email">
          <button class="btn ${o.light ? "btn--blue" : "btn--gold"}" type="submit">Odebírat</button>
        </form>
        <p class="nl-note">Odesláním souhlasíte se zpracováním e-mailu pro zasílání newsletteru.</p>
      </div>
    </div>`;

  JH.supportStrip = (o = {}) => `
    <div class="support-strip">
      <div><h3>${t(o.title || "Nezávislý hlas drží jen čtenáři.")}</h3><p>${t(o.text || "Bez grantů a reklam. Podpořte fakta a kontext v debatě o Izraeli.")}</p></div>
      <a class="btn btn--gold" href="podporte-nas.html">Podpořte nás</a>
    </div>`;

  JH.campaign = () => `
    <div class="campaign">
      <div class="campaign-text">
        <h3>Webová stránka GenoLIE</h3>
        <p>${t("Partnerská kampaň, která krok za krokem rozebírá tvrzení o „genocidě“ v Gaze – od lidských štítů Hamásu po zkreslená čísla obětí.")}</p>
      </div>
      <a class="campaign-promo" href="https://gazagenolie.com/" target="_blank" rel="noreferrer">
        <div><b>„Obvinění začalo 8. října“</b><span>${t("Slovo genocida padlo dřív, než Izrael vstoupil do Gazy.")}</span></div>
        <div class="campaign-logo">Gaza GenoLIE</div>
      </a>
    </div>`;

  // ---------- Hlavička a patička ----------
  const page = document.body.dataset.page;
  const header = qs("#site-header");
  if (header) {
    header.outerHTML = `
    <header class="site-header" id="header">
      <a class="hdr-logo" href="index.html" aria-label="Jedním hlasem – domů">
        <img src="assets/logo-bublina-modra.png" alt="" width="720" height="562"><span>PRO IZRAEL</span>
      </a>
      <div class="hdr-bar"><div class="container">
        <a class="btn btn--gold hdr-donate" href="podporte-nas.html" ${page === "podporte-nas" ? 'aria-current="page"' : ""}>Podpořte nás</a>
        <button class="hdr-burger" type="button" aria-label="Otevřít menu" aria-expanded="false" id="burger">${ICON.burger}</button>
      </div></div>
      <nav class="hdr-nav" aria-label="Hlavní navigace"><div class="container">
        <ul>${NAV.map((n) => `<li><a class="nav-link" href="${n.href}" ${n.match.includes(page) ? 'aria-current="page"' : ""}>${n.label}</a></li>`).join("")}</ul>
        <div class="hdr-tools">
          <form class="hdr-search" action="clanky.html" role="search"><label class="sr-only" for="hdr-q">Hledat články</label><input id="hdr-q" name="q" placeholder="Hledat články" autocomplete="off"></form>
          <div class="social"><a href="#" aria-label="Facebook">${ICON.fb}</a><a href="#" aria-label="Instagram">${ICON.ig}</a><a href="#" aria-label="X">${ICON.x}</a></div>
        </div>
      </div></nav>
    </header>`;
  }
  const footer = qs("#site-footer");
  if (footer) {
    const tail = document.body.dataset.footerTail || "white";
    footer.outerHTML = `
    <footer class="site-footer tail" style="--tail-color: var(--${tail})">
      <div class="container ftr-grid">
        <a class="ftr-brand" href="index.html" aria-label="Jedním hlasem – domů"><img src="assets/logo-radek-white.png" alt="" width="880" height="229"><span>PRO IZRAEL</span></a>
        <nav class="ftr-links" aria-label="Patička">
          <a href="clanky.html">Články</a><a href="o-nas.html">O nás</a><a href="nahlasit-incident.html">Nahlásit incident</a><a href="https://gazagenolie.com/" target="_blank" rel="noreferrer">Gaza GenoLIE</a><a href="podporte-nas.html">Podpořte nás</a><a href="kontakt.html">Napište nám</a>
        </nav>
        <div class="social"><a href="#" aria-label="LinkedIn">${ICON.li}</a><a href="#" aria-label="Instagram">${ICON.ig}</a><a href="#" aria-label="X">${ICON.x}</a></div>
      </div>
      <div class="container ftr-bottom"><span>© 2026 Jedním hlasem</span><a href="#">Ochrana osobních údajů</a></div>
    </footer>`;
  }

  const hdr = qs("#header");
  const burger = qs("#burger");
  burger?.addEventListener("click", () => {
    const open = hdr.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
    burger.innerHTML = open ? ICON.close : ICON.burger;
  });

  // ---------- Toast, kopírování, newsletter ----------
  const toastEl = document.createElement("div");
  toastEl.className = "toast";
  toastEl.setAttribute("role", "status");
  document.body.append(toastEl);
  let toastTimer;
  JH.toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  };
  document.addEventListener("submit", (e) => {
    if (e.target.matches("[data-newsletter]")) {
      e.preventDefault();
      e.target.reset();
      JH.toast("Děkujeme! Potvrzení přišlo na váš e-mail (ukázka).");
    }
  });
  document.addEventListener("click", async (e) => {
    const c = e.target.closest("[data-copy]");
    if (!c) return;
    try {
      await navigator.clipboard.writeText(c.dataset.copy);
      JH.toast("Zkopírováno");
    } catch {
      JH.toast("Kopírování se nepovedlo");
    }
  });
  JH.share = async (title) => {
    const url = location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        JH.toast("Odkaz zkopírován");
      }
    } catch {
      /* zrušeno */
    }
  };

  // ---------- Přepínač variant + menu stránek ----------
  const variants = qsa(".variant");
  const proto = document.createElement("div");
  proto.className = "proto";
  const here = PAGES.find((p) => p.id === page);
  proto.innerHTML = `
    <div class="proto-menu" id="proto-menu"><small>Stránky prototypu</small>${PAGES.map((p) => `<a href="${p.href}" ${p.id === page ? 'aria-current="page"' : ""}>${p.label}</a>`).join("")}</div>
    <div class="proto-desc" id="proto-desc" aria-live="polite"></div>
    <div class="proto-bar" role="group" aria-label="Přepnout variantu">
      <span>${here ? here.label : "Varianta"}</span>
      ${variants.map((v) => `<button type="button" data-switch="${v.dataset.variant}">${v.dataset.variant.toUpperCase()}</button>`).join("")}
      <button type="button" class="proto-pages" aria-expanded="false" aria-controls="proto-menu">Stránky ▾</button>
    </div>`;
  document.body.append(proto);
  const menu = qs("#proto-menu");
  const pagesBtn = qs(".proto-pages", proto);
  pagesBtn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    pagesBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    if (!proto.contains(e.target)) {
      menu.classList.remove("open");
      pagesBtn.setAttribute("aria-expanded", "false");
    }
  });

  const key = `jh-variant-${page}`;
  const desc = qs("#proto-desc");
  JH.setVariant = (v) => {
    if (!variants.some((x) => x.dataset.variant === v)) v = variants[0]?.dataset.variant;
    variants.forEach((x) => (x.hidden = x.dataset.variant !== v));
    qsa("[data-switch]", proto).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.switch === v)));
    const cur = variants.find((x) => x.dataset.variant === v);
    desc.innerHTML = cur ? `<b>${v.toUpperCase()} – ${esc(cur.dataset.name || "")}.</b> ${esc(cur.dataset.desc || "")}` : "";
    desc.classList.toggle("is-hidden", !cur?.dataset.desc);
    try {
      localStorage.setItem(key, v);
    } catch {
      /* úložiště nedostupné */
    }
    const url = new URL(location.href);
    url.searchParams.set("v", v);
    history.replaceState(null, "", url);
    document.dispatchEvent(new CustomEvent("jh:variant", { detail: v }));
  };
  qsa("[data-switch]", proto).forEach((b) => b.addEventListener("click", () => JH.setVariant(b.dataset.switch)));

  JH.initVariant = () => {
    if (!variants.length) return;
    let v = params.get("v");
    if (!variants.some((x) => x.dataset.variant === v)) {
      try {
        v = localStorage.getItem(key) || "a";
      } catch {
        v = "a";
      }
    }
    JH.setVariant(v);
  };
  // Stránkové skripty běží dřív (konec <body>), takže obsah je vykreslený; pak varianta a případná kotva.
  window.addEventListener("DOMContentLoaded", () => {
    JH.initVariant();
    if (location.hash) {
      const visible = variants.find((x) => !x.hidden);
      const target = (visible && visible.querySelector(location.hash)) || document.querySelector(location.hash);
      target?.scrollIntoView();
    }
  });
})();

// Kotvy na stejné stránce míří do právě viditelné varianty (id se ve variantách opakují).
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href*="#"]');
  if (!a) return;
  const url = new URL(a.href, location.href);
  if (url.pathname !== location.pathname || !url.hash) return;
  const visible = [...document.querySelectorAll(".variant")].find((x) => !x.hidden);
  const target = (visible && visible.querySelector(url.hash)) || document.querySelector(url.hash);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("header")?.classList.remove("menu-open");
});
