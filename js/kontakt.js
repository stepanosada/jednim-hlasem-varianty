(() => {
  "use strict";
  const { qs, qsa, esc, t, ICON } = JH;
  const MAIL = "redakce@jednimhlasem.cz";
  const TOPICS = ["Obecný dotaz", "Tip na téma nebo oprava", "Chci psát pro Jedním hlasem", "Média a spolupráce", "Dar a potvrzení o daru"];
  const social = `<div class="social social--lg"><a href="#" aria-label="Facebook">${ICON.fb}</a><a href="#" aria-label="Instagram">${ICON.ig}</a><a href="#" aria-label="X">${ICON.x}</a></div>`;
  const mailRow = `<div class="mail-row"><a href="mailto:${MAIL}">${MAIL}</a><button type="button" class="icon-btn" data-copy="${MAIL}" aria-label="Kopírovat e-mail">${ICON.copy}</button></div>`;

  const form = (id, o = {}) => `
    <form class="form ct-form" data-form novalidate>
      ${o.short ? "" : `<div class="form-row">
        <div class="field"><label for="${id}-name">Jméno</label><input class="input" id="${id}-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="${id}-mail">E-mail</label><input class="input" id="${id}-mail" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="field"><label for="${id}-topic">Téma</label><select class="select input" id="${id}-topic" name="topic" data-topic>${TOPICS.map((x) => `<option>${esc(x)}</option>`).join("")}</select></div>`}
      ${o.short ? `<div class="field"><label for="${id}-mail">Váš e-mail</label><input class="input" id="${id}-mail" name="email" type="email" autocomplete="email" required></div>` : ""}
      <div class="field"><label for="${id}-msg">Zpráva</label><textarea class="textarea" id="${id}-msg" name="message" required placeholder="${o.short ? "Napište, s čím vám můžeme pomoct." : ""}"></textarea></div>
      ${o.short ? "" : `<label class="check"><input type="checkbox" required> <span>${t("Souhlasím se zpracováním údajů pro vyřízení zprávy.")} <a href="#">Ochrana osobních údajů</a></span></label>`}
      <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="sr-only" aria-hidden="true">
      <div class="form-foot"><button class="btn btn--blue" type="submit">Odeslat zprávu</button><span class="muted" style="font-size:14px">${t("Odpovídáme do 3 pracovních dnů.")}</span></div>
      <p class="form-error" data-error hidden>Vyplňte prosím všechna pole.</p>
    </form>`;
  const sent = `<div class="sent">${`<span class="check-circle">${ICON.check}</span>`}<h2 class="h3">Zpráva odešla. Ozveme se.</h2><p class="muted">${t("Odpověď pošleme na e-mail, který jste uvedli (ukázka – v Frameru se odešle přes formulář).")}</p><button type="button" class="link-btn" data-again>Napsat další zprávu</button></div>`;

  // ---------- A ----------
  qs('[data-ct="a"]').innerHTML = `
    <section class="section ct-head"><div class="container">
      <p class="kicker kicker--blue">Kontakt</p>
      <h1 class="h2" style="margin-top:8px;font-size:clamp(36px,4vw,56px)">Napište nám</h1>
      <p class="lead muted" style="margin-top:12px">${t("Máte dotaz, tip na téma nebo našli chybu? Ozvěte se.")}</p>
      <div class="ct-grid">
        <div class="ct-card" data-form-wrap>${form("a")}</div>
        <aside class="ct-side">
          <div class="ct-box"><p class="kicker kicker--blue">Přímý kontakt</p>${mailRow}<p class="muted" style="display:flex;gap:8px;align-items:center;font-size:14px">${ICON.clock.replace("<svg", '<svg width="16" height="16"')}${t("odpovídáme do 3 pracovních dnů")}</p></div>
          <div class="ct-box"><p class="kicker kicker--blue">Sledujte nás</p>${social}</div>
          <a class="ct-box ct-link ct-link--red" href="nahlasit-incident.html"><b>Chcete nahlásit incident?</b><span>${t("Formulář FŽO, e-mail a tísňová linka")}</span></a>
          <a class="ct-box ct-link" href="o-nas.html#zapojte-se"><b>Chcete pro nás psát?</b><span>${t("Jak se zapojit jako autor")}</span></a>
        </aside>
      </div>
    </div></section>`;

  // ---------- B ----------
  const ROUTES = [
    { title: "Tip na téma nebo oprava", text: "Viděli jste dezinformaci nebo chybu v našem textu?", topic: 1 },
    { title: "Chci psát", text: "Analýzy, komentáře i osobní svědectví. Rádi dáme prostor.", href: "o-nas.html#zapojte-se", cta: "Jak se zapojit" },
    { title: "Nahlásit incident", text: "Antisemitismus, výhrůžky, vandalismus.", href: "nahlasit-incident.html", cta: "Kam nahlásit", red: true },
    { title: "Média a spolupráce", text: "Rozhovory, partnerství, kampaně.", topic: 3 },
    { title: "Dar a potvrzení", text: "Potvrzení o daru, trvalý příkaz, otázky k podpoře.", topic: 4 },
    { title: "Něco jiného", text: "Cokoliv dalšího.", topic: 0 },
  ];
  qs('[data-ct="b"]').innerHTML = `
    <section class="section ct-head"><div class="container">
      <p class="kicker kicker--blue">Kontakt</p>
      <h1 class="h2" style="margin-top:8px;font-size:clamp(36px,4vw,56px)">S čím nám píšete?</h1>
      <div class="routes">${ROUTES.map(
        (r, i) => `${r.href ? `<a class="route${r.red ? " route--red" : ""}" href="${r.href}">` : `<button type="button" class="route" data-route="${r.topic}">`}
          <b>${esc(r.title)}</b><span>${t(r.text)}</span><span class="link-arrow">${r.cta || "Napsat"}</span>${r.href ? "</a>" : "</button>"}`,
      ).join("")}</div>
    </div></section>
    <section class="section section--paper" id="formular"><div class="container container--mid">
      <h2 class="h2">Napište nám</h2>
      <div class="ct-card" style="margin-top:24px" data-form-wrap>${form("b")}</div>
      <p class="muted" style="margin-top:20px">Nebo přímo: <a href="mailto:${MAIL}" style="color:var(--blue);font-weight:600">${MAIL}</a></p>
    </div></section>`;
  qs('[data-ct="b"]').addEventListener("click", (e) => {
    const r = e.target.closest("[data-route]");
    if (!r) return;
    const sel = qs('[data-ct="b"] [data-topic]');
    if (sel) sel.selectedIndex = Number(r.dataset.route);
    qs('[data-ct="b"] #formular').scrollIntoView({ behavior: "smooth" });
    setTimeout(() => qs('[data-ct="b"] textarea')?.focus({ preventScroll: true }), 500);
  });

  // ---------- C ----------
  qs('[data-ct="c"]').innerHTML = `
    <section class="section ct-min"><div class="container container--narrow">
      <p class="kicker kicker--blue">Kontakt</p>
      <h1 class="h2" style="margin-top:8px;font-size:clamp(36px,4vw,56px)">Napište nám. Ozveme se.</h1>
      <div class="big-mail">${mailRow}</div>
      <div class="ct-card" style="margin-top:32px" data-form-wrap>${form("c", { short: true })}</div>
      <div class="ct-min-foot">${social}<span class="muted">${t("Incident? ")}<a href="nahlasit-incident.html">Nahlaste ho tady</a></span></div>
    </div></section>`;

  // Odeslání (ukázka)
  document.querySelector("main").addEventListener("submit", (e) => {
    if (!e.target.matches("[data-form]")) return;
    e.preventDefault();
    const f = e.target;
    const ok = f.checkValidity();
    qs("[data-error]", f).hidden = ok;
    if (!ok) {
      qsa(":invalid", f)[0]?.focus();
      return;
    }
    f.closest("[data-form-wrap]").innerHTML = sent;
  });
  document.querySelector("main").addEventListener("click", (e) => {
    if (!e.target.closest("[data-again]")) return;
    const wrap = e.target.closest("[data-form-wrap]");
    const v = wrap.closest("[data-ct]").dataset.ct;
    wrap.innerHTML = form(v, { short: v === "c" });
  });
})();
