import httpRequest from "./Ultis/httpRequest.js";
// Auth Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const signupBtn = document.querySelector(".signup-btn");
  const loginBtn = document.querySelector(".login-btn");
  const authModal = document.getElementById("authModal");
  const modalClose = document.getElementById("modalClose");
  const signupForm = document.getElementById("signupForm");
  const authFormSignup = document.querySelector(".auth-form-signup");
  const loginForm = document.getElementById("loginForm");
  const authFormLogin = document.querySelector(".auth-form-login");
  const showLoginBtn = document.getElementById("showLogin");
  const showSignupBtn = document.getElementById("showSignup");

  // Function to show signup form
  function showSignupForm() {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
  }

  // Function to show login form
  function showLoginForm() {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  }

  // Function to open modal
  function openModal() {
    authModal.classList.add("show");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }

  // Open modal with Sign Up form when clicking Sign Up button
  signupBtn.addEventListener("click", function () {
    authFormSignup.reset();
    showSignupForm();
    openModal();
  });

  // Open modal with Login form when clicking Login button
  loginBtn.addEventListener("click", function () {
    authFormLogin.reset();
    showLoginForm();
    openModal();
  });

  // Close modal function
  function closeModal() {
    authModal.classList.remove("show");
    document.body.style.overflow = "auto"; // Restore scrolling
  }

  // Close modal when clicking close button
  modalClose.addEventListener("click", closeModal);

  // Close modal when clicking overlay (outside modal container)
  authModal.addEventListener("click", function (e) {
    if (e.target === authModal) {
      closeModal();
    }
  });
  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && authModal.classList.contains("show")) {
      closeModal();
    }
  });
  // Switch to Login form
  showLoginBtn.addEventListener("click", function () {
    authFormLogin.reset();
    showLoginForm();
  });

  // Switch to Signup form
  showSignupBtn.addEventListener("click", function () {
    showSignupForm();
  });
  // Handle Signup form submission
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const credential = {
      username: email.split("@")[0],
      email: email,
      password: password,
      displayName: email.split("@")[0],
    };
    try {
      const { user, access_token } = await httpRequest.post(
        "auth/register",
        credential
      );
      closeModal();
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("user", user);
    } catch (error) {
      console.dir(error);
      const errorMessage = document.querySelector(".error-message");
      const messageError = error?.response?.error?.message;
      errorMessage.textContent =
        messageError || "An error occurred during signup.";
      errorMessage.style.display = "flex";
    }
  });
  // Handle Login form submission
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const credential = {
      email: email,
      password: password,
    };
    try {
      const { user, access_token } = await httpRequest.post(
        "auth/login",
        credential
      );
      closeModal();
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("user", user);
    } catch (error) {
      console.dir(error);
      const errorMessage = document.querySelector(".error-message");
      const messageError =
        error?.response?.error?.detail[0]?.message ||
        error?.response?.error?.message;
      errorMessage.textContent =
        messageError || "An error occurred during login.";
      errorMessage.style.display = "flex";
    }
  });
});

// User Menu Dropdown Functionality
document.addEventListener("DOMContentLoaded", function () {
  const userAvatar = document.getElementById("userAvatar");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  // Toggle dropdown when clicking avatar
  userAvatar.addEventListener("click", function (e) {
    e.stopPropagation();
    userDropdown.classList.toggle("show");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove("show");
    }
  });

  // Close dropdown when pressing Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && userDropdown.classList.contains("show")) {
      userDropdown.classList.remove("show");
    }
  });

  // Handle logout button click
  logoutBtn.addEventListener("click", function () {
    // Close dropdown first
    userDropdown.classList.remove("show");

    console.log("Logout clicked");
    // TODO: Students will implement logout logic here
  });
});

// Other functionality
document.addEventListener("DOMContentLoaded", async function () {
  // TODO: Implement other functionality here
  try {
    const authButtons = document.querySelector(".auth-buttons");
    const userMenu = document.querySelector(".user-menu");
    const { user } = await httpRequest.get("users/me");
    RenderAvatar(user);
    userMenu.classList.add("show");
  } catch (error) {
    authButtons.classList.add("show");
    userMenu.classList.remove("show");
  }
});
function RenderAvatar(user) {
  const userMenu = document.querySelector(".user-menu");
  userMenu.innerHTML = `
    <button class="user-avatar" id="userAvatar">
    <span class="user-display-name">${EscapeHtml(user.displayName)}</span>
    <img src="${user.avatarUrl || "placeholder.svg"}" alt="User Avatar" />
    </button>                               
    <div class="user-dropdown" id="userDropdown">
         <div class="dropdown-item" id="logoutBtn">                       
             <i class="fas fa-sign-out-alt"></i>                       
              <span>Log out</span>                      
         </div>                       
     </div>                                                                                                       
  `;
}
function EscapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
