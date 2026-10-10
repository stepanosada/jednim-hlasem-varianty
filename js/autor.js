(() => {
  "use strict";
  const { qs, esc, t, fmtDate, card, row, params } = JH;
  const id = JH.authors[params.get("id")] ? params.get("id") : "denik-dl";
  const au = JH.authors[id];
  const list = JH.byAuthor(id);
  document.title = `${au.name} – Jedním hlasem`;

  const BIO = {
    column: "Sloupek z Izraele. Postřehy ze života v zemi, o které se u nás hlavně mluví – o lidech, válce i obyčejných dnech.",
    house: "Analýzy, komentáře a příběhy, které připravuje redakce Jedním hlasem. Fakta, kontext a klidný tón.",
    external: "Autor, který na Jedním hlasem publikuje vlastní texty. Medailon doplní redakce.",
    translation: "Texty světových autorů a novinářů, které v české debatě chybí. Překládá redakce Jedním hlasem.",
  };
  const bio = BIO[au.kind];
  const initials = au.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const avatar = (size = "") => `<span class="avatar avatar--${size || "xl"}${au.kind === "column" ? " avatar--gold" : ""}" aria-hidden="true">${esc(initials)}</span>`;
  const since = list.length ? new Date(list[list.length - 1].iso).getFullYear() : "";
  const topics = (() => {
    const c = {};
    list.forEach((a) => a.tags.forEach((g) => (c[g] = (c[g] || 0) + 1)));
    return Object.entries(c).sort((x, y) => y[1] - x[1]).slice(0, 6).map(([g]) => g);
  })();
  const stats = `<dl class="stats"><div><dt>Textů</dt><dd>${list.length}</dd></div><div><dt>Píše od</dt><dd>${since}</dd></div><div><dt>Čtení celkem</dt><dd>${list.reduce((s, a) => s + a.min, 0)} min</dd></div></dl>`;
  const otherAuthors = () =>
    `<div class="pills">${Object.entries(JH.authors)
      .filter(([k]) => JH.byAuthor(k).length)
      .map(([k, v]) => `<a class="pill" href="autor.html?id=${k}" ${k === id ? 'aria-current="true"' : ""}>${esc(v.name)}</a>`)
      .join("")}</div>`;
  const partNo = (a) => (a.slug.match(/dagmar-langove-(\d+)/) || [])[1];

  // ---------- A ----------
  const A = { root: qs('[data-au="a"]'), tag: "", page: 1, per: 9 };
  A.render = (scroll) => {
    const items = A.tag ? list.filter((a) => a.tags.includes(A.tag)) : list;
    const total = Math.ceil(items.length / A.per);
    A.root.innerHTML = `
      <section class="section author-hero">
        <div class="container author-hero-grid">
          ${avatar()}
          <div>
            <p class="kicker kicker--blue">${esc(au.role)}</p>
            <h1 class="h2" style="margin-top:8px">${esc(au.name)}</h1>
            <p class="lead" style="margin-top:12px;max-width:38em;color:var(--text)">${t(bio)}</p>
          </div>
          ${stats}
        </div>
      </section>
      <section class="section" style="padding-top:0"><div class="container">
        <div class="pills" role="group" aria-label="Témata autora">
          <button type="button" class="pill" data-atag="" aria-pressed="${!A.tag}">Vše</button>
          ${topics.map((g) => `<button type="button" class="pill" data-atag="${esc(g)}" aria-pressed="${A.tag === g}">${esc(g)}</button>`).join("")}
        </div>
        <div class="grid grid--3" style="margin-top:32px" data-list>${items.slice((A.page - 1) * A.per, A.page * A.per).map((a) => card(a)).join("")}</div>
        ${JH.pager(A.page, total)}
      </div></section>
      <section class="section section--paper section--tight"><div class="container"><p class="kicker kicker--blue" style="margin-bottom:14px">Další autoři</p>${otherAuthors()}</div></section>`;
    if (scroll) qs("[data-list]", A.root).scrollIntoView({ behavior: "smooth" });
  };
  A.root.addEventListener("click", (e) => {
    const g = e.target.closest("[data-atag]");
    const p = e.target.closest("[data-page]");
    if (g) {
      A.tag = g.dataset.atag;
      A.page = 1;
      A.render(false);
    } else if (p && !p.disabled) {
      A.page = Number(p.dataset.page);
      A.render(true);
    }
  });

  // ---------- B ----------
  const B = { root: qs('[data-au="b"]') };
  B.render = () => {
    const months = new Map();
    list.forEach((a) => {
      const d = new Date(a.iso);
      const key = d.toLocaleDateString("cs-CZ", { month: "long", year: "numeric" });
      if (!months.has(key)) months.set(key, []);
      months.get(key).push(a);
    });
    B.root.innerHTML = `
      <section class="section--blue tail series-hero">
        <div class="container series-grid">
          <div>
            <p class="kicker">${au.kind === "column" ? "Sloupek" : esc(au.role)} · ${list.length} ${au.kind === "column" ? "dílů" : "textů"}</p>
            <h1 class="h1" style="margin-top:14px">${esc(au.series || au.name)}</h1>
            <p class="lead" style="margin-top:16px;max-width:34em;color:rgba(255,255,255,0.88)">${t(bio)}</p>
            ${au.series ? `<p class="series-by">${avatar("md")} <span>Píše <strong>${esc(au.name)}</strong></span></p>` : ""}
          </div>
          <form class="series-sub" data-newsletter>
            <p class="kicker">Nový díl do e-mailu</p>
            <p style="margin-top:8px">Jakmile vyjde další text, pošleme vám ho.</p>
            <label class="sr-only" for="sub-b">E-mail</label>
            <input class="input" id="sub-b" type="email" required placeholder="vas@email.cz" style="margin-top:14px">
            <button class="btn btn--gold btn--wide" style="margin-top:10px" type="submit">Odebírat</button>
          </form>
        </div>
      </section>
      <section class="section"><div class="container container--mid">
        ${[...months]
          .map(
            ([m, arts]) => `<div class="tl-month"><h2 class="tl-label">${esc(m)}</h2><ol class="tl">${arts
              .map(
                (a) => `<li class="tl-item"><a href="${JH.articleUrl(a)}">
                  <span class="tl-date">${fmtDate(a.iso)}${partNo(a) ? ` · díl ${partNo(a)}` : ""}</span>
                  <span class="tl-title">${t(a.title)}</span>
                  <span class="tl-perex">${t(a.perex)}</span></a></li>`,
              )
              .join("")}</ol></div>`,
          )
          .join("")}
      </div></section>`;
  };

  // ---------- C ----------
  const C = { root: qs('[data-au="c"]'), shown: 8 };
  C.render = () => {
    const [first, ...rest] = list;
    C.root.innerHTML = `
      <section class="section"><div class="container author-c">
        <aside class="author-card">
          ${avatar()}
          <p class="kicker kicker--blue" style="margin-top:18px">${esc(au.role)}</p>
          <h1 class="h3" style="margin-top:6px;font-size:32px">${esc(au.name)}</h1>
          <p style="margin-top:10px;color:var(--text)">${t(bio)}</p>
          ${stats}
          <p class="kicker kicker--blue" style="margin-top:24px">Píše o</p>
          <div class="author-topics">${topics.map((g) => `<a class="tag" href="${JH.tagUrl(g)}">${esc(g)}</a>`).join("")}</div>
          <a class="btn btn--outline btn--wide" style="margin-top:24px" href="clanky.html?autor=${id}">Hledat v textech autora</a>
        </aside>
        <div>
          ${first ? `<p class="kicker kicker--blue" style="margin-bottom:14px">Nejnovější</p>${card(first, { lg: true })}` : ""}
          <div style="margin-top:32px">${rest.slice(0, C.shown).map(row).join("")}</div>
          ${rest.length > C.shown ? `<div class="load-more"><p class="muted">Zobrazeno ${C.shown + 1} z ${list.length}</p><button type="button" class="btn btn--outline" data-more>Načíst další</button></div>` : ""}
        </div>
      </div></section>
      <section class="section section--paper section--tight"><div class="container"><p class="kicker kicker--blue" style="margin-bottom:14px">Další autoři</p>${otherAuthors()}</div></section>`;
  };
  C.root.addEventListener("click", (e) => {
    if (e.target.closest("[data-more]")) {
      C.shown += 10;
      C.render();
    }
  });

  [A, B, C].forEach((v) => v.render(false));
})();
