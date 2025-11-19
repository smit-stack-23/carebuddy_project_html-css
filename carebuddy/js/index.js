// ============================
// Mobile Menu Toggle
// ============================
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

// ✅ Toggle mobile navigation visibility
mobileMenu.addEventListener('click', () => {
  navLinks.classList.toggle('show'); // changed from .active → .show
  mobileMenu.classList.toggle('active'); // changed from .open → .active
});

// ============================
// Dropdown Menu Logic (Desktop + Mobile)
// ============================
const dropdownLinks = document.querySelectorAll('nav ul li > a');

dropdownLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const dropdown = link.nextElementSibling;

    if (dropdown && dropdown.classList.contains('dropdown')) {
      e.preventDefault();

      // Close other dropdowns
      document.querySelectorAll('nav ul li .dropdown').forEach(menu => {
        if (menu !== dropdown) menu.classList.remove('show');
      });

      // Toggle current dropdown
      dropdown.classList.toggle('show');
    }
  });
});

// ============================
// Close Dropdowns When Clicking Outside
// ============================
document.addEventListener('click', (e) => {
  // ✅ Prevent closing if clicked inside nav or dropdown
  if (!e.target.closest('nav')) {
    document.querySelectorAll('nav ul li .dropdown').forEach(dropdown => {
      dropdown.classList.remove('show');
    });
  }
});

// ============================
// Scroll Effect for Active Navbar Link
// ============================
const navItems = document.querySelectorAll('.nav-links li a');

window.addEventListener('scroll', () => {
  let fromTop = window.scrollY + 100;

  navItems.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) {
      if (
        section.offsetTop <= fromTop &&
        section.offsetTop + section.offsetHeight > fromTop
      ) {
        navItems.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
});

// ============================
// Smooth Scrolling for Navigation Links
// ============================
navItems.forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 60,
        behavior: 'smooth'
      });
    }

    // ✅ Auto-close mobile menu after clicking a link
    if (window.innerWidth <= 762) {
      navLinks.classList.remove('show');
      mobileMenu.classList.remove('active');
    }
  });
});
