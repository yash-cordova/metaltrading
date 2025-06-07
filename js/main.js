// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  easing: "ease-in-out",
  once: true,
});

// Mobile Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
let sidebarOverlay = document.querySelector(".sidebar-overlay");

function openSidebar() {
  console.log("Opening sidebar");
  navLinks.classList.add("sidebar-open");
  if (!sidebarOverlay) {
    sidebarOverlay = document.createElement("div");
    sidebarOverlay.className = "sidebar-overlay";
    document.body.appendChild(sidebarOverlay);
  } else {
    sidebarOverlay.classList.remove("hide");
  }
  setTimeout(() => {
    sidebarOverlay.style.opacity = 1;
  }, 10);
}

function closeSidebar() {
  console.log("Closing sidebar");
  navLinks.classList.remove("sidebar-open");
  if (sidebarOverlay) {
    sidebarOverlay.classList.add("hide");
    setTimeout(() => {
      if (sidebarOverlay) sidebarOverlay.style.opacity = 0;
    }, 10);
  }
}

hamburger.addEventListener("click", () => {
  console.log("Hamburger clicked");
  if (navLinks.classList.contains("sidebar-open")) {
    closeSidebar();
  } else {
    openSidebar();
  }
  hamburger.classList.toggle("active");
});

// Close sidebar on overlay or nav link click
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("sidebar-overlay")) {
    closeSidebar();
    hamburger.classList.remove("active");
  }
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      closeSidebar();
      hamburger.classList.remove("active");
    }
  });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Navbar Background Change on Scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "none";
  }
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

// Responsive Navigation
function handleResize() {
  if (window.innerWidth > 768) {
    navLinks.style.display = "flex";
  } else {
    navLinks.style.display = "none";
  }
}

window.addEventListener("resize", handleResize);
handleResize(); // Initial call to set the correct display
