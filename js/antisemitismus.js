(() => {
  "use strict";
  const { qs, qsa, esc, t, card } = JH;
  const S = JH.antisemitismus;
  const n2 = (i) => String(i + 1).padStart(2, "0");
  const INTRO =
    "Antisemitismus nelze chápat jako historickou epizodu ani jako uzavřený fenomén dvacátého století. Jde o dlouhodobý a strukturálně specifický jev, který se v průběhu dějin opakovaně proměňuje a přizpůsobuje aktuálním společenským, politickým a ideologickým podmínkám.";
  const INTRO2 =
    "Ačkoli je antisemitismus namířen proti jedné konkrétní skupině, nevypovídá o této skupině, ale o společnosti a jejích institucích, které jej vytvářejí, tolerují nebo mu nejsou schopny čelit.";
  const PHOTO = `<figure class="as-photo"><img src="assets/synagoga-jeruzalemska-portal.jpg" alt="Jeruzalémská synagoga v Praze, portál"><figcaption>Foto: Dietmar Rabich / Wikimedia Commons, CC BY-SA 4.0</figcaption></figure>`;
  const related = JH.byTag("Antisemitismus").slice(0, 3);
  const firstP = (s) => (s.blocks.find((b) => b.p) || {}).p || "";

  const blocks = (bs) =>
    bs
      .map((b) =>
        b.h ? `<h3>${t(b.h)}</h3>` : b.list ? `<ul>${b.list.map((li) => `<li>${t(li)}</li>`).join("")}</ul>` : `<p>${t(b.p)}</p>`,
      )
      .join("");

  const DDD = [
    { d: "Dvojí standard", q: "Je Izrael posuzován podle přísnějších nebo zcela odlišných měřítek než jiné státy v obdobných situacích?" },
    { d: "Démonizace", q: "Je Izrael vykreslován jako absolutní zlo, zdroj veškerého násilí nebo přirovnáván k nacismu?" },
    { d: "Delegitimizace", q: "Je Izraeli upíráno právo na existenci nebo je jeho vznik označován za inherentně nelegitimní?" },
  ];
  const compare = () => `
    <div class="compare">
      <div class="compare-col"><h3>Legitimní kritika</h3><ul>
        <li>${t("směřuje ke konkrétním činům, politikám nebo aktérům")}</li>
        <li>${t("používá stejná měřítka jako vůči jiným státům")}</li>
        <li>${t("je otevřená faktům a protiargumentům")}</li></ul></div>
      <div class="compare-col compare-col--red"><h3>Antisemitismus</h3><ul>
        <li>${t("kolektivní vina („Židé“, „sionisté“ jako celek)")}</li>
        <li>${t("symbolický jazyk a historické vzorce démonizace")}</li>
        <li>${t("popírá samotnou existenci, ne konkrétní politiku")}</li></ul></div>
    </div>
    <p class="compare-note">${t("Rozhodující není míra emocí, ale struktura argumentu.")}</p>`;

  const reportBand = () => `
    <section class="band tail">
      <div class="container">
        <div><p class="kicker">Setkali jste se s antisemitismem?</p><h2>Nahlaste to. Každé nahlášení má smysl.</h2></div>
        <div class="actions"><a class="btn btn--red" href="nahlasit-incident.html">Nahlaste incident</a></div>
      </div>
    </section>`;
  const relatedSec = () => `
    <section class="section"><div class="container">
      <div class="section-head"><h2 class="h2">Čtěte dál</h2><a class="link-arrow" href="${JH.tagUrl("Antisemitismus")}">Všechny texty o antisemitismu</a></div>
      <div class="grid grid--3">${related.map((a) => card(a)).join("")}</div>
    </div></section>`;

  // ---------- A: dlouhé čtení ----------
  qs('[data-as="a"]').innerHTML = `
    <section class="photo-hero as-hero tail">
      <img class="bg" src="assets/synagoga-jeruzalemska-portal.jpg" alt="" style="object-position:center 55%">
      <div class="container">
        <p class="kicker">Klíčové téma</p>
        <h1 class="h1" style="margin-top:12px">Antisemitismus</h1>
        <p class="lead" style="margin-top:18px;max-width:36em">${t(INTRO)}</p>
      </div>
    </section>
    <div class="container as-long">
      <nav class="as-toc" aria-label="Kapitoly"><p class="kicker kicker--blue">Kapitoly</p><ol>${S.map((s, i) => `<li><a href="#a-${s.id}" data-spy="${s.id}"><span>${n2(i)}</span>${esc(s.title)}</a></li>`).join("")}</ol>
        <a class="btn btn--red btn--sm" href="nahlasit-incident.html" style="margin-top:24px">Nahlaste incident</a></nav>
      <div class="prose as-prose">
        <p>${t(INTRO2)}</p>
        ${S.map((s, i) => `<section id="a-${s.id}" class="as-chapter" data-chapter="${s.id}"><p class="as-num">${n2(i)}</p><h2>${t(s.title)}</h2>${blocks(s.blocks)}</section>`).join("")}
      </div>
    </div>
    ${reportBand()}
    ${relatedSec()}`;

  // Zvýraznění aktuální kapitoly v obsahu
  const spy = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        qsa("[data-spy]").forEach((l) => l.classList.toggle("is-on", l.dataset.spy === en.target.dataset.chapter));
      }),
    { rootMargin: "-30% 0px -60% 0px" },
  );
  qsa('[data-as="a"] [data-chapter]').forEach((el) => spy.observe(el));

  // ---------- B: rozcestník ----------
  qs('[data-as="b"]').innerHTML = `
    <section class="section--ice tail as-b-hero">
      <div class="container as-b-grid">
        <div>
          <p class="kicker kicker--blue">Klíčové téma</p>
          <h1 class="h1" style="margin-top:12px;color:var(--blue)">Antisemitismus</h1>
          <p class="lead" style="margin-top:18px">${t("Nová podoba starých předsudků – jak ji poznat, pojmenovat a věcně vyvracet.")}</p>
          <p style="margin-top:12px;color:var(--text)">${t(INTRO)}</p>
        </div>
        ${PHOTO}
      </div>
    </section>
    <section class="section"><div class="container">
      <div class="section-head"><div><h2 class="h2">Šest kapitol</h2><p>${t("Každá kapitola se otevře v okně. Celkem asi 25 minut čtení.")}</p></div></div>
      <div class="as-cards">${S.map(
        (s, i) => `<button type="button" class="as-card" data-open="${s.id}">
          <span class="as-card-num">${n2(i)}</span>
          <span class="as-card-title">${esc(s.title)}</span>
          <span class="as-card-text">${t(firstP(s))}</span>
          <span class="link-arrow">Číst kapitolu</span>
        </button>`,
      ).join("")}</div>
    </div></section>
    <section class="section section--paper"><div class="container">
      <div class="section-head"><div><h2 class="h2">Test tří D</h2><p>${t("Natan Sharanský navrhl jednoduchý test, kdy kritika Izraele překračuje hranici. Klikněte na písmeno.")}</p></div></div>
      <div class="ddd">${DDD.map((x, i) => `<button type="button" class="ddd-card" aria-expanded="${i === 0}" data-ddd><span class="ddd-letter">D</span><span class="ddd-name">${x.d}</span><span class="ddd-q">${t(x.q)}</span></button>`).join("")}</div>
      <h2 class="h3" style="margin-top:clamp(48px,5vw,72px)">Kritika, nebo nenávist?</h2>
      ${compare()}
    </div></section>
    ${reportBand()}
    ${relatedSec()}
    <dialog class="as-dialog" data-dialog><div class="as-dialog-inner"><button type="button" class="drawer-close" data-close aria-label="Zavřít">${JH.ICON.close}</button><div data-dialog-body></div></div></dialog>`;

  const dlg = qs("[data-dialog]");
  const openChapter = (id) => {
    const i = S.findIndex((s) => s.id === id);
    const s = S[i];
    qs("[data-dialog-body]", dlg).innerHTML = `
      <p class="as-num">${n2(i)} / 06</p><h2 class="h2">${t(s.title)}</h2>
      <div class="prose" style="margin-top:20px">${blocks(s.blocks)}</div>
      <div class="as-steps">${i > 0 ? `<button type="button" class="btn btn--outline" data-open="${S[i - 1].id}">← ${esc(S[i - 1].title)}</button>` : "<span></span>"}
      ${i < S.length - 1 ? `<button type="button" class="btn btn--blue" data-open="${S[i + 1].id}">${esc(S[i + 1].title)} →</button>` : `<a class="btn btn--red" href="nahlasit-incident.html">Nahlaste incident</a>`}</div>`;
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
    qs(".as-dialog-inner", dlg).scrollTop = 0;
  };
  qs('[data-as="b"]').addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]");
    const d = e.target.closest("[data-ddd]");
    if (o) openChapter(o.dataset.open);
    if (e.target.closest("[data-close]") || e.target === dlg) dlg.close();
    if (d) qsa("[data-ddd]").forEach((x) => x.setAttribute("aria-expanded", String(x === d)));
  });

  // ---------- C: průvodce po krocích ----------
  const C = { root: qs('[data-as="c"]'), i: 0 };
  C.root.innerHTML = `
    <section class="section as-c-hero"><div class="container as-c-grid">
      <div><p class="kicker kicker--blue">Klíčové téma · průvodce</p><h1 class="h2" style="margin-top:10px;font-size:clamp(36px,4vw,56px)">Antisemitismus</h1>
        <p class="lead" style="margin-top:14px;color:var(--text)">${t(INTRO)}</p></div>
      ${PHOTO}
    </div></section>
    <div class="as-tabs-bar"><div class="container"><div class="as-tabs" role="tablist" aria-label="Kapitoly">${S.map(
      (s, i) => `<button type="button" role="tab" data-step="${i}"><span>${n2(i)}</span>${esc(s.title)}</button>`,
    ).join("")}</div><div class="as-progress"><span></span></div></div></div>
    <section class="section"><div class="container container--mid" data-step-body></div></section>
    ${reportBand()}
    ${relatedSec()}`;
  C.render = (scroll) => {
    const s = S[C.i];
    qsa("[data-step]", C.root).forEach((b, i) => {
      b.setAttribute("aria-selected", String(i === C.i));
      b.classList.toggle("done", i < C.i);
    });
    qs(".as-progress span", C.root).style.width = `${((C.i + 1) / S.length) * 100}%`;
    qs("[data-step-body]", C.root).innerHTML = `
      <p class="as-num">Kapitola ${n2(C.i)} z 06</p><h2 class="h2">${t(s.title)}</h2>
      <div class="prose" style="margin-top:20px">${blocks(s.blocks)}</div>
      ${s.id === "kritika" ? compare() : ""}
      <div class="as-steps">${C.i > 0 ? `<button type="button" class="btn btn--outline" data-go="${C.i - 1}">← Předchozí</button>` : "<span></span>"}
      ${C.i < S.length - 1 ? `<button type="button" class="btn btn--blue" data-go="${C.i + 1}">Další: ${esc(S[C.i + 1].title)} →</button>` : `<a class="btn btn--red" href="nahlasit-incident.html">Nahlaste incident</a>`}</div>`;
    if (scroll) qs(".as-tabs-bar", C.root).scrollIntoView({ behavior: "smooth" });
  };
  C.root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-step], [data-go]");
    if (!b) return;
    C.i = Number(b.dataset.step ?? b.dataset.go);
    C.render(true);
  });
  C.render(false);
})();
