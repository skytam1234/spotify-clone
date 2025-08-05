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
        showLoginForm();
    });

    // Switch to Signup form
    showSignupBtn.addEventListener("click", function () {
        showSignupForm();
    });
    // Handle Signup form submission
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const res = await Signup();
        if (res) {
            Toast({
                title: "Login Successful",
                message: "You have successfully logged in.",
                type: "susses",
                toastIcon: "fa-solid fa-check",
            });
            closeModal();
        }
        authFormSignup.reset();
    });
    // Handle Login form submission
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const res = await Login();
        if (res) {
            Toast({
                title: "Login Successful",
                message: "You have successfully logged in.",
                type: "susses",
                toastIcon: "fa-solid fa-check",
            });
            closeModal();
        }
        authFormLogin.reset();
    });
});

// User Menu Dropdown Functionality
document.addEventListener("DOMContentLoaded", function () {
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
    document.addEventListener("keydown", async function (e) {
        if (e.key === "Escape" && userDropdown.classList.contains("show")) {
            userDropdown.classList.remove("show");
        }
        if (e.key === "F5") {
            try {
                const { user } = await httpRequest.get("users/me");
                RenderAvatar(user, true);
            } catch (error) {
                RenderAvatar(null, false);
            }
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
    Artists("artists");
    Tracks("tracks");
});

// Login function placeholder
async function Login() {
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
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("user", user);
        RenderAvatar(user, true);

        return true;
    } catch (error) {
        const errorMessage = document.querySelector(".error-message");
        const messageError =
            error?.response?.error?.detail[0]?.message ||
            error?.response?.error?.message;
        errorMessage.textContent =
            messageError || "An error occurred during login.";
        errorMessage.style.display = "flex";
        return false;
    }
}
async function Signup() {
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
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("user", user);
        RenderAvatar(user, true);

        return true;
    } catch (error) {
        console.dir(error);
        const errorMessage = document.querySelector(".error-message");
        const messageError = error?.response?.error?.message;
        errorMessage.textContent =
            messageError || "An error occurred during signup.";
        errorMessage.style.display = "flex";
        return false;
    }
}
function Toast(toast = {}) {
    const toastElementOld = document.querySelector(".toast");
    if (toastElementOld) document.body.removeChild(toastElementOld);
    const toastElement = document.createElement("div");
    toastElement.classList.add("toast", `toast--${toast.type}`);
    toastElement.innerHTML = `
                          <div class="toast__icon">
                                <i class="${toast.toastIcon}"></i>
                              </div>
                              <div class="toast__body">
                                <h3 class="toast__title">${toast.title}</h3>
                                <p class="toast__msg">
                                ${toast.message}
                                </p>
                              </div>
                              <div class="toast__close">
                                <i class="fa-solid fa-xmark toast__close-icon"></i>
                              </div>
                          `;
    document.body.appendChild(toastElement);
    const iconClose = document.querySelector(`.toast__close-icon`);
    iconClose.onclick = function () {
        document.body.removeChild(toastElement);
    };
}
// function to render the Artists
async function Artists(path) {
    const res = await httpRequest.get(path);
    const artistsGrid = document.querySelector(".artists-grid");
    let poularArtists = "";
    if (res) {
        res.artists.forEach((artist) => {
            const artistItem = `<div class="artist-card" data-id="${EscapeHtml(
                artist.id
            )}">
                                <div class="artist-card-cover">
                                    <img
                                        src="${EscapeHtml(
                                            artist.image_url
                                        )}?height=160&width=160"
                                        alt="Đen" onerror="this.onerror=null;this.src='placeholder.svg';"
                                    />
                                    <button class="artist-play-btn">
                                        <i class="fas fa-play"></i>
                                    </button>
                                </div>
                                <div class="artist-card-info">
                                    <h3 class="artist-card-name">${EscapeHtml(
                                        artist.name
                                    )}</h3>
                                    <p class="artist-card-type">Ca sĩ</p>
                                </div>
                            </div>`;
            poularArtists += artistItem;
        });
    }
    artistsGrid.innerHTML = poularArtists;
}
async function Tracks(path) {
    const res = await httpRequest.get(path);
    const tracksGrid = document.querySelector(".hits-grid");
    let popularTracks = "";
    if (res) {
        res.tracks.forEach((track) => {
            const trackItem = `<div class="hit-card" data-id="${EscapeHtml(
                track.id
            )}">
                                <div class="hit-card-cover">
                                    <img
                                        src="${EscapeHtml(track.image_url)}"
                                        alt="${EscapeHtml(track.title)}"
                                        onerror=" this.onerror=null ;this.src='${EscapeHtml(
                                            track.artist_image_url
                                        )}';"
                                    />
                                    <button class="hit-play-btn">
                                        <i class="fas fa-play"></i>
                                    </button>
                                </div>
                                <div class="hit-card-info">
                                    <h3 class="hit-card-title">${EscapeHtml(
                                        track.title
                                    )}</h3>
                                    <p class="hit-card-artist">${EscapeHtml(
                                        track.artist_name
                                    )}</p>
                                </div>
                            </div>`;
            popularTracks += trackItem;
        });
    }
    tracksGrid.innerHTML = popularTracks;
}
// Render user avatar and name in the header
function RenderAvatar(user, isLogin = false) {
    const authButtons = document.querySelector(".auth-buttons");
    const userMenu = document.querySelector(".user-menu");
    const userInfo = document.querySelector(".user-info");
    const libraryContent = document.querySelector(".library-content");
    if (isLogin) {
        authButtons.classList.remove("show");
        userMenu.classList.add("show");
        libraryContent.classList.add("show");
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
        libraryContent.classList.remove("show");
    }
}
// Function to escape HTML characters
function EscapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
