// ========== SMART DOSE TRACKER LOGIN & SIGNUP JS ==========

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  const successOverlay = document.getElementById("success-overlay");
  const yearSpan = document.getElementById("year");

  // Auto-update year in footer
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Detect which form is on the page
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  // ========== LOGIN FORM ==========
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      // Basic validation
      if (!username || !password) {
        alert("Please enter both username and password.");
        return;
      }

      // Show success overlay
      showSuccess("Login Successful!", "Redirecting to your dashboard...");

      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = "dashboard.html"; // your main dashboard page
      }, 3000);
    });
  }

  // ========== SIGNUP FORM ==========
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("fullname").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirm-password").value.trim();

      // Basic validation
      if (!name || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }

      // Show success overlay
      showSuccess("Account Created Successfully!", "Redirecting to login page...");

      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = "login.html";
      }, 3000);
    });
  }

  // ========== SUCCESS OVERLAY FUNCTION ==========
  function showSuccess(title, message) {
    if (!successOverlay) return;

    const heading = successOverlay.querySelector("h3");
    const paragraph = successOverlay.querySelector("p");

    heading.textContent = title;
    paragraph.textContent = message;

    successOverlay.hidden = false;

    // Add fade-in animation
    successOverlay.style.opacity = "0";
    successOverlay.style.transition = "opacity 0.6s ease";
    requestAnimationFrame(() => {
      successOverlay.style.opacity = "1";
    });
  }
});
