const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const intro = document.getElementById("intro");
const introSeenKey = "kumbayaaIntroSeen";

function hideIntro() {
  if (!intro) return;
  intro.classList.add("is-hidden");
  document.body.classList.remove("intro-lock");
  try {
    sessionStorage.setItem(introSeenKey, "true");
  } catch (error) {
    // Session storage may be unavailable in strict privacy modes; failing open keeps the site usable.
  }
}

(function initIntro() {
  let hasSeenIntro = false;
  try {
    hasSeenIntro = sessionStorage.getItem(introSeenKey) === "true";
  } catch (error) {
    hasSeenIntro = false;
  }

  if (!intro || prefersReducedMotion || hasSeenIntro) {
    hideIntro();
    return;
  }

  document.body.classList.add("intro-lock");
  window.setTimeout(hideIntro, 2100);
  intro.addEventListener("click", hideIntro, { once: true });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideIntro();
  }, { once: true });
})();

const menuButton = document.querySelector(".navbar__toggle");
const menu = document.getElementById("primary-menu");

menuButton?.addEventListener("click", () => {
  const isOpen = menu?.classList.toggle("is-open") ?? false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open menu");
  });
});

const revealItems = document.querySelectorAll(".reveal");
if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelectorAll(".services-accordion details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".services-accordion details").forEach((otherDetail) => {
      if (otherDetail !== detail) otherDetail.removeAttribute("open");
    });
  });
});

const bookingForm = document.querySelector(".booking-form");
bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = bookingForm.querySelector("button[type='submit']");
  if (button) {
    button.textContent = "Request Ready to Send";
    window.setTimeout(() => {
      button.textContent = "Request Appointment";
    }, 2200);
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
