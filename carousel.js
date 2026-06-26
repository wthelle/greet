(function () {
  const carousel = document.querySelector(".carousel");

  if (!carousel) {
    return;
  }

  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const prevBtn = carousel.querySelector(".carousel-prev");
  const nextBtn = carousel.querySelector(".carousel-next");
  const dotsContainer = carousel.querySelector(".carousel-dots");

  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  slides.forEach(function (_, index) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Go to photo " + (index + 1));
    dot.addEventListener("click", function () {
      goToSlide(index);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = "translateX(-" + currentIndex * 100 + "%)";

    dots.forEach(function (dot, dotIndex) {
      const isActive = dotIndex === currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    slides.forEach(function (slide, slideIndex) {
      slide.setAttribute("aria-hidden", slideIndex === currentIndex ? "false" : "true");
    });
  }

  prevBtn.addEventListener("click", function () {
    goToSlide(currentIndex - 1);
  });

  nextBtn.addEventListener("click", function () {
    goToSlide(currentIndex + 1);
  });

  carousel.addEventListener("touchstart", function (event) {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener("touchend", function (event) {
    touchEndX = event.changedTouches[0].screenX;
    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) < 40) {
      return;
    }

    if (swipeDistance > 0) {
      goToSlide(currentIndex + 1);
    } else {
      goToSlide(currentIndex - 1);
    }
  }, { passive: true });

  goToSlide(0);
})();
