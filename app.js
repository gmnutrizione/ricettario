/* ============================================================
   CONFIGURAZIONE
   Per cambiare il foglio Google da cui vengono lette le ricette,
   sostituisci SOLO il link qui sotto con il tuo link "pubblica CSV".
   ============================================================ */
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR18C4nXumTbVaQxM5XC5RRCLrh6syg0RSrjTZPG7nD5rhb0WdDulR7q6Cz4kXipi-vJSiALkX4zUoN/pub?gid=46525631&single=true&output=csv";

const MAIN_CATEGORIES = ["Colazione", "Pranzo", "Cena"];
const SNACK_CATEGORIES = ["Spuntino mattina", "Spuntino pomeriggio"];

const ICONS = {
  "Colazione": `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v3M5.6 5.6l2.1 2.1M18.4 5.6l-2.1 2.1M3 13h18M4 13a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  "Pranzo": `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 3v2M12 19v2M21 12h-2M5 12H3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  "Cena": `<svg viewBox="0 0 24 24" fill="none"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  "Spuntino mattina": `<svg viewBox="0 0 24 24" fill="none"><path d="M6 9h11v4a5.5 5.5 0 0 1-5.5 5.5A5.5 5.5 0 0 1 6 13V9Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" stroke="currentColor" stroke-width="1.8"/><path d="M9 4c-.8.8-.8 1.6 0 2.4M12.5 4c-.8.8-.8 1.6 0 2.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  "Spuntino pomeriggio": `<svg viewBox="0 0 24 24" fill="none"><path d="M12 21c4-2.5 7-6.2 7-10A7 7 0 0 0 12 4a7 7 0 0 0-7 7c0 3.8 3 7.5 7 10Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 4c-.5 1.2-.5 2.3.5 3.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`
};

const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const CHEVRON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SEARCH_SVG = `<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const HEART_OUTLINE_SVG = `<svg viewBox="0 0 24 24" fill="none"><path d="M12 20.3s-7.2-4.4-9.6-8.6C.7 8 2.3 4.4 5.8 3.9a5 5 0 0 1 6.2 2.9 5 5 0 0 1 6.2-2.9c3.5.5 5.1 4.1 3.4 7.8-2.4 4.2-9.6 8.6-9.6 8.6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
const HEART_FILLED_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.3s-7.2-4.4-9.6-8.6C.7 8 2.3 4.4 5.8 3.9a5 5 0 0 1 6.2 2.9 5 5 0 0 1 6.2-2.9c3.5.5 5.1 4.1 3.4 7.8-2.4 4.2-9.6 8.6-9.6 8.6Z"/></svg>`;
const SHARE_SVG = `<svg viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="2.6" stroke="currentColor" stroke-width="1.8"/><circle cx="6" cy="12" r="2.6" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="19" r="2.6" stroke="currentColor" stroke-width="1.8"/><path d="M8.3 10.6l7.5-4.2M8.3 13.4l7.5 4.2" stroke="currentColor" stroke-width="1.8"/></svg>`;

/* Testi e icone di partenza: se content.json manca o non ha un campo,
   viene usato questo valore. */
const CONTENT_DEFAULTS = {
  siteTitle: "Ricettario",
  headline: "Il tuo ricettario",
  eyebrow: "Cosa cucini oggi?",
  sectionMain: "Pasti principali",
  sectionSnack: "Spuntini",
  emptyState: "Non ci sono ancora ricette in questa categoria.\nTorneranno presto nuove idee!",
  brandMarkText: "",
  brandMarkImage: "",
  icons: {},
  categoryLabels: {}
};

let CONTENT = { ...CONTENT_DEFAULTS, icons: {}, categoryLabels: {} };

const view = document.getElementById("view");
const backBtn = document.getElementById("backBtn");

let RECIPES = []; // { id, nome, categoria, ingredienti[], procedimento[], fotoUrl }
let LOAD_ERROR = null;

/* Nome mostrato per una categoria: usa l'etichetta personalizzata se presente,
   altrimenti il nome originale (quello usato anche per collegare le ricette). */
function labelFor(cat) {
  const custom = CONTENT.categoryLabels && CONTENT.categoryLabels[cat];
  return (custom && custom.trim()) ? custom.trim() : cat;
}

/* ---------------- CSV parsing (gestisce virgolette e a-capo) ---------------- */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\r") { /* ignore */ }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(cell => cell.trim() !== ""));
}

function rowsToRecipes(rows) {
  if (rows.length < 1) return [];
  const header = rows[0].map(h => h.trim().toLowerCase());
  const idx = (name) => header.findIndex(h => h.includes(name));

  const iNome = idx("nome");
  const iCat = idx("categoria");
  const iIng = idx("ingredient");
  const iProc = idx("procediment");
  const iFoto = idx("foto");

  const usedIds = new Set();

  return rows.slice(1).map((r) => {
    const nome = (r[iNome] || "").trim();
    const categoria = (r[iCat] || "").trim();
    const ingredienti = (r[iIng] || "").split("\n").map(s => s.trim()).filter(Boolean);
    const procedimento = splitSteps((r[iProc] || "").trim());
    const fotoRaw = (r[iFoto] || "").trim();

    let id = slugify(categoria + "-" + nome) || "ricetta";
    let unique = id;
    let n = 2;
    while (usedIds.has(unique)) { unique = id + "-" + n; n++; }
    usedIds.add(unique);

    return {
      id: unique,
      nome, categoria, ingredienti, procedimento,
      fotoUrl: driveImageUrl(fotoRaw)
    };
  }).filter(r => r.nome && r.categoria);
}

function slugify(text) {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitSteps(text) {
  if (!text) return [];
  const lines = text.split("\n").map(s => s.trim()).filter(Boolean);
  if (lines.length > 1) return lines;
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (sentences && sentences.length > 1) return sentences.map(s => s.trim()).filter(Boolean);
  return [text];
}

function driveImageUrl(raw) {
  if (!raw) return null;
  const first = raw.split(",")[0].trim();
  const match = first.match(/[-\w]{20,}/);
  if (!match) return first.startsWith("http") ? first : null;
  return `https://drive.google.com/thumbnail?id=${match[0]}&sz=w1000`;
}

/* ---------------- Contenuti personalizzabili (testi, icone, simbolo) ---------------- */
async function loadContent() {
  try {
    const res = await fetch("content.json", { cache: "no-store" });
    if (!res.ok) throw new Error("network");
    const data = await res.json();
    CONTENT = {
      ...CONTENT_DEFAULTS,
      ...data,
      icons: { ...CONTENT_DEFAULTS.icons, ...(data.icons || {}) },
      categoryLabels: { ...CONTENT_DEFAULTS.categoryLabels, ...(data.categoryLabels || {}) }
    };
  } catch (e) {
    CONTENT = { ...CONTENT_DEFAULTS, icons: {}, categoryLabels: {} };
  }
  applyContent();
}

function applyContent() {
  document.title = CONTENT.siteTitle || "Ricettario";
  const brandText = document.getElementById("brandText");
  if (brandText) brandText.textContent = CONTENT.siteTitle || "Ricettario";

  const mark = document.getElementById("brandMark");
  if (mark) {
    if (CONTENT.brandMarkImage) {
      const img = document.createElement("img");
      img.id = "brandMark";
      img.alt = "";
      img.referrerPolicy = "no-referrer";
      img.style.cssText = "width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;";
      img.src = driveImageUrl(CONTENT.brandMarkImage) || CONTENT.brandMarkImage;
      mark.replaceWith(img);
    } else if (CONTENT.brandMarkText) {
      mark.textContent = CONTENT.brandMarkText;
      mark.style.cssText = "width:auto;height:auto;border-radius:0;background:none;font-size:13px;font-weight:600;color:var(--brandmark-color);";
    }
  }
}

function iconFor(cat) {
  const custom = (CONTENT.icons && CONTENT.icons[cat] || "").trim();
  if (!custom) return ICONS[cat] || "";
  const isHttp = /^https?:\/\//i.test(custom);
  const looksLikeImage = isHttp || /\.(png|jpe?g|webp|svg|gif)(\?.*)?$/i.test(custom);
  if (looksLikeImage) {
    const src = isHttp ? (driveImageUrl(custom) || custom) : custom;
    return `<img src="${src}" alt="" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`;
  }
  return `<span style="font-size:26px;line-height:1;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${escapeHtml(custom)}</span>`;
}

/* ---------------- Preferiti ---------------- */
const FAV_KEY = "ricettario_preferiti";

function getFavorites() {
  try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]")); }
  catch (e) { return new Set(); }
}
function isFavorite(id) { return getFavorites().has(id); }
function toggleFavorite(id) {
  const favs = getFavorites();
  if (favs.has(id)) favs.delete(id); else favs.add(id);
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...favs])); } catch (e) {}
  return favs.has(id);
}

function favButtonHTML(id, size) {
  const active = isFavorite(id);
  return `<button class="fav-btn${active ? " active" : ""}" data-fav="${id}" aria-label="Preferito" style="${size ? `width:${size}px;height:${size}px;` : ""}">${active ? HEART_FILLED_SVG : HEART_OUTLINE_SVG}</button>`;
}

function wireFavButtons(container) {
  container.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const nowActive = toggleFavorite(btn.dataset.fav);
      btn.classList.toggle("active", nowActive);
      btn.innerHTML = nowActive ? HEART_FILLED_SVG : HEART_OUTLINE_SVG;
    });
  });
}

/* ---------------- Condivisione ---------------- */
async function shareRecipe(r) {
  const url = location.origin + location.pathname + "#/recipe/" + r.id;
  try {
    if (navigator.share) {
      await navigator.share({ title: r.nome, text: `Guarda questa ricetta: ${r.nome}`, url });
      return;
    }
  } catch (e) { return; /* utente ha annullato */ }
  try {
    await navigator.clipboard.writeText(url);
    showToast("Link della ricetta copiato");
  } catch (e) {
    window.prompt("Copia questo link:", url);
  }
}

/* ---------------- Toast generico ---------------- */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  clearTimeout(toastTimer);
  toast.hidden = false;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
}

/* ---------------- Caricamento dati ---------------- */
async function loadRecipes() {
  try {
    const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("network");
    const text = await res.text();
    const rows = parseCSV(text);
    RECIPES = rowsToRecipes(rows);
    LOAD_ERROR = null;
  } catch (e) {
    LOAD_ERROR = e;
  }
}

/* ---------------- Routing ---------------- */
function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "cat" && parts[1]) return { name: "cat", cat: decodeURIComponent(parts[1]) };
  if (parts[0] === "recipe" && parts[1]) return { name: "recipe", id: parts[1] };
  if (parts[0] === "preferiti") return { name: "preferiti" };
  return { name: "home" };
}

window.addEventListener("hashchange", render);

function goHome() { location.hash = "#/"; }
backBtn.addEventListener("click", () => {
  const route = currentRoute();
  if (route.name === "recipe") {
    const r = RECIPES.find(x => x.id === route.id);
    location.hash = r ? "#/cat/" + encodeURIComponent(r.categoria) : "#/";
  } else {
    location.hash = "#/";
  }
});

/* ---------------- Render ---------------- */
function render() {
  const route = currentRoute();
  backBtn.hidden = route.name === "home";
  window.scrollTo(0, 0);

  if (LOAD_ERROR) return renderError();

  if (route.name === "cat") return renderCategory(route.cat);
  if (route.name === "recipe") return renderRecipe(route.id);
  if (route.name === "preferiti") return renderFavorites();
  return renderHome();
}

function renderLoading() {
  view.innerHTML = `<div class="loader"><div class="spinner"></div><p>Sto caricando le ricette&hellip;</p></div>`;
}

function renderError() {
  view.innerHTML = `
    <p class="eyebrow">Ricettario</p>
    <h2 class="headline">Ops, qualcosa non ha funzionato</h2>
    <div class="error-box">
      Non riesco a caricare le ricette in questo momento. Controlla la connessione a internet e riprova tra poco.
    </div>`;
}

function countFor(cat) {
  return RECIPES.filter(r => r.categoria === cat).length;
}

function renderHome() {
  const mainCards = MAIN_CATEGORIES.map(cat => catCardHTML(cat)).join("");
  const snackCards = SNACK_CATEGORIES.map(cat => catCardHTML(cat)).join("");

  view.innerHTML = `
    <p class="eyebrow">${escapeHtml(CONTENT.eyebrow)}</p>
    <h2 class="headline">${escapeHtml(CONTENT.headline)}</h2>

    <div class="search-box">
      <span class="search-icon">${SEARCH_SVG}</span>
      <input type="search" id="searchInput" placeholder="Cerca una ricetta per nome..." autocomplete="off">
    </div>

    <button class="favorites-link" id="favoritesLink">
      <span class="heart">${HEART_FILLED_SVG}</span>
      <span>I tuoi preferiti</span>
      <span class="fav-count">${getFavorites().size}</span>
    </button>

    <div id="searchResults" hidden></div>

    <div id="categorySections">
      <h3 class="section-title">${escapeHtml(CONTENT.sectionMain)}</h3>
      <div class="category-grid">${mainCards}</div>

      <h3 class="section-title">${escapeHtml(CONTENT.sectionSnack)}</h3>
      <div class="category-grid small">${snackCards}</div>
    </div>
  `;

  view.querySelectorAll("[data-cat]").forEach(el => {
    el.addEventListener("click", () => {
      location.hash = "#/cat/" + encodeURIComponent(el.dataset.cat);
    });
  });

  document.getElementById("favoritesLink").addEventListener("click", () => {
    location.hash = "#/preferiti";
  });

  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const categorySections = document.getElementById("categorySections");

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();

    if (!q) {
      searchResults.hidden = true;
      categorySections.hidden = false;
      return;
    }

    categorySections.hidden = true;
    searchResults.hidden = false;

    const matches = RECIPES.filter(r => r.nome.toLowerCase().includes(q));
    searchResults.innerHTML = matches.length
      ? `<div class="recipe-list">${matches.map(r => recipeRowHTML(r, true)).join("")}</div>`
      : `<div class="empty"><p>Nessuna ricetta trovata per "${escapeHtml(searchInput.value.trim())}".</p></div>`;

    searchResults.querySelectorAll("[data-recipe]").forEach(el => {
      el.addEventListener("click", (e) => {
        if (e.target.closest(".fav-btn")) return;
        location.hash = "#/recipe/" + el.dataset.recipe;
      });
    });
    wireFavButtons(searchResults);
  });
}

function catCardHTML(cat) {
  const n = countFor(cat);
  return `
    <button class="card-cat" data-cat="${escapeHtml(cat)}">
      <span class="icon">${iconFor(cat)}</span>
      <span>
        <span class="cat-name">${escapeHtml(labelFor(cat))}</span>
        <span class="cat-count">${n} ricett${n === 1 ? "a" : "e"}</span>
      </span>
    </button>`;
}

function renderCategory(cat) {
  const recipes = RECIPES.filter(r => r.categoria === cat);
  const rowsHtml = recipes.map(r => recipeRowHTML(r)).join("");

  view.innerHTML = `
    <p class="eyebrow">${escapeHtml(labelFor(cat))}</p>
    <h2 class="headline">Ricette</h2>
    ${recipes.length ? `<div class="recipe-list">${rowsHtml}</div>` : emptyStateHTML()}
  `;

  wireRecipeRows(view);
}

function renderFavorites() {
  const favIds = getFavorites();
  const recipes = RECIPES.filter(r => favIds.has(r.id));
  const rowsHtml = recipes.map(r => recipeRowHTML(r, true)).join("");

  view.innerHTML = `
    <p class="eyebrow">I tuoi preferiti</p>
    <h2 class="headline">Preferiti</h2>
    ${recipes.length ? `<div class="recipe-list">${rowsHtml}</div>` : `<div class="empty"><p>Non hai ancora salvato nessuna ricetta.<br>Tocca il cuoricino su una ricetta per aggiungerla qui.</p></div>`}
  `;

  wireRecipeRows(view);
}

function emptyStateHTML() {
  const lines = (CONTENT.emptyState || "").split("\n").map(escapeHtml).join("<br>");
  return `<div class="empty"><p>${lines}</p></div>`;
}

function recipeRowHTML(r, showCategory) {
  const teaser = r.ingredienti.slice(0, 3).join(", ");
  const thumb = r.fotoUrl
    ? `<img src="${r.fotoUrl}" alt="" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;">`
    : iconFor(r.categoria);
  const badge = showCategory ? `<span class="recipe-cat-badge">${escapeHtml(labelFor(r.categoria))}</span>` : "";
  return `
    <div class="recipe-row" data-recipe="${r.id}" role="button" tabindex="0">
      <span class="recipe-thumb">${thumb}</span>
      <span class="recipe-info">
        ${badge}
        <p class="recipe-name">${escapeHtml(r.nome)}</p>
        <p class="recipe-teaser">${escapeHtml(teaser)}</p>
      </span>
      ${favButtonHTML(r.id)}
      <span class="chevron">${CHEVRON_SVG}</span>
    </div>`;
}

function wireRecipeRows(container) {
  container.querySelectorAll("[data-recipe]").forEach(el => {
    el.addEventListener("click", (e) => {
      if (e.target.closest(".fav-btn")) return;
      location.hash = "#/recipe/" + el.dataset.recipe;
    });
  });
  wireFavButtons(container);
}

function renderRecipe(id) {
  const r = RECIPES.find(x => x.id === id);
  if (!r) return renderNotFound();

  const photoHtml = r.fotoUrl
    ? `<img class="detail-photo" src="${r.fotoUrl}" alt="${escapeHtml(r.nome)}" referrerpolicy="no-referrer">`
    : "";

  const ingHtml = r.ingredienti.map((ing, i) => `
    <li data-ing="${i}">
      <span class="ingredient-check">${CHECK_SVG}</span>
      <span class="txt">${escapeHtml(ing)}</span>
    </li>`).join("");

  const stepHtml = r.procedimento.map(s => `<li>${escapeHtml(s)}</li>`).join("");

  view.innerHTML = `
    ${photoHtml}
    <div class="detail-header-row">
      <div>
        <span class="detail-tag">${escapeHtml(labelFor(r.categoria))}</span>
        <h2 class="detail-title">${escapeHtml(r.nome)}</h2>
      </div>
      <div class="detail-actions">
        ${favButtonHTML(r.id, 40)}
        <button class="icon-btn share-btn" aria-label="Condividi">${SHARE_SVG}</button>
      </div>
    </div>

    <div class="detail-block">
      <h2>Ingredienti</h2>
      <ul class="ingredient-list">${ingHtml}</ul>
    </div>

    <div class="detail-block">
      <h2>Procedimento</h2>
      <ol class="steps-list">${stepHtml}</ol>
    </div>
  `;

  view.querySelectorAll(".ingredient-list li").forEach(li => {
    li.addEventListener("click", () => li.classList.toggle("checked"));
  });

  wireFavButtons(view);
  view.querySelector(".share-btn").addEventListener("click", () => shareRecipe(r));
}

function renderNotFound() {
  view.innerHTML = `<div class="empty"><p>Ricetta non trovata.</p></div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------------- Avvio ---------------- */
(async function init() {
  renderLoading();
  await Promise.all([loadRecipes(), loadContent()]);
  syncThemeColorMeta();
  render();
})();

/* Tiene allineato il colore della barra di stato del telefono
   con il colore scelto per l'intestazione (--ink). */
function syncThemeColorMeta() {
  const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim();
  const meta = document.getElementById("themeColorMeta");
  if (ink && meta) meta.setAttribute("content", ink);
}

/* ---------------- Installazione PWA ---------------- */
let deferredPrompt = null;
const toast = document.getElementById("toast");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallToast();
});

function showInstallToast() {
  toast.hidden = false;
  toast.innerHTML = `
    <span>Installa l'app sulla tua home</span>
    <button id="installBtn">Installa</button>
    <button class="dismiss" id="dismissBtn" aria-label="Chiudi">&times;</button>`;
  document.getElementById("installBtn").addEventListener("click", async () => {
    toast.hidden = true;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    }
  });
  document.getElementById("dismissBtn").addEventListener("click", () => { toast.hidden = true; });
}

/* Suggerimento per iOS (Safari non supporta beforeinstallprompt) */
function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}
if (isIos() && !isStandalone()) {
  toast.hidden = false;
  toast.innerHTML = `
    <span>Su iPhone: tocca Condividi, poi "Aggiungi a Home"</span>
    <button class="dismiss" id="dismissIos" aria-label="Chiudi">&times;</button>`;
  document.getElementById("dismissIos").addEventListener("click", () => { toast.hidden = true; });
}

/* ---------------- Service worker ---------------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
