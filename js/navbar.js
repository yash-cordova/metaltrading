// Function to load the navbar
async function loadNavbar() {
  try {
    // Determine the correct path to navbar.html based on current page
    const isInPages = window.location.pathname.includes("/pages/");
    const navbarPath = isInPages
      ? "../components/navbar.html"
      : "components/navbar.html";

    const response = await fetch(navbarPath);
    const html = await response.text();
    document.getElementById("navbar-container").innerHTML = html;

    // Set active link based on current page
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {
      const linkPath = link.getAttribute("href").split("/").pop();
      if (linkPath === currentPage) {
        link.classList.add("active");
      }
    });

    // Initialize hamburger menu
    initHamburgerMenu();
  } catch (error) {
    console.error("Error loading navbar:", error);
  }
}

// Function to initialize hamburger menu
function initHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const overlay = document.getElementById("sidebarOverlay");

  if (!hamburger || !navLinks || !overlay) {
    console.error("Required elements not found");
    return;
  }

  function toggleMenu() {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.style.overflow = navLinks.classList.contains("active")
      ? "hidden"
      : "";
  }

  // Toggle menu on hamburger click
  hamburger.addEventListener("click", toggleMenu);

  // Close menu on overlay click
  overlay.addEventListener("click", toggleMenu);

  // Close menu on window resize if open
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
      toggleMenu();
    }
  });

  // Close menu when clicking a nav link
  const navItems = navLinks.querySelectorAll("a");
  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        toggleMenu();
      }
    });
  });
}

// Load navbar when DOM is ready
document.addEventListener("DOMContentLoaded", loadNavbar);
