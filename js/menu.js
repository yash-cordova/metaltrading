// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get the necessary elements
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const overlay = document.getElementById("sidebarOverlay");

  // Log to check if elements are found
  console.log("Hamburger:", hamburger);
  console.log("NavLinks:", navLinks);
  console.log("Overlay:", overlay);

  // Function to toggle the menu
  function toggleMenu() {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("sidebar-open"); // ✅ use this instead
    overlay.classList.toggle("active");
  }

  // Add click event to hamburger
  if (hamburger) {
    hamburger.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Hamburger clicked");
      toggleMenu();
    });
  }

  // Add click event to overlay
  if (overlay) {
    overlay.addEventListener("click", function () {
      console.log("Overlay clicked");
      toggleMenu();
    });
  }

  // Add click events to nav links
  const navItems = navLinks ? navLinks.querySelectorAll("a") : [];
  navItems.forEach((link) => {
    link.addEventListener("click", function () {
      if (navLinks.classList.contains("active")) {
        toggleMenu();
      }
    });
  });
});
