"use strict";

// FILTER CARDS BY TAG

const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    // Update active button style by revising the class name
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // STEP 1 — Fade out all cards
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "scale(0.95)";
    });

    // STEP 2 — Hide/show the correct cards
    setTimeout(() => {
      cards.forEach((card) => {
        const tags = card.dataset.tags.split(" ");

        if (filter === "all" || tags.includes(filter)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });

      // STEP 3 — Fade in the visible cards
      requestAnimationFrame(() => {
        cards.forEach((card) => {
          if (card.style.display === "flex") {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }
        });
      });
    }, 300);
  });
});
