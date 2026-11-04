/* ============================================
   RUNA® — Interacciones
   ============================================ */

(() => {
  "use strict";

  const body = document.body;
  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menú móvil ---------- */

  const setNav = (open) => {
    body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };

  navToggle.addEventListener("click", () => {
    setNav(!body.classList.contains("nav-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNav(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      setNav(false);
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) setNav(false);
  });

  /* ---------- Header con scroll ---------- */

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Revelado al hacer scroll ---------- */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  /* ---------- Contadores ---------- */

  const counters = document.querySelectorAll("[data-count]");
  const DURATION = 1500;

  const animateCounter = (element) => {
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) return;

    if (prefersReducedMotion) {
      element.textContent = String(target);
      return;
    }

    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- FAQ acordeón ---------- */

  const faqButtons = Array.from(document.querySelectorAll(".faq__btn"));

  const closePanel = (button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    button.setAttribute("aria-expanded", "false");
    if (panel) panel.style.height = "0px";
  };

  faqButtons.forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";

      faqButtons.forEach(closePanel);

      if (isOpen) return;

      button.setAttribute("aria-expanded", "true");
      panel.style.height = `${panel.scrollHeight}px`;
    });
  });

  window.addEventListener("resize", () => {
    faqButtons.forEach((button) => {
      if (button.getAttribute("aria-expanded") !== "true") return;
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      if (panel) panel.style.height = `${panel.scrollHeight}px`;
    });
  });

  /* ---------- Glow que sigue al cursor en servicios ---------- */

  if (window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion) {
    document.querySelectorAll(".service").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--y", `${event.clientY - rect.top}px`);
      });
    });
  }

  /* ---------- Sección activa en la navegación ---------- */

  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${entry.target.id}`;
            if (isActive) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- Formulario ---------- */

  const form = document.getElementById("contactForm");

  if (form) {
    const fieldsWrap = form.querySelector(".form__fields");
    const success = form.querySelector(".form__success");
    const submit = form.querySelector(".form__submit");

    const validators = {
      name: (value) =>
        value.trim().length < 2 ? "Contanos tu nombre completo." : "",
      email: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
          ? ""
          : "Ingresá un email válido.",
      message: (value) =>
        value.trim().length < 10
          ? "Contanos un poco más (mínimo 10 caracteres)."
          : "",
    };

    const showError = (field, message) => {
      const wrapper = field.closest(".field");
      const error = document.getElementById(`${field.id}-error`);

      wrapper.classList.toggle("is-invalid", Boolean(message));
      field.setAttribute("aria-invalid", message ? "true" : "false");
      if (error) error.textContent = message;
    };

    Object.keys(validators).forEach((key) => {
      const field = form.elements[key];
      if (!field) return;
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") showError(field, "");
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let firstInvalid = null;

      Object.entries(validators).forEach(([key, validate]) => {
        const field = form.elements[key];
        if (!field) return;

        const message = validate(field.value);
        showError(field, message);

        if (message && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      submit.disabled = true;
      submit.textContent = "Enviando…";

      // Simulación de envío: acá conectarías tu backend o servicio de email.
      window.setTimeout(() => {
        fieldsWrap.hidden = true;
        success.hidden = false;
        form.reset();
        submit.disabled = false;
        submit.innerHTML =
          'Enviar consulta <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      }, 700);
    });
  }

  /* ---------- Año del footer ---------- */

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
