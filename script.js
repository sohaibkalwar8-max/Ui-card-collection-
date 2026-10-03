
document.addEventListener("DOMContentLoaded", function () {

  document.body.classList.add("js-ready");

  // 1. Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("active");

      menuToggle.textContent = isOpen ? "✕" : "☰";
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("active");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 2. Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // 3. Card category filters
  const filterButtons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".ui-card");
  const emptyMessage = document.getElementById("emptyMessage");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedFilter = this.dataset.filter;

      filterButtons.forEach(function (item) {
        item.classList.remove("active");
      });

      this.classList.add("active");

      let visibleCount = 0;

      cards.forEach(function (card) {
        const category = card.dataset.category;
        const shouldShow =
          selectedFilter === "all" || category === selectedFilter;

        card.hidden = !shouldShow;

        if (shouldShow) {
          visibleCount++;
          card.classList.remove("show");

          requestAnimationFrame(function () {
            card.classList.add("show");
          });
        }
      });

      if (emptyMessage) {
        emptyMessage.hidden = visibleCount !== 0;
      }
    });
  });

  // 4. Like buttons
  const likeButtons = document.querySelectorAll(".like-btn");

  likeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const liked = this.classList.toggle("liked");

      this.textContent = liked ? "♥" : "♡";
      this.setAttribute("aria-pressed", String(liked));

      showToast(liked ? "Card added to favourites!" :
        "Card removed from favourites.");
    });
  });

  // 5. Card detail buttons
  const detailButtons = document.querySelectorAll(".detail-btn");

  detailButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const title = this.dataset.title || "Card Details";
      const description =
        this.dataset.description || "This is a sample UI card.";

      showToast(title + ": " + description);
    });
  });

  // 6. Show toast message
  let toastTimer;
  const toast = document.getElementById("toast");

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2500);
  }

  // 7. Reveal cards as they enter the screen
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08
    });

    cards.forEach(function (card) {
      observer.observe(card);
    });
  } else {
    cards.forEach(function (card) {
      card.classList.add("show");
    });
  }

});
