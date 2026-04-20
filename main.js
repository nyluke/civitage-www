// Civitage — main.js

// --------- Apply design config (from window.__TWEAKS__ in index.html) ---------
const TWEAKS = Object.assign({
  direction: "editorial",    // "editorial" | "mono" | "minimal"
  accent:    "blue",         // "lime" | "blue" | "amber" | "violet" | "red" | "ivory"
  motion:    "subtle",       // "subtle" | "lots" | "none"
  heroTreatment: "aperture", // "aperture" | "typographic" | "band"
  density:   "comfortable",  // "comfortable" | "dense"
}, window.__TWEAKS__ || {});

(function applyTweaks(t){
  const html = document.documentElement;
  html.setAttribute("data-direction", t.direction);
  html.setAttribute("data-accent",    t.accent);
  html.setAttribute("data-motion",    t.motion);
  html.setAttribute("data-hero",      t.heroTreatment);
  html.setAttribute("data-density",   t.density);
})(TWEAKS);

// --------- Scroll reveal ---------
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// --------- Smooth anchors ---------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      const t = document.querySelector(id);
      if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 60, behavior: "smooth" }); }
    }
  });
});

// --------- Footer clock ---------
function tick(){
  const now = new Date();
  const h = String(now.getUTCHours()).padStart(2,"0");
  const m = String(now.getUTCMinutes()).padStart(2,"0");
  const s = String(now.getUTCSeconds()).padStart(2,"0");
  const el = document.getElementById("now");
  if (el) el.textContent = `${h}:${m}:${s} UTC`;
}
tick(); setInterval(tick, 1000);

// --------- Hero ticker rotation ---------
const tickerTexts = [
  "Currently engaged · Financial infrastructure · NYC + Remote",
  "Open to briefs · Defense / energy / finance / urban",
  "Next availability · Q3 · 1 engagement slot",
];
let ti = 0;
setInterval(() => {
  ti = (ti + 1) % tickerTexts.length;
  const el = document.getElementById("ticker-text");
  if (el){
    el.style.transition = "opacity .4s";
    el.style.opacity = 0;
    setTimeout(() => { el.textContent = tickerTexts[ti]; el.style.opacity = 1; }, 400);
  }
}, 5200);

// --------- Contact form ---------
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const btn = document.getElementById("submit-btn");
if (form && btn){
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    btn.disabled = true; btn.querySelector("span").textContent = "Sending…";
    status.textContent = "";
    try{
      const r = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (r.ok) { status.style.color = "var(--accent)"; status.textContent = "Brief received. A principal will reach out shortly."; form.reset(); }
      else { status.style.color = "#ff6b6b"; status.textContent = "Something went wrong. Email info@civitage.com instead."; }
    } catch{
      status.style.color = "#ff6b6b"; status.textContent = "Network error. Email info@civitage.com instead.";
    } finally {
      btn.disabled = false; btn.querySelector("span").textContent = "Send brief";
    }
  });
}
