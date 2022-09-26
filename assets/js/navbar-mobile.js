const navbar = document.querySelector(".navbar-custom");
const navLinks = document.querySelectorAll(".nav-item");
const menuToggle = document.getElementById("navbarSupportedContent");
let bsCollapse;
navLinks.forEach((l) => {
  l.addEventListener("click", () => {
    if (navbar.offsetWidth < 992) {
      if (bsCollapse) {
        bsCollapse.hide();
      } else {
        bsCollapse = new bootstrap.Collapse(menuToggle);
      }
    }
  });
});
