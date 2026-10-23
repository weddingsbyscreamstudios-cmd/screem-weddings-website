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

// Enquiry form: not connected yet (where enquiries go is an open decision)
const form = document.querySelector(".contact-form");
const status = form.querySelector(".form-status");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const missing = [...form.querySelectorAll("[required]")].find((el) => !el.value.trim());
  if (missing) { status.textContent = "Please fill in your names and a way to contact you."; missing.focus(); return; }
  status.textContent = "Thank you! (Preview: this form is not connected yet, so nothing was sent.)";
  form.reset();
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
