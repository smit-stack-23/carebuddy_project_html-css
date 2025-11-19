/* ==========================================================
   CareBuddy Interactive JS
   Responsive Navbar + Client-Side Features
========================================================== */

// =======================
//  NAVBAR RESPONSIVENESS
// =======================
const menuToggle = document.getElementById("mobile-menu");
const nav = document.querySelector("nav");
const navLinks = document.querySelector(".nav-links");

// Toggle mobile menu visibility
menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
  navLinks.classList.toggle("active");
  menuToggle.classList.toggle("open");
});

// Optional: Close dropdown when clicking outside
document.addEventListener("click", (event) => {
  if (!nav.contains(event.target)) {
    nav.classList.remove("active");
    navLinks.classList.remove("active");
    menuToggle.classList.remove("open");
  }
});

// =======================
//  ACTIVE LINK ON SCROLL
// =======================
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const scrollPos = window.scrollY + 100;

  sections.forEach((section) => {
    if (
      scrollPos >= section.offsetTop &&
      scrollPos < section.offsetTop + section.offsetHeight
    ) {
      const id = section.getAttribute("id");
      document
        .querySelectorAll(".nav-links li a")
        .forEach((link) => link.classList.remove("active"));

      const activeLink = document.querySelector(
        `.nav-links li a[href*=${id}]`
      );
      if (activeLink) activeLink.classList.add("active");
    }
  });
});

// =======================
//  TOAST NOTIFICATIONS
// =======================
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `show ${type}`;
  setTimeout(() => (toast.className = toast.className.replace("show", "")), 3000);
}

// Add some basic toast styles dynamically
const style = document.createElement("style");
style.textContent = `
  #toast {
    visibility: hidden;
    min-width: 250px;
    background-color: var(--teal, #00a8a8);
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 12px;
    position: fixed;
    z-index: 2000;
    left: 50%;
    bottom: 40px;
    transform: translateX(-50%);
    font-family: 'Poppins', sans-serif;
    transition: all 0.5s ease;
  }
  #toast.show {
    visibility: visible;
    opacity: 1;
    bottom: 60px;
  }
`;
document.head.appendChild(style);

// =======================
//  INVITE CAREGIVER LOGIC
// =======================
const inviteBtn = document.getElementById("btnInviteCaregiver");
const caregiverEmail = document.getElementById("caregiverEmail");

// When user clicks “Invite Caregiver”
inviteBtn.addEventListener("click", () => {
  const email = caregiverEmail.value.trim();
  if (email === "") {
    showToast("Please enter caregiver email!", "error");
    return;
  }

  // Simulate invitation sending
  showToast(`Invitation sent to ${email}! ✅`, "success");

  // Clear input
  caregiverEmail.value = "";
});

// =======================
//  OPEN “INVITE CAREGIVER” TAB AUTOMATICALLY
// =======================
// Example: If user clicks “Invite” link or visits with a ?invite=true query
function openInviteTab() {
  const inviteFeature = document.querySelector("[data-feature-id='invite-caregiver']");
  if (inviteFeature) {
    inviteFeature.scrollIntoView({ behavior: "smooth", block: "center" });
    inviteFeature.classList.add("highlight");
    showToast("Invite Caregiver section opened!");
    setTimeout(() => inviteFeature.classList.remove("highlight"), 3000);
  }
}

// Highlight animation
const highlightStyle = document.createElement("style");
highlightStyle.textContent = `
  .highlight {
    outline: 3px solid var(--accent-color, #ffd54f);
    border-radius: 10px;
    transition: outline 0.5s ease;
  }
`;
document.head.appendChild(highlightStyle);

// Automatically open invite tab if query parameter present
if (window.location.search.includes("invite=true")) {
  window.addEventListener("load", openInviteTab);
}

// =======================
//  SIMPLE CLIENT-SIDE ACTION LOGIC (optional examples)
// =======================
document.getElementById("btnAddMedicine").addEventListener("click", () => {
  showToast("Medicine added successfully!");
});

document.getElementById("btnSetReminder").addEventListener("click", () => {
  showToast("Reminder set successfully!");
});

document.getElementById("btnSosAlert").addEventListener("click", () => {
  showToast("🚨 SOS Alert Sent! (Simulation)");
});

document.getElementById("btnDownloadReport").addEventListener("click", () => {
  showToast("Downloading your report...");
});
