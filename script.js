// Screem Weddings Productions — small interactions (no libraries)
document.documentElement.classList.add("js");

// Sticky header background after scrolling
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const links = document.getElementById("nav-links");
const setMenu = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  links.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  document.body.style.overflow = open ? "hidden" : "";
};
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// Reveal sections as they scroll into view
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}

// Enquiry form: sent by email through Web3Forms (DL-037).
// The access key is public by design: it only lets this form email the studio.
const WEB3FORMS_KEY = "bfb4cceb-c966-47dc-b862-97f36f0e961c";
const form = document.querySelector(".contact-form");
const status = form.querySelector(".form-status");
const submitBtn = form.querySelector('button[type="submit"]');
// Mark an empty required field in red with a short message under it
const setFieldError = (el, on) => {
  const field = el.closest(".field");
  field.classList.toggle("has-error", on);
  el.setAttribute("aria-invalid", String(on));
  let msg = field.querySelector(".field-error");
  if (on && !msg) {
    msg = document.createElement("p");
    msg.className = "field-error";
    msg.id = el.id + "-error";
    msg.textContent = "Please enter " + field.querySelector("label").firstChild.textContent.trim().toLowerCase();
    field.appendChild(msg);
    el.setAttribute("aria-describedby", msg.id);
  }
  if (!on && msg) { msg.remove(); el.removeAttribute("aria-describedby"); }
};
form.querySelectorAll("[required]").forEach((el) => {
  const clear = () => { if (el.value.trim()) setFieldError(el, false); };
  el.addEventListener("input", clear);
  el.addEventListener("change", clear);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const missing = [...form.querySelectorAll("[required]")].filter((el) => !el.value.trim());
  form.querySelectorAll("[required]").forEach((el) => setFieldError(el, missing.includes(el)));
  status.classList.toggle("is-error", missing.length > 0);
  if (missing.length) { status.textContent = "Please fill in the fields marked in red."; missing[0].focus(); return; }

  const data = new FormData(form);
  data.append("access_key", WEB3FORMS_KEY);
  data.append("subject", "New wedding enquiry from the website");
  data.append("from_name", "Screem Weddings website");

  const label = submitBtn.textContent;
  submitBtn.textContent = "Sending…";
  submitBtn.disabled = true;
  status.textContent = "";
  try {
    const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.success !== false) {
      status.textContent = "Thank you! Your enquiry has been sent. We'll get back to you soon.";
      form.reset();
    } else {
      status.textContent = "Sorry, it didn't send. Please try again in a moment.";
    }
  } catch {
    status.textContent = "Sorry, it didn't send. Please check your connection and try again.";
  } finally {
    submitBtn.textContent = label;
    submitBtn.disabled = false;
  }
});

document.getElementById("year").textContent = new Date().getFullYear();

// Gallery "Show more photos" toggle
const galleryGrid = document.querySelector(".gallery-grid");
const moreBtn = document.querySelector(".gallery-more button");
if (galleryGrid && moreBtn) {
  moreBtn.addEventListener("click", () => {
    const open = galleryGrid.classList.toggle("expanded");
    moreBtn.setAttribute("aria-expanded", String(open));
    moreBtn.textContent = open ? "Show fewer photos" : "Show more photos";
    if (!open) document.getElementById("gallery").scrollIntoView();
  });
}

// Logo: go back to the top of the home page
document.querySelector(".brand").addEventListener("click", (e) => {
  e.preventDefault();
  setMenu(false);
  history.replaceState(null, "", location.pathname);
  window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});
