(() => {
  "use strict";
  const { qs, qsa, esc, t, card, row, params } = JH;
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  // Sdílený stav filtru (z adresy: ?rubrika=, ?tag=, ?autor=, ?q=)
  const state = {
    rubrika: params.get("rubrika") || "nove",
    tag: params.get("tag") || "",
    autor: params.get("autor") || "",
    q: params.get("q") || "",
    sort: "new",
  };

  function results() {
    let list = JH.inSection(state.rubrika);
    if (state.tag) list = JH.byTag(state.tag);
    if (state.autor) list = list.filter((a) => a.author === state.autor);
    if (state.q) {
      const terms = norm(state.q).split(/\s+/).filter(Boolean);
      list = list.filter((a) => {
        const hay = norm(`${a.title} ${a.perex} ${a.tag} ${a.tags.join(" ")} ${JH.authorName(a)}`);
        return terms.every((x) => hay.includes(x));
      });
    }
    if (state.sort === "old") list = list.slice().reverse();
    return list;
  }

  function syncUrl() {
    const u = new URL(location.href);
    ["rubrika", "tag", "autor", "q"].forEach((k) => {
      const v = state[k];
      if (v && !(k === "rubrika" && v === "nove")) u.searchParams.set(k, v);
      else u.searchParams.delete(k);
    });
    history.replaceState(null, "", u);
  }

  function activeFilters() {
    const chips = [];
    if (state.tag) chips.push(["tag", `Téma: ${state.tag}`]);
    if (state.autor) chips.push(["autor", `Autor: ${(JH.authors[state.autor] || {}).name || state.autor}`]);
    if (state.q) chips.push(["q", `Hledáno: „${state.q}“`]);
    if (!chips.length) return "";
    return `<div class="active-filters">${chips
      .map(([k, l]) => `<button type="button" class="chip" data-clear="${k}">${esc(l)} <span aria-hidden="true">×</span><span class="sr-only">zrušit</span></button>`)
      .join("")}<button type="button" class="link-btn" data-clear="all">Zrušit vše</button></div>`;
  }

  const pillsHTML = () =>
    `<div class="pills pills--scroll" role="group" aria-label="Rubriky">${JH.SECTIONS.map(
      (s) => `<button type="button" class="pill" data-rubrika="${s.id}" aria-pressed="${!state.tag && s.id === state.rubrika}">${s.label}</button>`,
    ).join("")}</div>`;

  const empty = () => `<div class="empty"><h2 class="h3">Nic jsme nenašli.</h2><p class="muted" style="margin-top:8px">Zkuste jiné slovo nebo zrušte filtr.</p><button type="button" class="btn btn--outline" data-clear="all" style="margin-top:18px">Zobrazit všechny články</button></div>`;

  // ---------- A ----------
  const A = { root: qs('[data-variant="a"]'), page: 1, per: 12 };
  A.render = (scroll) => {
    const list = results();
    const total = Math.ceil(list.length / A.per);
    A.page = Math.min(A.page, Math.max(1, total));
    qs("[data-tools]", A.root).innerHTML = `
      <form class="inline-search" data-search><label class="sr-only" for="a-q">Hledat</label>${JH.ICON.search}<input id="a-q" name="q" value="${esc(state.q)}" placeholder="Hledat v článcích" autocomplete="off"></form>
      ${pillsHTML()}`;
    qs("[data-results]", A.root).innerHTML = `${activeFilters()}
      <p class="count">${list.length} ${list.length === 1 ? "text" : list.length < 5 ? "texty" : "textů"}</p>
      ${list.length ? `<div class="grid grid--3">${list.slice((A.page - 1) * A.per, A.page * A.per).map((a) => card(a, { byline: true })).join("")}</div>${JH.pager(A.page, total)}` : empty()}`;
    if (scroll) qs("[data-results]", A.root).scrollIntoView({ behavior: "smooth" });
  };

  // ---------- B ----------
  const B = { root: qs('[data-variant="b"]'), page: 1, per: 15 };
  B.render = (scroll) => {
    const list = results();
    const total = Math.ceil(list.length / B.per);
    B.page = Math.min(B.page, Math.max(1, total));
    const count = (id) => JH.inSection(id).length;
    const authors = Object.entries(JH.authors).map(([id, a]) => ({ id, ...a, n: JH.byAuthor(id).length })).filter((a) => a.n);
    qs("[data-side]", B.root).innerHTML = `
      <form class="inline-search" data-search><label class="sr-only" for="b-q">Hledat</label>${JH.ICON.search}<input id="b-q" name="q" value="${esc(state.q)}" placeholder="Hledat" autocomplete="off"></form>
      <h2 class="side-h">Rubriky</h2>
      <ul class="side-list">${JH.SECTIONS.map((s) => `<li><button type="button" data-rubrika="${s.id}" aria-pressed="${!state.tag && s.id === state.rubrika}">${s.label}<span>${count(s.id)}</span></button></li>`).join("")}</ul>
      <h2 class="side-h">Témata</h2>
      <div class="tag-cloud">${JH.topTags(18).map((x) => `<button type="button" class="tag${state.tag === x.tag ? " is-on" : ""}" data-tag="${esc(x.tag)}">${esc(x.tag)}</button>`).join("")}</div>
      <h2 class="side-h">Autoři</h2>
      <ul class="side-list">${authors.map((a) => `<li><button type="button" data-autor="${a.id}" aria-pressed="${state.autor === a.id}">${esc(a.name)}<span>${a.n}</span></button></li>`).join("")}</ul>`;
    qs("[data-results]", B.root).innerHTML = `
      <div class="results-bar"><p class="count" style="margin:0">${list.length} výsledků</p>
        <label class="sort">Řadit <select class="select" data-sort><option value="new" ${state.sort === "new" ? "selected" : ""}>Od nejnovějších</option><option value="old" ${state.sort === "old" ? "selected" : ""}>Od nejstarších</option></select></label></div>
      ${activeFilters()}
      ${list.length ? `<div>${list.slice((B.page - 1) * B.per, B.page * B.per).map(row).join("")}</div>${JH.pager(B.page, total)}` : empty()}`;
    if (scroll) qs("[data-results]", B.root).scrollIntoView({ behavior: "smooth" });
  };

  // ---------- C ----------
  const C = { root: qs('[data-variant="c"]'), shown: 15 };
  C.render = () => {
    const list = results();
    qs("[data-tools]", C.root).innerHTML = pillsHTML();
    qs("#c-search").value = state.q;
    const [f1, f2, f3, ...rest] = list;
    const featured = f1 ? `<div class="stream-top">${card(f1, { lg: true, byline: true })}<div class="stream-side">${[f2, f3].filter(Boolean).map((a) => card(a, { byline: true })).join("")}</div></div>` : "";
    const more = rest.slice(0, C.shown - 3);
    qs("[data-results]", C.root).innerHTML = `${activeFilters()}
      ${list.length ? `${featured}<div class="grid grid--4" style="margin-top:48px">${more.map((a) => card(a, { noImg: true, byline: true })).join("")}</div>
      ${list.length > C.shown ? `<div class="load-more"><p class="muted">Zobrazeno ${C.shown} z ${list.length}</p><button type="button" class="btn btn--outline" data-more>Načíst další</button></div>` : ""}` : empty()}`;
  };

  const all = [A, B, C];
  const renderAll = () => {
    syncUrl();
    all.forEach((v) => v.render(false));
  };
  const reset = () => {
    A.page = B.page = 1;
    C.shown = 15;
  };

  document.querySelector("main").addEventListener("click", (e) => {
    const r = e.target.closest("[data-rubrika]");
    const tg = e.target.closest("[data-tag]");
    const au = e.target.closest("[data-autor]");
    const cl = e.target.closest("[data-clear]");
    const pg = e.target.closest("[data-page]");
    const mo = e.target.closest("[data-more]");
    if (r) {
      Object.assign(state, { rubrika: r.dataset.rubrika, tag: "" });
      reset();
      renderAll();
    } else if (tg) {
      state.tag = state.tag === tg.dataset.tag ? "" : tg.dataset.tag;
      reset();
      renderAll();
    } else if (au) {
      state.autor = state.autor === au.dataset.autor ? "" : au.dataset.autor;
      reset();
      renderAll();
    } else if (cl) {
      if (cl.dataset.clear === "all") Object.assign(state, { tag: "", autor: "", q: "", rubrika: "nove" });
      else state[cl.dataset.clear] = "";
      reset();
      renderAll();
    } else if (pg && !pg.disabled) {
      const v = all.find((x) => x.root.contains(pg));
      v.page = Number(pg.dataset.page);
      v.render(true);
    } else if (mo) {
      C.shown += 12;
      C.render();
    }
  });
  document.querySelector("main").addEventListener("submit", (e) => {
    if (!e.target.matches("[data-search]")) return;
    e.preventDefault();
    state.q = e.target.querySelector("input").value.trim();
    reset();
    renderAll();
  });
  document.querySelector("main").addEventListener("change", (e) => {
    if (e.target.matches("[data-sort]")) {
      state.sort = e.target.value;
      reset();
      renderAll();
    }
  });

  renderAll();
})();
