(() => {
  "use strict";
  const { qs, qsa, esc, t, fmtDate, card, row, params, ICON } = JH;
  const DEFAULT = "musime-si-promluvit-o-nakbe";
  const a = JH.article(params.get("slug")) || JH.article(DEFAULT) || JH.articles[0];
  document.title = `${a.title} – Jedním hlasem`;

  const author = JH.authors[a.author] || JH.authors.redakce;
  const authorName = JH.authorName(a);
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const related = (() => {
    const same = JH.articles.filter((x) => x.slug !== a.slug && (x.tag === a.tag || x.tags.some((g) => a.tags.includes(g))));
    return (same.length >= 3 ? same : same.concat(JH.articles.filter((x) => x.slug !== a.slug))).slice(0, 3);
  })();

  // ---------- Tělo článku ----------
  function prepare(html) {
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
    const root = doc.body.firstElementChild;
    qsa("script, style, iframe", root).forEach((n) => n.remove());
    qsa("*", root).forEach((n) => [...n.attributes].forEach((at) => at.name.startsWith("on") && n.removeAttribute(at.name)));
    qsa("img", root).forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (src.startsWith("/images/articles/")) img.setAttribute("src", src.replace("/images/articles/", "assets/articles/"));
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      img.setAttribute("loading", "lazy");
    });
    // Úvodní fotka je v hlavičce článku – stejná fotka v textu se nezdvojí.
    const firstImg = qs("img", root);
    if (firstImg && firstImg.getAttribute("src")?.includes(a.img.replace(/-960\.webp$/, "").replace(/\.jpg$/, ""))) {
      (firstImg.closest(".wp-block-image") || firstImg.closest("figure") || firstImg).remove();
    }
    const toc = [];
    qsa("h2, h3", root).forEach((h, i) => {
      const text = h.textContent.trim();
      if (!text) return;
      h.id = `kap-${i + 1}`;
      toc.push({ id: h.id, text, level: h.tagName === "H3" ? 3 : 2 });
    });
    qsa("p, li", root).forEach((p) => {
      const walker = doc.createTreeWalker(p, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) n.nodeValue = JH.nbsp(n.nodeValue);
    });
    return { html: root.innerHTML, toc };
  }

  // ---------- Kousky ----------
  const tagsHTML = () => `<div class="art-tags">${a.tags.map((g) => `<a class="tag" href="${JH.tagUrl(g)}">${esc(g)}</a>`).join("")}</div>`;
  const shareHTML = (vertical) => `
    <div class="share-row${vertical ? " share-row--v" : ""}">
      <button type="button" class="icon-btn" data-share aria-label="Sdílet">${ICON.share}</button>
      <a class="icon-btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}" target="_blank" rel="noreferrer" aria-label="Sdílet na Facebooku">${ICON.fb}</a>
      <a class="icon-btn" href="https://x.com/intent/post?url=${encodeURIComponent(location.href)}" target="_blank" rel="noreferrer" aria-label="Sdílet na X">${ICON.x}</a>
      <button type="button" class="icon-btn" data-copy="${esc(location.href)}" aria-label="Kopírovat odkaz">${ICON.copy}</button>
    </div>`;
  const avatar = (big) => `<span class="avatar${big ? " avatar--lg" : ""}${a.kind === "column" ? " avatar--gold" : ""}">${esc(initials(authorName))}</span>`;
  const bylineHTML = () => `
    <div class="byline">
      ${avatar()}
      <div>
        <p>${a.kind === "translation" ? "Překlad · " : ""}<a href="${JH.authorUrl(a.author)}">${esc(authorName)}</a></p>
        <p class="muted">${fmtDate(a.iso)} · ${a.min} min čtení</p>
      </div>
    </div>`;
  const originalHTML = () =>
    a.original
      ? `<aside class="original"><p class="kicker kicker--blue">Překlad</p><p>Původní text: <strong>${esc(a.original.name)}</strong>${a.original.medium ? `, ${esc(a.original.medium)}` : ""}${a.original.date ? `, ${esc(a.original.date)}` : ""}</p><p class="muted">Přeložila redakce Jedním hlasem.</p></aside>`
      : "";
  const authorBox = () => `
    <aside class="author-box">
      ${avatar(true)}
      <div>
        <p class="kicker kicker--blue">${esc(author.role)}</p>
        <h2 class="h3" style="margin-top:6px">${esc(a.kind === "translation" && a.original ? a.original.name : author.name)}</h2>
        <p class="muted" style="margin-top:6px">${t(a.kind === "column" ? "Sloupek z Izraele – postřehy ze života v zemi, o které se u nás hlavně mluví." : a.kind === "translation" ? "Texty světových autorů, které v české debatě chybí. Překládá redakce Jedním hlasem." : a.kind === "external" ? "Autor, který na Jedním hlasem publikuje vlastní texty." : "Analýzy, komentáře a příběhy redakce Jedním hlasem.")}</p>
        <a class="link-arrow" style="margin-top:12px" href="${JH.authorUrl(a.author)}">Další texty (${JH.byAuthor(a.author).length})</a>
      </div>
    </aside>`;
  const crumbs = () => `<nav class="crumbs" aria-label="Drobečková navigace"><a href="clanky.html">Články</a><span>/</span><a href="${JH.tagUrl(a.tag)}">${esc(a.tag)}</a></nav>`;
  const tocHTML = (toc) =>
    toc.length
      ? `<nav class="toc" aria-label="Obsah článku"><p class="kicker kicker--blue">Obsah</p><ol>${toc.map((x) => `<li class="lv${x.level}"><a href="#${x.id}">${esc(x.text)}</a></li>`).join("")}</ol></nav>`
      : "";

  function render(body) {
    const { html, toc } = prepare(body);
    const prose = `<div class="prose">${html}</div>`;
    const relatedCards = `<section class="section section--paper"><div class="container"><div class="section-head"><h2 class="h2">Čtěte dál</h2><a class="link-arrow" href="${JH.tagUrl(a.tag)}">Další k tématu ${esc(a.tag)}</a></div><div class="grid grid--3">${related.map((x) => card(x, { byline: true })).join("")}</div></div></section>`;

    // A – klasický sloupec
    qs('[data-art="a"]').innerHTML = `
      <article>
        <header class="container container--narrow art-head">
          ${crumbs()}
          <a class="tag${a.kind === "column" ? " tag--gold" : ""}" href="${JH.tagUrl(a.tag)}">${esc(a.tag)}</a>
          <h1 class="art-title">${t(a.title)}</h1>
          <div class="art-meta">${bylineHTML()}${shareHTML()}</div>
        </header>
        <figure class="container container--mid art-figure"><img src="${a.img}" alt="" width="960" height="540"></figure>
        <div class="container container--narrow">
          ${prose}
          ${originalHTML()}
          ${tagsHTML()}
          ${authorBox()}
          <div style="margin-top:40px">${JH.supportStrip({ title: "Tento text vznikl díky čtenářům.", text: "Pomozte nám psát další – bez grantů a reklam." })}</div>
        </div>
      </article>
      ${relatedCards}`;

    // B – fotka přes celou šířku + obsah vlevo
    qs('[data-art="b"]').innerHTML = `
      <article>
        <header class="photo-hero art-hero tail">
          <img class="bg" src="${a.img}" alt="">
          <div class="container">
            ${crumbs()}
            <a class="tag tag--white" href="${JH.tagUrl(a.tag)}">${esc(a.tag)}</a>
            <h1 class="h1" style="margin-top:14px;max-width:16em">${t(a.title)}</h1>
            <p class="art-hero-meta">${a.kind === "translation" ? "Překlad · " : ""}<a href="${JH.authorUrl(a.author)}">${esc(authorName)}</a> · ${fmtDate(a.iso)} · ${a.min} min čtení</p>
          </div>
        </header>
        <div class="container art-layout-b">
          <aside class="art-rail">${tocHTML(toc)}<p class="kicker kicker--blue" style="margin-top:28px">Sdílet</p>${shareHTML(true)}</aside>
          <div class="art-main">
            ${prose}
            ${originalHTML()}
            ${tagsHTML()}
            ${authorBox()}
          </div>
        </div>
      </article>
      ${relatedCards}
      <section class="section"><div class="container">${JH.newsletter({ id: "art-b" })}</div></section>`;

    // C – postranní panel
    const latest = JH.articles.filter((x) => x.slug !== a.slug).slice(0, 5);
    qs('[data-art="c"]').innerHTML = `
      <article class="container art-layout-c">
        <div class="art-main">
          ${crumbs()}
          <h1 class="art-title" style="margin-top:12px">${t(a.title)}</h1>
          <div class="art-meta">${bylineHTML()}${shareHTML()}</div>
          <figure class="art-figure" style="padding:0"><img src="${a.img}" alt="" width="960" height="540"></figure>
          ${prose}
          ${originalHTML()}
          ${tagsHTML()}
        </div>
        <aside class="art-aside">
          <div class="aside-card">${authorBox()}</div>
          <div class="aside-card aside-card--gold">
            <p class="kicker">Nezávislí díky vám</p>
            <h2 class="h3" style="color:var(--ink);margin-top:8px">Fakta nemají sponzora.</h2>
            <p style="margin-top:8px">Podpořte další analýzy jako je tato.</p>
            <a class="btn btn--gold btn--wide" style="margin-top:16px" href="podporte-nas.html">Podpořit</a>
          </div>
          <div class="aside-card">
            <p class="kicker kicker--blue">Nejnovější</p>
            <ol class="aside-list">${latest.map((x) => `<li><a href="${JH.articleUrl(x)}">${t(x.title)}</a><span>${fmtDate(x.iso)}</span></li>`).join("")}</ol>
          </div>
        </aside>
      </article>
      <section class="section section--paper"><div class="container container--mid">
        <h2 class="h2">Související</h2>
        <div style="margin-top:12px">${related.map(row).join("")}</div>
      </div></section>
      <section class="section"><div class="container">${JH.newsletter({ id: "art-c", light: true })}</div></section>`;
  }

  // Načtení těla (v Frameru to bude pole „Obsah“ v CMS)
  qsa("[data-art]").forEach((el) => (el.innerHTML = `<div class="container container--narrow section"><p class="muted">Načítám článek…</p></div>`));
  fetch("data/bodies.json")
    .then((r) => r.json())
    .then((bodies) => render(bodies[a.slug] || `<p>${esc(a.perex)}</p>`))
    .catch(() => render(`<p>${esc(a.perex)}</p>`));

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-share]")) JH.share(a.title);
  });

  // Ukazatel postupu čtení
  const bar = qs(".progress span");
  const onScroll = () => {
    const visible = qsa(".variant").find((v) => !v.hidden);
    const prose = visible && qs(".prose", visible);
    if (!prose) return;
    const r = prose.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight * 0.6)));
    bar.style.transform = `scaleX(${p})`;
  };
  addEventListener("scroll", onScroll, { passive: true });
})();
