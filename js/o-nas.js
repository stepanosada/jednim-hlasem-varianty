(() => {
  "use strict";
  const { qs, esc, t } = JH;
  const MAIL = "info@jednimhlasem.cz";
  const Z = JH.ZAPOJTE;
  const n2 = (i) => String(i + 1).padStart(2, "0");
  const pillarsHTML = (cls = "") => `<div class="pillars ${cls}">${JH.PILLARS.map((p, i) => `<div class="pillar"><span class="pillar-n">${n2(i)}</span><h3>${esc(p.title)}</h3><p>${t(p.text)}</p></div>`).join("")}</div>`;
  const axisCard = (x) => `<a class="axis" href="clanek.html?slug=${x.slug}"><img src="${x.img}" alt="" loading="lazy"><span class="axis-body"><span class="kicker kicker--blue">${esc(x.kicker)}</span><b>${t(x.title)}</b><span>${t(x.text)}</span><span class="link-arrow">Číst článek</span></span></a>`;
  const joinCTA = () => `<div class="join-cta"><a class="btn btn--blue" href="mailto:${MAIL}">Napsat na ${MAIL}</a><a class="btn btn--outline" href="kontakt.html">Kontaktní formulář</a></div>`;

  // ---------- A ----------
  qs('[data-on="a"]').innerHTML = `
    <section class="photo-hero on-hero tail">
      <img class="bg" src="assets/o-nas-vlajka.jpg" alt="" style="object-position:70% 40%">
      <div class="container">
        <p class="kicker">O nás</p>
        <h1 class="h1" style="margin-top:12px;max-width:15em;font-size:clamp(32px,3.6vw,52px)">${t(JH.INTRO.title)}</h1>
        <p class="lead" style="margin-top:18px;max-width:36em">${t(JH.INTRO.text)}</p>
        <nav class="pills" style="margin-top:28px" aria-label="Sekce stránky">
          ${[["#hodnoty", "Naše hodnoty"], ["#osy", "O čem mluvíme"], ["#mise", "Naše mise"], ["#zapojte-se", "Zapojte se"]].map(([h, l]) => `<a class="pill pill--glass" href="${h}">${l}</a>`).join("")}
        </nav>
      </div>
    </section>
    <section class="section"><div class="container">
      <h2 class="h2">Co nás drží</h2>
      ${pillarsHTML()}
    </div></section>
    <section class="section section--paper" id="hodnoty"><div class="container">
      <h2 class="h2">Naše hodnoty</h2>
      <ul class="values">${JH.VALUES.map((v) => `<li>${t(v)}</li>`).join("")}</ul>
    </div></section>
    <section class="section" id="osy"><div class="container">
      <div class="section-head"><div><h2 class="h2">O čem mluvíme</h2><p>${t("Osy, které nás vedou. Každá vede na článek, který téma otevírá.")}</p></div></div>
      <div class="axes">${JH.AXES.map(axisCard).join("")}</div>
    </div></section>
    <section class="section section--paper"><div class="container">
      <h2 class="h2">Co děláme</h2>
      <div class="dos">${JH.WHAT_WE_DO.map((d) => `<div><b>${esc(d.verb)}</b> ${t(d.text)}</div>`).join("")}</div>
    </div></section>
    <section class="section section--blue tail tail--paper" id="mise"><div class="container container--mid">
      <p class="kicker">Naše mise</p>
      <blockquote class="mission">${t(JH.MISSION[0])}</blockquote>
      <p class="lead" style="margin-top:20px;color:rgba(255,255,255,0.88)">${t(JH.MISSION[1])}</p>
    </div></section>
    <section class="section" id="zapojte-se"><div class="container join-a">
      <div><p class="kicker kicker--blue">Zapojte se</p><h2 class="h2" style="margin-top:8px">${t("Máte co říct? Napište to.")}</h2></div>
      <div><p class="lead" style="color:var(--text)">${t(Z.lead)}</p>${joinCTA()}</div>
    </div></section>
    <section class="section section--tight"><div class="container">${JH.supportStrip()}</div></section>`;

  // ---------- B ----------
  const chapters = [
    { id: "hodnoty", title: "Hodnoty", body: `<ul class="plain-list">${JH.VALUES.map((v) => `<li>${t(v)}</li>`).join("")}</ul>` },
    { id: "osy", title: "O čem mluvíme", body: `<ul class="axis-list">${JH.AXES.map((x) => `<li><a href="clanek.html?slug=${x.slug}"><span class="kicker kicker--blue">${esc(x.kicker)}</span><b>${t(x.title)}</b><span>${t(x.text)}</span></a></li>`).join("")}</ul>` },
    { id: "co-delame", title: "Co děláme", body: `<div class="plain-list">${JH.WHAT_WE_DO.map((d) => `<p><b>${esc(d.verb)}</b> ${t(d.text)}</p>`).join("")}</div>` },
    { id: "mise", title: "Mise", body: `<p class="big-quote">${t(JH.MISSION[0])}</p><p style="margin-top:20px">${t(JH.MISSION[1])}</p>` },
    { id: "zapojte-se", title: "Zapojte se", body: `<p>${t(Z.lead)}</p><ol class="steps-list">${Z.start.map((s) => `<li>${t(s)}</li>`).join("")}</ol><p class="muted" style="margin-top:12px">${t(Z.pseudo)}</p>${joinCTA()}` },
  ];
  qs('[data-on="b"]').innerHTML = `
    <section class="section manifesto"><div class="container">
      <p class="kicker kicker--blue">O nás</p>
      <h1 class="manifesto-title">${t(JH.INTRO.title)}</h1>
      <p class="lead" style="margin-top:28px;max-width:44em;color:var(--text)">${t(JH.INTRO.text)}</p>
      ${pillarsHTML("pillars--line")}
    </div></section>
    ${chapters
      .map(
        (c, i) => `<section class="section ${i % 2 ? "section--paper" : ""}" id="${c.id}"><div class="container chapter">
          <div class="chapter-head"><span class="as-num">${n2(i)}</span><h2 class="h2">${esc(c.title)}</h2></div>
          <div class="chapter-body">${c.body}</div>
        </div></section>`,
      )
      .join("")}`;

  // ---------- C ----------
  qs('[data-on="c"]').innerHTML = `
    <section class="section--blue tail c-on-hero"><div class="container">
      <p class="kicker">O nás</p>
      <h1 class="h1" style="margin-top:12px;max-width:16em;font-size:clamp(32px,3.6vw,52px)">${t(JH.INTRO.title)}</h1>
      <p class="lead" style="margin-top:18px;max-width:40em;color:rgba(255,255,255,0.88)">${t(JH.INTRO.text)}</p>
    </div></section>
    <div class="container" style="position:relative;z-index:3;margin-top:calc(-1 * clamp(56px,6vw,90px))">${pillarsHTML("pillars--cards")}</div>
    <section class="section" id="osy"><div class="container">
      <div class="section-head"><div><h2 class="h2">O čem mluvíme</h2><p>${t("Posuňte do strany. Každá osa vede na úvodní článek.")}</p></div>
        <div class="carousel-nav"><button type="button" class="icon-btn" data-scroll="-1" aria-label="Předchozí">←</button><button type="button" class="icon-btn" data-scroll="1" aria-label="Další">→</button></div></div>
      <div class="carousel" data-carousel>${JH.AXES.map(axisCard).join("")}</div>
    </div></section>
    <section class="section section--paper" id="mise"><div class="container mission-c">
      <img src="assets/hero/o-nas-v2.webp" alt="" loading="lazy">
      <div><p class="kicker kicker--blue">Proč to děláme</p><p class="big-quote" style="margin-top:12px">${t(JH.MISSION[0])}</p><p style="margin-top:18px;color:var(--text)">${t(JH.MISSION[1])}</p>
        <ul class="values values--compact">${JH.VALUES.map((v) => `<li>${t(v)}</li>`).join("")}</ul></div>
    </div></section>
    <section class="section" id="zapojte-se"><div class="container">
      <div class="section-head"><div><p class="kicker kicker--blue">Zapojte se</p><h2 class="h2" style="margin-top:8px">${t("Každý nový autor je další hlas, který nejde přehlédnout.")}</h2><p>${t(Z.lead)}</p></div></div>
      <div class="join-grid">
        <div class="join-card"><h3>Koho hledáme</h3><ul>${Z.koho.map((x) => `<li>${t(x)}</li>`).join("")}</ul></div>
        <div class="join-card"><h3>Co můžete psát</h3><ul>${Z.psat.map((x) => `<li>${t(x)}</li>`).join("")}</ul></div>
        <div class="join-card join-card--blue"><h3>Jak začít</h3><ol>${Z.start.map((x) => `<li>${t(x)}</li>`).join("")}</ol><p style="margin-top:14px;opacity:0.85;font-size:14px">${t(Z.pseudo)}</p><a class="btn btn--gold btn--wide" style="margin-top:18px" href="mailto:${MAIL}">Poslat námět</a></div>
      </div>
    </div></section>
    <section class="section section--tight"><div class="container">${JH.newsletter({ id: "onas", light: true })}</div></section>`;
  qs('[data-on="c"]').addEventListener("click", (e) => {
    const b = e.target.closest("[data-scroll]");
    if (!b) return;
    const c = qs("[data-carousel]");
    c.scrollBy({ left: Number(b.dataset.scroll) * c.clientWidth * 0.8, behavior: "smooth" });
  });
})();
