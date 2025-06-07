// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  easing: "ease-in-out",
  once: true,
});

// Market Cards Hover Effect
const marketCards = document.querySelectorAll(".market-card");
marketCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
  });
});

// Feature Cards Animation
const featureCards = document.querySelectorAll(".feature-card");
featureCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
  });
});

// Social Links Hover Effect
const socialLinks = document.querySelectorAll(".social-links a");
socialLinks.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    link.style.transform = "translateY(-5px)";
  });
  link.addEventListener("mouseleave", () => {
    link.style.transform = "translateY(0)";
  });
});

// Add active class to current navigation link
const currentLocation = location.href;
const menuItems = document.querySelectorAll(".nav-links a");
menuItems.forEach((item) => {
  if (item.href === currentLocation) {
    item.classList.add("active");
  }
});

window.addEventListener("resize", handleResize);
handleResize(); // Initial call to set the correct display
