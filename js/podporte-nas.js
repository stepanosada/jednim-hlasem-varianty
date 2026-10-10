/* Podpořte nás – tři varianty formuláře daru (A, B, C). Bez buildu, čisté JS. */
(() => {
  "use strict";

  // Zástupné údaje – před spuštěním doplní klientka.
  const BANK = {
    account: "2301987654 / 2010",
    iban: "CZ65 2010 0000 0023 0198 7654",
    vs: "2026",
    msg: "Dar Jedním hlasem",
    msgAscii: "DAR JEDNIM HLASEM",
  };

  const TIERS = {
    monthly: [
      { amt: 150, name: "Hlas", impact: "Pomůžete pokrýt provoz webu a ověřování zdrojů." },
      { amt: 300, name: "Podporovatel", rec: true, impact: "Udržíte jednu analýzu měsíčně – od rešerše po publikaci." },
      { amt: 800, name: "Patron", impact: "Pokryjete měsíc provozu webu a sociálních sítí." },
    ],
    once: [
      { amt: 300, name: "Hlas", impact: "Zaplatíte ověření faktů k jednomu článku." },
      { amt: 900, name: "Podporovatel", rec: true, impact: "Umožníte jednu celou analýzu – od rešerše po publikaci." },
      { amt: 2500, name: "Patron", impact: "Pokryjete měsíc provozu webu a sociálních sítí." },
    ],
  };
  const CUSTOM_IMPACT = "Každá koruna jde na obsah, ne na reklamu.";
  const MIN_AMOUNT = 50;
  const FREQ_LABEL = { monthly: "měsíčně", once: "jednorázově" };

  const ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 3 4.5 6.9 4.5c2.1 0 3.6 1.1 5.1 3 1.5-1.9 3-3 5.1-3 3.9 0 6 4 4.5 7.3C19.5 16.4 12 21 12 21z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  };

  const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
  const fmt = (n) => `${n.toLocaleString("cs-CZ")} Kč`;

  // ---------- Stav daru (každá varianta má vlastní) ----------
  function createState() {
    return {
      freq: "monthly",
      idx: 1,
      custom: "",
      amount() {
        if (this.idx >= 0) return TIERS[this.freq][this.idx].amt;
        const n = Math.round(Number(String(this.custom).replace(/\s/g, "").replace(",", ".")));
        return Number.isFinite(n) && n >= MIN_AMOUNT ? n : 0;
      },
      impact() {
        return this.idx >= 0 ? TIERS[this.freq][this.idx].impact : CUSTOM_IMPACT;
      },
      setFreq(f) {
        this.freq = f;
        this.idx = TIERS[f].findIndex((t) => t.rec);
        this.custom = "";
      },
    };
  }

  // ---------- QR platba (SPD) ----------
  function spd(amount) {
    const iban = BANK.iban.replace(/\s/g, "");
    return `SPD*1.0*ACC:${iban}*AM:${amount.toFixed(2)}*CC:CZK*X-VS:${BANK.vs}*MSG:${BANK.msgAscii}`;
  }
  function qrMatrix(payload) {
    const qr = qrcode(0, "M");
    qr.addData(payload);
    qr.make();
    return qr;
  }
  function qrSvg(amount) {
    if (!amount) return '<p class="qr-caption" style="display:grid;place-items:center;height:100%">Zadejte částku</p>';
    const qr = qrMatrix(spd(amount));
    const n = qr.getModuleCount();
    let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" role="img" aria-label="QR platba ${fmt(amount)}"><path fill="#0b1a3a" d="${d}"/></svg>`;
  }
  function downloadQr(amount) {
    if (!amount) return;
    const qr = qrMatrix(spd(amount));
    const n = qr.getModuleCount();
    const scale = 12;
    const pad = 4 * scale;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = n * scale + pad * 2;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect(pad + c * scale, pad + r * scale, scale, scale);
    const a = document.createElement("a");
    a.download = `qr-dar-jednim-hlasem-${amount}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    toast("QR kód uložen – nahrajte ho v bankovní aplikaci");
  }

  // ---------- Sdílené kousky HTML ----------
  function segHTML(s) {
    return ["monthly", "once"]
      .map((f) => `<button type="button" data-freq="${f}" aria-pressed="${s.freq === f}">${f === "monthly" ? "Měsíčně" : "Jednorázově"}</button>`)
      .join("");
  }

  function amountsHTML(s) {
    const tiers = TIERS[s.freq]
      .map(
        (t, i) => `<button type="button" class="amount" data-idx="${i}" aria-pressed="${s.idx === i}">
          ${t.rec ? '<span class="badge">Nejčastější</span>' : ""}
          <b>${fmt(t.amt)}</b><small>${t.name}</small>
        </button>`,
      )
      .join("");
    const custom = `<div class="amount amount--custom" data-custom-box aria-pressed="${s.idx === -1}">
        <label for="${s.id}-custom">Jiná částka</label>
        <span class="field"><input id="${s.id}-custom" data-custom inputmode="numeric" autocomplete="off" placeholder="500" value="${s.custom}" /><span class="unit">Kč</span></span>
      </div>`;
    return `<div class="amounts">${tiers}${custom}</div>`;
  }

  function impactHTML(s) {
    return `${ICON.heart}<span>${s.impact()}</span>`;
  }

  function copyBtn(value, label) {
    return `<button type="button" class="copy" data-copy="${value}" aria-label="Kopírovat ${label}">${ICON.copy}<span>Kopírovat</span></button>`;
  }

  function detailsHTML(amount, { iban = false } = {}) {
    const rows = [
      ["Účet", BANK.account, BANK.account.replace(/\s/g, "")],
      iban ? ["IBAN", BANK.iban, BANK.iban.replace(/\s/g, "")] : null,
      ["Částka", amount ? fmt(amount) : "—", amount ? String(amount) : ""],
      ["VS", BANK.vs, BANK.vs],
      ["Zpráva", BANK.msg, BANK.msg],
    ].filter(Boolean);
    return `<dl class="details">${rows
      .map(([k, v, raw]) => `<div><dt>${k}</dt><dd>${v}</dd>${raw ? copyBtn(raw, k) : "<span></span>"}</div>`)
      .join("")}</dl>`;
  }

  function qrBoxHTML(amount) {
    return `<div class="qr-box">
        <div class="qr">${qrSvg(amount)}</div>
        <p class="qr-caption">${isMobile() ? "Platíte z jiného zařízení?<br>Naskenujte QR." : "Naskenujte v&nbsp;bankovní aplikaci"}</p>
        ${isMobile() && amount ? `<button type="button" class="qr-dl" data-qr-dl="${amount}">Uložit QR do galerie</button>` : ""}
      </div>`;
  }

  function monthlyNoteHTML(s) {
    if (s.freq !== "monthly") return "";
    return `<p class="dnote">${ICON.info}<span><strong>Měsíční dar = trvalý příkaz.</strong> QR zadá první platbu. V&nbsp;bance u&nbsp;ní pak zvolte „opakovat měsíčně“, nebo založte trvalý příkaz se stejnými údaji.</span></p>`;
  }

  const TRUST = [
    "Bez grantů, státních peněz a reklam",
    "Měsíční dar zrušíte kdykoliv v bance",
    "Potvrzení o daru vám vystavíme",
  ];

  // ---------- Varianta A: vše v jedné kartě v hero ----------
  function variantA(root) {
    const s = createState();
    s.id = "a";

    function render() {
      root.innerHTML = `
        <div class="stack">
          <h2 class="dcard-title">Váš dar</h2>
          <div class="seg" role="group" aria-label="Frekvence daru">${segHTML(s)}</div>
          ${amountsHTML(s)}
          <div class="impact" data-slot="impact">${impactHTML(s)}</div>
        </div>
        <hr class="divider" />
        <div class="stack">
          <p class="kicker" style="color:var(--blue);font-weight:600">Pošlete převodem</p>
          <div data-slot="pay"></div>
          <p class="fineprint">Žádná platební brána, žádné poplatky. Celá částka jde nám.</p>
        </div>`;
      refresh();
    }

    function refresh() {
      const amount = s.amount();
      root.querySelector('[data-slot="impact"]').innerHTML = impactHTML(s);
      const pay = isMobile()
        ? `${detailsHTML(amount)}<div style="margin-top:16px">${qrBoxHTML(amount)}</div>`
        : `<div class="pay">${qrBoxHTML(amount)}${detailsHTML(amount)}</div>`;
      root.querySelector('[data-slot="pay"]').innerHTML = `${pay}<div style="margin-top:14px">${monthlyNoteHTML(s)}</div>`;
      syncPressed(root, s);
    }

    bindAmountEvents(root, s, render, refresh);
    render();
    return { rerender: render };
  }

  // ---------- Varianta B: průvodce ve 3 krocích ----------
  function variantB(root) {
    const s = createState();
    s.id = "b";
    s.step = 1;
    s.tab = isMobile() ? "details" : "qr";

    const stepsHTML = () =>
      `<ol class="dsteps">${["Částka", "Platba", "Hotovo"]
        .map((l, i) => `<li class="${i + 1 === s.step ? "on" : i + 1 < s.step ? "done" : ""}">${i + 1}. ${l}</li>`)
        .join("")}</ol>`;

    function ctaLabel() {
      const a = s.amount();
      return a ? `Pokračovat · ${fmt(a)} ${FREQ_LABEL[s.freq]}` : `Zadejte částku (min. ${MIN_AMOUNT} Kč)`;
    }

    function render() {
      if (s.step === 1) {
        root.innerHTML = `${stepsHTML()}
          <div class="stack">
            <h2 class="dcard-title">Kolik chcete darovat?</h2>
            <div class="seg" role="group" aria-label="Frekvence daru">${segHTML(s)}</div>
            ${amountsHTML(s)}
            <div class="impact" data-slot="impact">${impactHTML(s)}</div>
            <button type="button" class="btn btn--gold btn--wide" data-next data-slot="cta">${ctaLabel()}</button>
            <p class="fineprint">Převodem nebo QR platbou. Bez poplatků.</p>
          </div>`;
      } else if (s.step === 2) {
        const a = s.amount();
        const qrPanel = `<div class="qr-solo">
            <div class="qr">${qrSvg(a)}</div>
            <ol class="howto">
              <li>Otevřete bankovní aplikaci.</li>
              <li>Zvolte platbu QR kódem a naskenujte.</li>
              <li>Zkontrolujte částku a potvrďte.</li>
              ${s.freq === "monthly" ? "<li>Nastavte opakování měsíčně.</li>" : ""}
            </ol>
          </div>
          ${isMobile() ? `<button type="button" class="qr-dl" data-qr-dl="${a}" style="margin-top:10px">Uložit QR do galerie</button>` : ""}`;
        root.innerHTML = `${stepsHTML()}
          <div class="stack">
            <div class="summary">
              <span><b>${fmt(a)}</b> ${FREQ_LABEL[s.freq]}</span>
              <button type="button" class="link-btn" data-back>Změnit</button>
            </div>
            <div class="dtabs" role="tablist">
              <button type="button" role="tab" data-tab="qr" aria-selected="${s.tab === "qr"}">QR kód</button>
              <button type="button" role="tab" data-tab="details" aria-selected="${s.tab === "details"}">Údaje k převodu</button>
            </div>
            <div class="tabpanel" ${s.tab === "qr" ? "" : "hidden"}>${qrPanel}</div>
            <div class="tabpanel" ${s.tab === "details" ? "" : "hidden"}>${detailsHTML(a, { iban: true })}</div>
            ${monthlyNoteHTML(s)}
            <button type="button" class="btn btn--blue btn--wide" data-done>Hotovo – platba je zadaná</button>
          </div>`;
      } else {
        root.innerHTML = `${stepsHTML()}
          <div class="thanks">
            <div class="check">${ICON.check}</div>
            <h3>Děkujeme!</h3>
            <p>Váš hlas je teď o&nbsp;kus silnější. Jakmile platba dorazí, pošleme ji tam, kde je potřeba nejvíc.</p>
            <div class="share">
              <button type="button" class="btn btn--outline" data-share>Sdílet stránku</button>
              <a class="btn btn--outline" href="#">Potvrzení o daru</a>
            </div>
            <p style="margin-top:16px"><button type="button" class="link-btn" data-restart>Darovat znovu</button></p>
          </div>`;
      }
      if (s.step === 1) syncPressed(root, s);
    }

    function refresh() {
      root.querySelector('[data-slot="impact"]').innerHTML = impactHTML(s);
      const cta = root.querySelector('[data-slot="cta"]');
      cta.textContent = ctaLabel();
      cta.disabled = !s.amount();
      syncPressed(root, s);
    }

    root.addEventListener("click", (e) => {
      const t = e.target.closest("button");
      if (!t) return;
      if (t.hasAttribute("data-next") && s.amount()) go(2);
      else if (t.hasAttribute("data-back")) go(1);
      else if (t.hasAttribute("data-done")) go(3);
      else if (t.hasAttribute("data-restart")) go(1);
      else if (t.dataset.tab) {
        s.tab = t.dataset.tab;
        render();
      } else if (t.hasAttribute("data-share")) share();
    });

    function go(step) {
      s.step = step;
      render();
      const first = root.querySelector("h2, .summary, h3");
      if (first && isMobile()) root.scrollIntoView({ block: "start", behavior: "smooth" });
    }

    bindAmountEvents(root, s, render, refresh);
    render();
    return { rerender: render };
  }

  // ---------- Varianta C: úrovně podpory + postranní panel ----------
  function variantC(section) {
    const s = createState();
    s.id = "c";
    const seg = section.querySelector("[data-freq-seg]");
    const tiersEl = section.querySelector('[data-widget="c"]');
    const drawer = section.querySelector("[data-drawer]");
    let lastFocus = null;

    function renderTiers() {
      seg.innerHTML = segHTML(s);
      const per = FREQ_LABEL[s.freq];
      tiersEl.innerHTML =
        TIERS[s.freq]
          .map(
            (t, i) => `<article class="tier${t.rec ? " tier--rec" : ""}">
              <span class="ttag">${t.rec ? "Nejčastější" : t.name}</span>
              <div class="price">${fmt(t.amt)}</div>
              <div class="per">${per}${t.rec ? ` · ${t.name}` : ""}</div>
              <p>${t.impact}</p>
              <button type="button" class="btn ${t.rec ? "btn--gold" : "btn--outline"} btn--wide" data-pick="${i}">Podpořit</button>
            </article>`,
          )
          .join("") +
        `<article class="tier tier--custom">
          <span class="ttag">Vlastní částka</span>
          <label class="field" for="c-custom"><input id="c-custom" data-custom inputmode="numeric" autocomplete="off" placeholder="500" value="${s.custom}" aria-label="Vlastní částka v Kč" /><span class="unit">Kč</span></label>
          <div class="per">${per}</div>
          <p>${CUSTOM_IMPACT}</p>
          <button type="button" class="btn btn--outline btn--wide" data-pick="-1">Podpořit</button>
        </article>`;
    }

    function renderDrawer() {
      const a = s.amount();
      const qr = `<div class="qr-solo"><div class="qr">${qrSvg(a)}</div>
          <p class="qr-caption">${isMobile() ? "Platíte z jiného zařízení? Naskenujte QR." : "Naskenujte v&nbsp;bankovní aplikaci"}</p>
          ${isMobile() ? `<button type="button" class="qr-dl" data-qr-dl="${a}">Uložit QR do galerie</button>` : ""}</div>`;
      const details = detailsHTML(a, { iban: true });
      drawer.innerHTML = `
        <div class="drawer-head">
          <h2 class="dcard-title" id="drawer-title">Váš dar</h2>
          <button type="button" class="drawer-close" data-drawer-close aria-label="Zavřít">${ICON.close}</button>
        </div>
        <div class="stack" style="margin-top:18px">
          <div class="summary"><span><b>${fmt(a)}</b> ${FREQ_LABEL[s.freq]}</span><button type="button" class="link-btn" data-drawer-close>Změnit</button></div>
          ${isMobile() ? details + qr : qr + details}
          ${monthlyNoteHTML(s)}
          <p class="fineprint">Žádná platební brána, žádné poplatky. Celá částka jde nám.</p>
        </div>`;
    }

    function open() {
      if (!s.amount()) {
        toast(`Zadejte částku (min. ${MIN_AMOUNT} Kč)`);
        section.querySelector("[data-custom]")?.focus();
        return;
      }
      lastFocus = document.activeElement;
      renderDrawer();
      document.body.classList.add("drawer-open");
      document.body.style.overflow = "hidden";
      drawer.querySelector(".drawer-close").focus();
    }
    function close() {
      document.body.classList.remove("drawer-open");
      document.body.style.overflow = "";
      lastFocus?.focus();
    }

    seg.addEventListener("click", (e) => {
      const b = e.target.closest("[data-freq]");
      if (!b) return;
      s.setFreq(b.dataset.freq);
      renderTiers();
    });
    tiersEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-pick]");
      if (!b) return;
      s.idx = Number(b.dataset.pick);
      if (s.idx >= 0) s.custom = "";
      open();
    });
    tiersEl.addEventListener("input", (e) => {
      if (e.target.matches("[data-custom]")) s.custom = e.target.value.replace(/[^\d\s]/g, "");
    });
    tiersEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.matches("[data-custom]")) {
        s.idx = -1;
        open();
      }
    });
    section.addEventListener("click", (e) => {
      if (e.target.closest("[data-drawer-close]")) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("drawer-open")) close();
    });

    renderTiers();
    return { rerender: () => (document.body.classList.contains("drawer-open") ? renderDrawer() : renderTiers()), close };
  }

  // ---------- Události výběru částky (A, B) ----------
  function bindAmountEvents(root, s, render, refresh) {
    root.addEventListener("click", (e) => {
      const f = e.target.closest("[data-freq]");
      if (f) {
        s.setFreq(f.dataset.freq);
        render();
        return;
      }
      const a = e.target.closest("[data-idx]");
      if (a) {
        s.idx = Number(a.dataset.idx);
        s.custom = "";
        const input = root.querySelector("[data-custom]");
        if (input) input.value = "";
        refresh();
        return;
      }
      if (e.target.closest("[data-custom-box]")) root.querySelector("[data-custom]")?.focus();
    });
    root.addEventListener("focusin", (e) => {
      if (e.target.matches("[data-custom]") && s.idx !== -1) {
        s.idx = -1;
        refresh();
      }
    });
    root.addEventListener("input", (e) => {
      if (!e.target.matches("[data-custom]")) return;
      const clean = e.target.value.replace(/[^\d\s]/g, "");
      if (clean !== e.target.value) e.target.value = clean;
      s.custom = clean;
      s.idx = -1;
      refresh();
    });
  }

  function syncPressed(root, s) {
    root.querySelectorAll("[data-idx]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.idx) === s.idx)));
    root.querySelector("[data-custom-box]")?.setAttribute("aria-pressed", String(s.idx === -1));
  }

  // ---------- Globální: kopírování, QR do galerie, sdílení, toast ----------
  const toast = (msg) => JH.toast(msg);

  document.addEventListener("click", async (e) => {
    const c = e.target.closest("[data-copy]");
    if (c) {
      try {
        await navigator.clipboard.writeText(c.dataset.copy);
        c.classList.add("done");
        c.innerHTML = ICON.check + "<span>Zkopírováno</span>";
        setTimeout(() => {
          c.classList.remove("done");
          c.innerHTML = ICON.copy + "<span>Kopírovat</span>";
        }, 1600);
      } catch {
        toast("Kopírování se nepovedlo, označte text ručně");
      }
      return;
    }
    const q = e.target.closest("[data-qr-dl]");
    if (q) downloadQr(Number(q.dataset.qrDl));
  });

  async function share() {
    const data = { title: "Podpořte Jedním hlasem", url: location.href.split("#")[0] };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        toast("Odkaz zkopírován");
      }
    } catch {
      /* uživatel sdílení zrušil */
    }
  }

  // ---------- Inicializace ----------
  document.querySelectorAll("[data-trust]").forEach((ul) => {
    ul.innerHTML = TRUST.map((t) => `<li>${ICON.check}<span>${t}</span></li>`).join("");
  });

  const widgets = {
    a: variantA(document.querySelector('[data-widget="a"]')),
    b: variantB(document.querySelector('[data-widget="b"]')),
    c: variantC(document.querySelector('[data-variant="c"]')),
  };

  // Mobil/desktop mění pořadí QR a údajů – po změně šířky překreslit.
  const mq = window.matchMedia("(max-width: 767px)");
  mq.addEventListener("change", () => Object.values(widgets).forEach((w) => w.rerender()));

  // Při přepnutí varianty zavřít panel varianty C
  document.addEventListener("jh:variant", () => widgets.c.close?.());
})();
