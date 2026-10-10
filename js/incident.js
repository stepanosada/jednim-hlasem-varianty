(() => {
  "use strict";
  const { qs, qsa, esc, t, ICON } = JH;
  const I = JH.INCIDENT;
  const TITLE = "Nahlaste nenávist, než zdomácní";
  const CLOSE = `<div class="inc-close"><p>${t("Antisemitismus roste tam, kde mlčíme.")}</p><span>${t("Ticho není neutrální.")}</span></div>`;

  const channels = (o = {}) => `
    <div class="channels${o.stack ? " channels--stack" : ""}">
      <a class="channel channel--main" href="${I.form}" target="_blank" rel="noreferrer">
        <span class="channel-ico">${ICON.ext}</span>
        <span><b>Formulář Federace židovských obcí</b><span>${t("Oficiální hlášení antisemitského incidentu. Doporučujeme.")}</span></span>
        <span class="btn btn--red btn--sm">Otevřít formulář</span>
      </a>
      <div class="channel">
        <span class="channel-ico">${ICON.mail}</span>
        <span><b>E-mail FŽO</b><span>${I.email}</span></span>
        <span class="channel-actions"><a class="btn btn--outline btn--sm" href="mailto:${I.email}">Napsat</a><button type="button" class="icon-btn" data-copy="${I.email}" aria-label="Kopírovat e-mail">${ICON.copy}</button></span>
      </div>
      <a class="channel channel--urgent" href="tel:112">
        <span class="channel-ico">${ICON.phone}</span>
        <span><b>Tísňová linka 112</b><span>${t("Při ohrožení života, zdraví nebo majetku.")}</span></span>
        <span class="btn btn--outline btn--sm">Volat 112</span>
      </a>
    </div>`;

  const checklist = (interactive) => `<ul class="checklist">${I.checklist
    .map((c, i) => (interactive ? `<li><label class="check"><input type="checkbox" data-chk> <span>${t(c)}</span></label></li>` : `<li>${ICON.check}<span>${t(c)}</span></li>`))
    .join("")}</ul>`;
  const gallery = (items) => `<div class="inc-gallery">${items.map((g) => `<figure class="inc-item"><img src="${g.img}" alt="${esc(g.title)}" loading="lazy"><figcaption><span class="tag tag--red">${esc(g.chip)}</span><b>${t(g.title)}</b></figcaption></figure>`).join("")}</div>`;

  // ---------- A ----------
  qs('[data-inc="a"]').innerHTML = `
    <section class="section inc-hero"><div class="container">
      <p class="kicker" style="color:var(--red);font-weight:600">Nahlásit incident</p>
      <h1 class="h2" style="margin-top:10px;font-size:clamp(36px,4vw,56px)">${t(TITLE)}</h1>
      <p class="lead" style="margin-top:16px;max-width:40em;color:var(--text)">${t(I.intro)}</p>
      <div style="margin-top:36px">${channels()}</div>
    </div></section>
    <section class="section section--paper"><div class="container inc-two">
      <div><h2 class="h2">Co si připravit</h2><p class="muted" style="margin-top:8px">${t("Čím víc podrobností, tím lépe se dá incident ověřit a zařadit.")}</p>${checklist(false)}</div>
      <div class="prose" style="margin-top:0"><h2 style="margin-top:0">Proč na tom záleží</h2>${I.why.map((p) => `<p>${t(p)}</p>`).join("")}</div>
    </div></section>
    <section class="section"><div class="container">
      <div class="section-head"><div><h2 class="h2">Takhle vypadá antisemitismus u nás</h2><p>${t("Ukázky incidentů ve veřejném prostoru, na sítích i v soukromých výhrůžkách.")}</p></div></div>
      ${gallery(I.gallery)}
      ${CLOSE}
    </div></section>`;

  // ---------- B ----------
  qs('[data-inc="b"]').innerHTML = `
    <div class="urgent-bar"><div class="container">${ICON.phone}<span><strong>Jste v ohrožení?</strong> ${t("Volejte hned tísňovou linku.")}</span><a class="btn btn--white btn--sm" href="tel:112">Volat 112</a></div></div>
    <section class="section"><div class="container container--mid">
      <p class="kicker" style="color:var(--red);font-weight:600">Nahlásit incident</p>
      <h1 class="h2" style="margin-top:10px;font-size:clamp(36px,4vw,52px)">${t(TITLE)}</h1>
      <p class="lead" style="margin-top:14px;color:var(--text)">${t(I.intro)}</p>
      <ol class="guide">
        <li class="guide-step"><h2><span>1</span>Co se stalo?</h2>
          <div class="type-grid" role="group" aria-label="Typ incidentu">${I.types.map((x) => `<button type="button" class="type-btn${x.urgent ? " type-btn--urgent" : ""}" data-type="${x.id}" aria-pressed="false">${esc(x.label)}</button>`).join("")}</div>
          <div class="type-tip" data-tip hidden></div>
        </li>
        <li class="guide-step"><h2><span>2</span>Připravte si podklady</h2>${checklist(true)}<p class="muted chk-count" data-chk-count>0 z ${I.checklist.length} připraveno</p></li>
        <li class="guide-step"><h2><span>3</span>Nahlaste to</h2>${channels({ stack: true })}</li>
      </ol>
    </div></section>
    <section class="section section--paper"><div class="container container--mid">
      <h2 class="h2">Časté otázky</h2>
      <div class="dfaq" style="margin-top:20px">
        <details><summary>${t("Nejsem si jistý/á, jestli jde o antisemitismus. Mám to hlásit?")}</summary><p>${t("Ano. Posouzení nechte na odbornících. I případ, který se nakonec nezařadí, pomáhá zachytit, co se ve společnosti děje.")}</p></details>
        <details><summary>${t("Mám se obrátit i na policii?")}</summary><p>${t("Pokud mohlo jít o trestný čin – útok, výhrůžky, poškození majetku – obraťte se i na Policii ČR. Hlášení FŽO policejní oznámení nenahrazuje.")}</p></details>
        <details><summary>${t("Proč hlásit i drobnosti?")}</summary><p>${t(I.why[2])}</p></details>
      </div>
      ${CLOSE}
    </div></section>`;

  const B = qs('[data-inc="b"]');
  B.addEventListener("click", (e) => {
    const b = e.target.closest("[data-type]");
    if (!b) return;
    qsa("[data-type]", B).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const type = I.types.find((x) => x.id === b.dataset.type);
    const tip = qs("[data-tip]", B);
    tip.hidden = false;
    tip.className = `type-tip${type.urgent ? " type-tip--urgent" : ""}`;
    tip.innerHTML = `${ICON.info}<p>${t(type.tip)}</p>${type.urgent ? '<a class="btn btn--red btn--sm" href="tel:112">Volat 112</a>' : ""}`;
  });
  B.addEventListener("change", () => {
    const n = qsa("[data-chk]:checked", B).length;
    qs("[data-chk-count]", B).textContent = `${n} z ${I.checklist.length} připraveno${n === I.checklist.length ? " – můžete hlásit" : ""}`;
  });

  // ---------- C ----------
  const chips = ["Vše", ...new Set(I.gallery.map((g) => (g.chip.includes("Praha") ? "Praha" : g.chip)))];
  qs('[data-inc="c"]').innerHTML = `
    <section class="photo-hero inc-c-hero tail">
      <img class="bg" src="assets/nahlas-nenavist.jpg" alt="">
      <div class="container"><p class="kicker">Dokumentujeme</p><h1 class="h1" style="margin-top:12px;max-width:12em">${t(TITLE)}</h1></div>
    </section>
    <div class="container inc-c">
      <div>
        <p class="lead" style="color:var(--ink)">${t(I.intro)}</p>
        <div class="prose" style="margin-top:20px">${I.why.map((p) => `<p>${t(p)}</p>`).join("")}</div>
        <h2 class="h2" style="margin-top:56px">Archiv incidentů</h2>
        <div class="pills" style="margin-top:18px" role="group" aria-label="Filtr">${chips.map((c, i) => `<button type="button" class="pill" data-chip="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join("")}</div>
        <div style="margin-top:24px" data-gallery>${gallery(I.gallery)}</div>
        ${CLOSE}
      </div>
      <aside class="inc-aside">
        <p class="kicker" style="color:var(--red);font-weight:600">Kam nahlásit</p>
        ${channels({ stack: true })}
        <p class="kicker kicker--blue" style="margin-top:24px">Připravte si</p>
        ${checklist(false)}
      </aside>
    </div>`;
  const C = qs('[data-inc="c"]');
  C.addEventListener("click", (e) => {
    const c = e.target.closest("[data-chip]");
    if (!c) return;
    qsa("[data-chip]", C).forEach((x) => x.setAttribute("aria-pressed", String(x === c)));
    const v = c.dataset.chip;
    qs("[data-gallery]", C).innerHTML = gallery(v === "Vše" ? I.gallery : I.gallery.filter((g) => g.chip.includes(v)));
  });
})();
