(() => {
  "use strict";
  const { qs, qsa, t, esc, fmtDate, card, row, articles } = JH;

  // Sdílené bloky
  qsa('[data-slot="campaign"]').forEach((el) => (el.innerHTML = JH.campaign()));
  qsa('[data-slot="support"]').forEach((el) => (el.innerHTML = JH.supportStrip()));
  qsa('[data-slot="newsletter"]').forEach((el, i) => (el.innerHTML = JH.newsletter({ id: `h${i}` })));
  qsa('[data-slot="newsletter-light"]').forEach((el, i) => (el.innerHTML = JH.newsletter({ id: `hl${i}`, light: true })));

  // ---------- A: slider ----------
  const slider = qs("[data-slider]");
  slider.innerHTML = `
    ${JH.HERO.map(
      (s, i) => `<div class="slide${i === 0 ? " is-on" : ""}" role="group" aria-roledescription="slide" aria-label="${i + 1} z ${JH.HERO.length}">
        <img class="bg" src="${s.img}" alt="" style="object-position:${s.focus}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>
        <div class="container slide-copy">
          <p class="kicker">${esc(s.kicker)}</p>
          ${i === 0 ? `<h1>${t(s.title)}</h1>` : `<p class="slide-title">${t(s.title)}</p>`}
          <p class="slide-text">${t(s.text)}</p>
          <a class="slide-link" href="clanek.html?slug=${s.slug}">Číst článek</a>
        </div>
      </div>`,
    ).join("")}
    <div class="container slide-nav">
      <button type="button" data-dir="-1" aria-label="Předchozí">${JH.ICON.arrow}</button>
      <div class="dots">${JH.HERO.map((_, i) => `<button type="button" data-go="${i}" aria-label="Slide ${i + 1}" ${i === 0 ? 'aria-current="true"' : ""}></button>`).join("")}</div>
      <button type="button" data-dir="1" aria-label="Další">${JH.ICON.arrow}</button>
    </div>`;
  let cur = 0;
  let timer;
  const slides = qsa(".slide", slider);
  const go = (n) => {
    cur = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("is-on", i === cur));
    qsa("[data-go]", slider).forEach((d, i) => d.toggleAttribute("aria-current", i === cur));
    restart();
  };
  const restart = () => {
    clearInterval(timer);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => go(cur + 1), 7000);
  };
  slider.addEventListener("click", (e) => {
    const d = e.target.closest("[data-dir]");
    const g = e.target.closest("[data-go]");
    if (d) go(cur + Number(d.dataset.dir));
    if (g) go(Number(g.dataset.go));
  });
  restart();

  // ---------- A: výběr (6 karet) + rubriky s pilulkami ----------
  const featured = JH.bySection("doporucujeme").slice(0, 6);
  qs('[data-slot="a-featured"]').innerHTML = featured.map((a) => card(a)).join("");

  function tabs(root, { perPage = 8, exclude = [] } = {}) {
    const tabsDef = JH.SECTIONS.filter((s) => s.id !== "sloupky");
    let active = "nove";
    let page = 1;
    const render = (scroll) => {
      const list = JH.inSection(active).filter((a) => !exclude.includes(a.slug));
      const total = Math.ceil(list.length / perPage);
      const items = list.slice((page - 1) * perPage, page * perPage);
      root.innerHTML = `
        <div class="pills pills--scroll" role="group" aria-label="Rubriky">${tabsDef
          .map((s) => `<button type="button" class="pill" data-tab="${s.id}" aria-pressed="${s.id === active}">${s.label}</button>`)
          .join("")}</div>
        <div class="grid grid--4 tab-list">${items.map((a) => card(a, { noImg: true })).join("")}</div>
        ${JH.pager(page, total, { allHref: `clanky.html?rubrika=${active}`, allLabel: "Všechny texty v rubrice" })}`;
      if (scroll) root.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    root.addEventListener("click", (e) => {
      const tb = e.target.closest("[data-tab]");
      const pg = e.target.closest("[data-page]");
      if (tb) {
        active = tb.dataset.tab;
        page = 1;
        render(false);
      } else if (pg && !pg.disabled) {
        page = Number(pg.dataset.page);
        render(true);
      }
    });
    render(false);
  }
  tabs(qs('[data-tabs="a"]'), { exclude: featured.map((a) => a.slug) });

  // ---------- B: magazín ----------
  const latest = articles.slice(0, 6);
  const lead = JH.article("jeden-klik-meni-svet") || latest[0];
  qs('[data-slot="b-lead"]').innerHTML = `
    <article class="mag-lead">
      <a href="${JH.articleUrl(lead)}" class="mag-lead-img"><img src="${lead.img}" alt="" width="960" height="540"></a>
      <div class="mag-lead-body">
        <div class="card-meta" style="padding:0"><a class="tag" href="${JH.tagUrl(lead.tag)}">${esc(lead.tag)}</a><span>${fmtDate(lead.iso)} · ${lead.min} min čtení</span></div>
        <h1><a href="${JH.articleUrl(lead)}">${t(lead.title)}</a></h1>
        <p>${t(lead.perex)}</p>
        <p class="card-by" style="padding:0">${JH.authorBit(lead)}</p>
      </div>
    </article>
    <aside class="mag-side">
      <h2 class="kicker kicker--blue">Právě vyšlo</h2>
      <ol>${latest
        .filter((a) => a !== lead)
        .slice(0, 5)
        .map((a) => `<li><span>${fmtDate(a.iso)} · ${esc(a.tag)}</span><a href="${JH.articleUrl(a)}">${t(a.title)}</a></li>`)
        .join("")}</ol>
      <a class="link-arrow" href="clanky.html">Všechny články</a>
    </aside>`;

  const rowsDef = [
    { title: "Výběr redakce", href: "clanky.html?rubrika=doporucujeme", list: JH.bySection("doporucujeme").slice(0, 3), cols: 3 },
    { title: "Češi a Izrael", href: "clanky.html?rubrika=cesi-a-izrael", list: JH.bySection("cesi-a-izrael").filter((a) => a.kind !== "column").slice(3, 7), cols: 4 },
    { title: "Deník Dagmar Langové", href: JH.authorUrl("denik-dl"), list: JH.byAuthor("denik-dl").slice(0, 4), cols: 4, text: true, gold: true, sub: "Sloupek z Izraele. Postřehy ze života v zemi, o které se u nás hlavně mluví." },
    { title: "Studie a analýzy", href: "clanky.html?rubrika=studie", list: JH.bySection("studie").slice(0, 4), cols: 4 },
  ];
  qs('[data-slot="b-rows"]').innerHTML = rowsDef
    .map(
      (r, i) => `<section class="section ${i % 2 ? "section--paper" : ""} ${r.gold ? "row-gold" : ""}"><div class="container">
        <div class="section-head"><div><h2 class="h2">${t(r.title)}</h2>${r.sub ? `<p>${t(r.sub)}</p>` : ""}</div><a class="link-arrow" href="${r.href}">Zobrazit vše</a></div>
        <div class="grid grid--${r.cols}">${r.list.map((a) => card(a, { noImg: r.text, byline: !r.text })).join("")}</div>
      </div></section>`,
    )
    .join("");

  // ---------- C: témata a akce ----------
  qs('[data-slot="c-chips"]').innerHTML = JH.topTags(7)
    .map((x) => `<a class="pill pill--glass" href="${JH.tagUrl(x.tag)}">${esc(x.tag)}</a>`)
    .join("");
  const [first, ...rest] = articles.slice(0, 5);
  qs('[data-slot="c-latest"]').innerHTML = `<div>${card(first, { lg: true, byline: true })}</div><div>${rest.map((a) => row(a)).join("")}</div>`;
  qs('[data-slot="c-topics"]').innerHTML = JH.AXES.slice(0, 6)
    .map(
      (x) => `<a class="topic" href="clanek.html?slug=${x.slug}">
        <img src="${x.img}" alt="" loading="lazy">
        <span class="topic-copy"><span class="kicker">${esc(x.kicker)}</span><b>${t(x.title)}</b><span class="topic-text">${t(x.text)}</span></span>
      </a>`,
    )
    .join("");
  const dl = JH.byAuthor("denik-dl").slice(0, 3);
  qs('[data-slot="c-column"]').innerHTML = `
    <div class="column-intro">
      <span class="tag tag--gold">Sloupek</span>
      <h2 class="h2" style="margin-top:14px">Deník Dagmar Langové</h2>
      <p>${t("Sloupek z Izraele. Postřehy ze života v zemi, o které se u nás hlavně mluví – o lidech, válce i obyčejných dnech.")}</p>
      <a class="btn btn--outline" href="${JH.authorUrl("denik-dl")}" style="margin-top:20px">Všech ${JH.byAuthor("denik-dl").length} dílů</a>
    </div>
    <div class="grid grid--3">${dl.map((a) => card(a, { noImg: true })).join("")}</div>`;
})();
