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
            RenderAvatar(user, true);
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
            RenderAvatar(user, true);
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
    const userInfo = document.querySelector(".user-info");
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    // Toggle dropdown when clicking avatar
    userInfo.addEventListener("click", function (e) {
        e.stopPropagation();
        userDropdown.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        if (!userInfo.contains(e.target) && !userDropdown.contains(e.target)) {
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
        localStorage.removeItem("accessToken");
        RenderAvatar(null, false);
        userDropdown.classList.remove("show");

        // TODO: Students will implement logout logic here
    });
});

// Other functionality
document.addEventListener("DOMContentLoaded", async function () {
    // TODO: Implement other functionality here

    try {
        const { user } = await httpRequest.get("users/me");
        RenderAvatar(user, true);
    } catch (error) {
        RenderAvatar(null, false);
    }
});
function RenderAvatar(user, isLogin = false) {
    const authButtons = document.querySelector(".auth-buttons");
    const userMenu = document.querySelector(".user-menu");
    const userInfo = document.querySelector(".user-info");
    if (isLogin) {
        authButtons.classList.remove("show");
        userMenu.classList.add("show");
        userInfo.innerHTML = `   
      <button class="user-avatar" id="userAvatar">                            
         <img src="${
             EscapeHtml(user?.avatar_url) || "placeholder.svg"
         }"  alt="User Avatar" class="user-avatar-img" />                 
      </button> 
      <div class="user-name" id="userName">
      <span class="user-name-text">${EscapeHtml(user?.display_name)}</span>
      <svg viewBox="0 0 14 7" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="7" class="">
        <path d="M0.984375 0.726562C1.06641 0.617188 1.17578 0.5625 1.3125 0.5625C1.39453 0.5625 1.50391 0.589844 1.58594 0.671875L6.97266 5.62109L12.3867 0.671875C12.5508 0.507812 12.8242 0.507812 12.9883 0.699219C13.1523 0.863281 13.1523 1.13672 12.9609 1.30078L7.27344 6.55078C7.10938 6.71484 6.86328 6.71484 6.69922 6.55078L1.01172 1.30078C0.820312 1.16406 0.820312 0.890625 0.984375 0.726562Z" fill-opacity="0.84" fill="#fff"></path>
    </svg>
    </div>                                                 
      `;
    } else {
        authButtons.classList.add("show");
        userMenu.classList.remove("show");
    }
}
function EscapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
