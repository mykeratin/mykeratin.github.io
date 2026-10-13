"use strict";
document.documentElement.classList.add("js");
const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");
function setMenu(open) {
  nav?.classList.toggle("is-open", open);
  burger?.setAttribute("aria-expanded", String(open));
  burger?.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
}
burger?.addEventListener("click", () =>
  setMenu(!nav.classList.contains("is-open")),
);
nav
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
document.addEventListener("click", (event) => {
  if (
    nav?.classList.contains("is-open") &&
    !nav.contains(event.target) &&
    !burger.contains(event.target)
  )
    setMenu(false);
});
const targets = document.querySelectorAll(".section-reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.07 },
  );
  targets.forEach((el) => observer.observe(el));
} else {
  targets.forEach((el) => el.classList.add("is-visible"));
}
const expertSection = document.querySelector(".expert");

if (expertSection) {
  if ("IntersectionObserver" in window) {
    const expertObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      },
    );

    expertObserver.observe(expertSection);
  } else {
    expertSection.classList.add("is-visible");
  }
}

/* ==========================================
   PROGRAM CAROUSEL — FIXED NAVIGATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector("#program-track");
  if (!track) return;

  const cards = [...track.querySelectorAll(".program__card")];
  const prev = document.querySelector("[data-program-prev]");
  const next = document.querySelector("[data-program-next]");
  const current = document.querySelector("[data-program-current]");
  const total = document.querySelector("[data-program-total]");

  if (!cards.length || !prev || !next) return;

  const format = (n) => String(n).padStart(2, "0");

  if (total) total.textContent = format(cards.length);

  function getStep() {
    if (cards.length < 2) return cards[0].getBoundingClientRect().width;

    return (
      cards[1].getBoundingClientRect().left -
      cards[0].getBoundingClientRect().left
    );
  }

  function getMaxScroll() {
    return Math.max(0, track.scrollWidth - track.clientWidth);
  }

  function update() {
    const step = getStep();
    const index = step > 0 ? Math.round(track.scrollLeft / step) : 0;

    if (current) {
      current.textContent = format(Math.min(index + 1, cards.length));
    }

    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= getMaxScroll() - 2;
  }

  function move(direction) {
    const step = getStep();
    const target = Math.max(
      0,
      Math.min(
        getMaxScroll(),
        Math.round(track.scrollLeft / step + direction) * step,
      ),
    );

    track.scrollTo({
      left: target,
      behavior: "smooth",
    });
  }

  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));

  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);

  update();
});

/* MYKERATIN — LESSON SHOP CAROUSEL */

(() => {
  const track = document.querySelector("#lesson-shop-track");
  if (!track) return;

  const cards = [...track.querySelectorAll(".lesson-shop__card")];
  const prev = document.querySelector("[data-lesson-prev]");
  const next = document.querySelector("[data-lesson-next]");
  const current = document.querySelector("[data-lesson-current]");
  const total = document.querySelector("[data-lesson-total]");

  if (!cards.length || !prev || !next) return;

  const format = (n) => String(n).padStart(2, "0");

  if (total) total.textContent = format(cards.length);

  function step() {
    if (cards.length < 2) {
      return cards[0].getBoundingClientRect().width;
    }

    return (
      cards[1].getBoundingClientRect().left -
      cards[0].getBoundingClientRect().left
    );
  }

  function update() {
    const distance = step();
    const index = distance ? Math.round(track.scrollLeft / distance) : 0;

    if (current) {
      current.textContent = format(Math.min(index + 1, cards.length));
    }

    prev.disabled = track.scrollLeft <= 2;

    next.disabled =
      track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  }

  function move(direction) {
    const distance = step();
    const max = track.scrollWidth - track.clientWidth;

    const target = Math.max(
      0,
      Math.min(
        max,
        Math.round(track.scrollLeft / distance + direction) * distance,
      ),
    );

    track.scrollTo({
      left: target,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));

  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);

  update();
})();

/* MYKERATIN — FOOTER PAYMENT MODAL */

(() => {
  const modal = document.querySelector("#mk-payment-modal");
  const openButton = document.querySelector("[data-mk-payment-open]");

  if (!modal || !openButton) return;

  const closeButtons = modal.querySelectorAll("[data-mk-payment-close]");
  const copyButton = modal.querySelector("[data-mk-payment-copy]");
  const status = modal.querySelector("[data-mk-payment-status]");
  const panel = modal.querySelector(".mk-payment-modal__panel");

  let previousFocus = null;
  let previousOverflow = "";

  const paymentDetails = [
    "ФОП Грудниста Анастасія Юріївна",
    "Код отримувача: 3622306140",
    "IBAN: UA553052990000026007050674783",
    "Банк: АТ КБ «ПриватБанк»",
    "Призначення платежу: За товар",
  ].join("\n");

  function openModal() {
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;

    modal.hidden = false;
    document.body.style.overflow = "hidden";

    if (status) status.textContent = "";

    panel.querySelector(".mk-payment-modal__close").focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = previousOverflow;
    previousFocus?.focus();
  }

  openButton.addEventListener("click", openModal);

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = [
      ...panel.querySelectorAll("button:not([disabled]), a[href]"),
    ];

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(paymentDetails);

      if (status) {
        status.textContent = "Реквізити скопійовано";
      }
    } catch {
      if (status) {
        status.textContent =
          "Не вдалося скопіювати автоматично. Скопіюй дані вручну.";
      }
    }
  });
})();
