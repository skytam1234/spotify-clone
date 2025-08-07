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
  const signupEmail = document.getElementById("signupEmail");
  const signupPassword = document.getElementById("signupPassword");

  const authFormLogin = document.querySelector(".auth-form-login");
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

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
    showSignupForm();
    openModal();
  });

  // Open modal with Login form when clicking Login button
  loginBtn.addEventListener("click", function () {
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
  //đăng ký
  authFormSignup.addEventListener("submit", async function (e) {
    e.preventDefault();
    const certificate = {
      email: signupEmail.value,
      username: signupEmail.value.split("@")[0],
      password: signupPassword.value,
      display_name: signupEmail.value.split("@")[0],
      bio: "Test bio",
      country: "US",
    };
    try {
      const { user, access_token } = await httpRequest.post(
        "auth/register",
        certificate
      );
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      iziToast.success({
        title: "OK",
        message: "Thông báo đăng ký thành công!",
        position: "topCenter",
      });
      this.reset(); // Reset the form fields
      closeModal();
      renderUserInfo(); // Update user info in the UI
    } catch (error) {
      console.error("Error during signup:", error);
      iziToast.error({
        title: "Error",
        message: "Đăng ký thất bại! Vui lòng kiểm tra lại thông tin đăng ký.",
        position: "topCenter",
      });
    }
  });
  // Đăng nhập
  authFormLogin.addEventListener("submit", async function (e) {
    e.preventDefault();
    const certificate = {
      email: loginEmail.value,
      password: loginPassword.value,
    };
    try {
      const { user, access_token } = await httpRequest.post(
        "auth/login",
        certificate
      );
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      iziToast.success({
        title: "OK",
        message: "Thông báo đăng nhập thành công!",
        position: "topCenter",
      });
      this.reset(); // Reset the form fields
      closeModal();
      renderUserInfo(); // Update user info in the UI
    } catch (error) {
      console.error("Error during login:", error);
      iziToast.error({
        title: "Error",
        message:
          "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.",
        position: "topCenter",
      });
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    renderUserInfo(); // Update user info in the UI

    // TODO: Students will implement logout logic here
  });
});

// Other functionality
document.addEventListener("DOMContentLoaded", async function () {
  // TODO: Implement other functionality here
  await renderUserInfo();
});

async function renderUserInfo() {
  const authButtons = document.querySelector(".auth-buttons");
  const userMenu = document.querySelector(".user-menu");
  const userAvatar = document.querySelector(".user-avatar-img");
  try {
    const { user } = await httpRequest.get("users/me");
    localStorage.setItem("user", JSON.stringify(user));
    authButtons.classList.remove("show");
    userMenu.classList.add("show");
    userAvatar.src = `${user.avatar_url || "placeholder.png"}`;
    tippy("#userAvatar", {
      content: `${user.display_name || user.username}`,
    });
  } catch (error) {
    authButtons.classList.add("show");
    userMenu.classList.remove("show");
  }
  await renderMainContent();
}
async function renderMainContent() {
  await Artists("artists/trending");
  await Tracks("tracks/popular");
}
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
                                        src="${EscapeHtml(
                                          track.artist_image_url
                                        )}"
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
function EscapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
