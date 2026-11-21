/* Jedním hlasem – detail článku v3 (prototyp ke schválení, ne finální web). */
(() => {
  "use strict";
  const { A, $, esc, nb, date, img, author, topicsOf, card, brand } = window.JH;
  const BODIES = window.JH_BODIES || {};

  const slug = new URLSearchParams(location.search).get("slug") || "muz-ktery-videl-budoucnost";
  const a = A.find((x) => x.slug === slug) || A[0];
  const [main, ...more] = topicsOf(a);
  document.title = `${a.title} – Jedním hlasem`;

  // Text ze starého webu: úvodní kurzíva je podtitulek, první obrázek je titulní fotka (ta je nahoře zvlášť).
  const tmp = document.createElement("div");
  tmp.innerHTML = BODIES[a.slug] || `<p>${esc(a.perex)}</p>`;
  let dek = "";
  const first = tmp.firstElementChild;
  // Podtitulek je celý (nebo skoro celý) v kurzívě, i když je rozdělený do více <em>.
  const emText = first ? [...first.querySelectorAll("em")].map((e) => e.textContent).join("").trim().length : 0;
  if (first && first.matches("p") && emText && emText >= first.textContent.trim().length * 0.7) {
    dek = first.textContent.trim(); first.remove();
  }
  while (tmp.firstElementChild && tmp.firstElementChild.matches("hr")) tmp.firstElementChild.remove();
  const lead = tmp.firstElementChild;
  if (a.img && lead && (lead.matches("figure, .wp-block-image") || lead.querySelector(":scope > figure"))) lead.remove();
  tmp.querySelectorAll("[class]").forEach((el) => el.removeAttribute("class"));
  // Starý web má v některých seznamech odrážku i jako znak v textu – druhá by se zdvojila.
  tmp.querySelectorAll("li").forEach((li) => {
    const t = document.createTreeWalker(li, NodeFilter.SHOW_TEXT).nextNode();
    if (t) t.textContent = t.textContent.replace(/^\s*[•·▪]\s*/, "");
  });
  // Ručně číslované odrážky („1.“ v textu) převedeme na číslovaný seznam, ať nemají puntík i číslo.
  tmp.querySelectorAll("ul").forEach((ul) => {
    const items = [...ul.children];
    if (!items.length || !items.every((li) => /^\s*\d+\.\s/.test(li.textContent))) return;
    const ol = document.createElement("ol");
    items.forEach((li) => {
      const t = document.createTreeWalker(li, NodeFilter.SHOW_TEXT).nextNode();
      t.textContent = t.textContent.replace(/^\s*\d+\.\s*/, "");
      const p = t.parentElement;
      if (p !== li && !p.textContent.trim()) p.remove();
      const n = document.createTreeWalker(li, NodeFilter.SHOW_TEXT).nextNode();
      if (n) n.textContent = n.textContent.replace(/^\s+/, "");
      ol.append(li);
    });
    ul.replaceWith(ol);
  });
  tmp.querySelectorAll("img").forEach((el) => { el.removeAttribute("width"); el.removeAttribute("height"); el.loading = "lazy"; });
  const words = tmp.textContent.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));

  const url = encodeURIComponent(`https://jednimhlasem.cz/clanky/${a.slug}`);
  const SHARE = [
    ["facebook", "Sdílet na Facebooku", `https://www.facebook.com/sharer/sharer.php?u=${url}`],
    ["x", "Sdílet na X", `https://x.com/intent/post?url=${url}`],
    ["whatsapp", "Poslat přes WhatsApp", `https://wa.me/?text=${url}`],
    ["ph:envelope-simple", "Poslat e-mailem", `mailto:?subject=${encodeURIComponent(a.title)}&body=${url}`],
  ];
  const share = `
    <div class="share" aria-label="Sdílet článek">
      ${SHARE.map(([i, l, h]) => `<a href="${h}" target="_blank" rel="noopener" aria-label="${l}" title="${l}">${i.startsWith("ph:") ? `<i class="ph ph-${i.slice(3)}"></i>` : brand(i)}</a>`).join("")}
      <button type="button" class="share__copy" aria-label="Zkopírovat odkaz" title="Zkopírovat odkaz"><i class="ph ph-link-simple"></i></button>
    </div>`;

  $("art").innerHTML = `
    <header class="art__head">
      <a class="card__kicker art__kicker" href="#"><i class="ph ph-${main.icon}" aria-hidden="true"></i>${main.name}</a>
      <h1 class="art__title">${nb(a.title)}</h1>
      ${dek ? `<p class="art__dek">${nb(dek)}</p>` : ""}
      <div class="art__meta">
        <span class="art__by"><a href="#">${esc(author(a))}</a><time datetime="${a.date}">${date(a.date)}</time><span>${minutes} min čtení</span></span>
      </div>
    </header>
    ${a.img ? `<figure class="art__hero"><img src="${img(a, 1600)}" alt=""></figure>` : ""}
    <div class="art__grid">
      ${share}
      <div class="art__body">${tmp.innerHTML}</div>
    </div>
    <footer class="art__foot">
      <ul class="chips" aria-label="Témata článku">${[main, ...more].map((t) => `<li><a href="#"><i class="ph ph-${t.icon}" aria-hidden="true"></i>${t.name}</a></li>`).join("")}</ul>
      <div class="art__author">
        <strong>${esc(author(a))}</strong>
        <a href="#" class="more">Všechny články autora</a>
      </div>
    </footer>`;

  // Kopírování odkazu – krátké potvrzení přímo na tlačítku.
  const copy = document.querySelector(".share__copy");
  copy.addEventListener("click", () => {
    navigator.clipboard?.writeText(decodeURIComponent(url)).catch(() => {});
    copy.classList.add("is-done"); copy.innerHTML = '<i class="ph ph-check"></i>';
    setTimeout(() => { copy.classList.remove("is-done"); copy.innerHTML = '<i class="ph ph-link-simple"></i>'; }, 1600);
  });

  // Související: stejné hlavní téma, jinak nejnovější.
  const pool = A.filter((x) => x.slug !== a.slug && x.img && !/deník dagmar/i.test(x.title));
  const same = pool.filter((x) => topicsOf(x)[0] === main);
  const related = [...same, ...pool].filter((x, i, arr) => arr.indexOf(x) === i);
  $("related").innerHTML = related.slice(0, 3).map((x) => card(x, "small")).join("");
  $("more-h").textContent = `Další z tématu ${main.name.replace(/ /g, " ")}`;
  $("more").innerHTML = related.slice(3, 7).map((x) => card(x, "small")).join("");

  // Ukazatel postupu čtení.
  const bar = $("progress"), body = document.querySelector(".art__body");
  const onScroll = () => {
    const r = body.getBoundingClientRect(), total = r.height - innerHeight * 0.6;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, -r.top / total))})`;
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
