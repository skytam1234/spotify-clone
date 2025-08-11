import httpRequest from "./Ultis/httpRequest.js";

// Auth Modal Functionality
document.addEventListener("DOMContentLoaded", async function () {
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
    const createPlaylistModal = document.querySelector(".create-btn");
    const playlistDropdown = document.querySelector(".playlist-dropdown");

    const contentWrapper = document.querySelector(".content-wrapper");

    const navPlaylistBtn = document.querySelector(".nav-playlist-btn");
    const navArtistsBtn = document.querySelector(".nav-artists-btn");
    const libraryContent = document.querySelector(".library-content");

    const artistHero = document.querySelector(".artist-hero");
    const artistControls = document.querySelector(".artist-controls");
    const popularSection = document.querySelector(".popular-section");
    const hitsSection = document.querySelector(".hits-section");
    const artistsSection = document.querySelector(".artists-section");
    const playlistSection = document.querySelector(".playlist-section");
    const playlistHeader = document.querySelector(".playlist-header");

    const trackList = document.querySelector(".track-list");

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
                message:
                    "Đăng ký thất bại! Vui lòng kiểm tra lại thông tin đăng ký.",
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
    //Dang nhap de tao playlist
    createPlaylistModal.addEventListener("click", async function () {
        const user = localStorage.getItem("user");
        if (user) {
            playlistDropdown.style.top = this.offsetHeight + "px";
            playlistDropdown.style.left = this.offsetLeft + "px";
            playlistDropdown.classList.toggle("show");
        } else {
            showLoginForm();
            openModal();
            iziToast.error({
                title: "Error",
                message: "Vui lòng đăng nhập để tạo playlist!",
                position: "topCenter",
            });
        }
    });
    // Load lại danh sách playlist của mình
    navPlaylistBtn.addEventListener("click", function () {
        renderMyPlayList();
    });
    // load lại danh sách artist đã follow, chua co API de lam
    navArtistsBtn.addEventListener("click", async function () {
        const user = localStorage.getItem("user");
        if (user) {
        } else {
        }
    });
    //xử lý click vào libraryContent để mở ra 1 bộ sưu tập
    libraryContent.addEventListener("click", async function (e) {
        e.preventDefault;
        const libraryItemOld = libraryContent.querySelector(
            ".library-item.active"
        );
        libraryItemOld?.classList.remove(`active`);
        const libraryItem = e.target.closest(".library-item");

        if (libraryItem) {
            const id = libraryItem.dataset.id;
            const playlistHeader = document.querySelector(".playlist-header");
            try {
                // lấy tạm playlist theo id và lấy  tracks trend để render, sau này thì phải đổi lại thành tracks của playlist
                const playlist = await httpRequest.get(`playlists/${id}`);
                const tracks = await httpRequest.get("tracks/trending");
                console.log(tracks);

                if (tracks.tracks.length > 0) {
                    trackList.innerHTML = "";
                    let html = "";
                    tracks.tracks.forEach((track) => {
                        html += `<div class="track-item">
                                <div class="track-number">
                                    <i
                                        class="fas fa-volume-up playing-icon"
                                    ></i>
                                </div>
                                <div class="track-image">
                                    <img
                                        src="placeholder.svg?height=40&width=40"
                                        alt="Lối Nhỏ"
                                    />
                                </div>
                                <div class="track-info">
                                    <div class="track-name playing-text">
                                        Lối Nhỏ
                                    </div>
                                </div>
                                <div class="track-plays">45,686,866</div>
                                <div class="track-duration">4:12</div>
                                <button class="track-menu-btn">
                                    <i class="fas fa-ellipsis-h"></i>
                                </button>
                            </div>`;
                    });
                    trackList.innerHTML = html;
                    toggleMainContent(1);
                } else {
                    hitsSection.classList.remove("show");
                    artistsSection.classList.remove("show");
                    artistHero.classList.remove("show");
                    artistControls.classList.remove("show");
                    popularSection.classList.remove("show");
                    playlistSection.classList.add("show");
                    playlistHeader.classList.add("show");
                }
                playlistSection.innerHTML = `
                    <div class="playlist-header">
                        <i class="playlist-icon"></i>
                        <span class="playlist-title">${EscapeHtml(
                            playlist.name
                        )}</span>
                    </div>
                    <hr class="playlist-divider" />
                    <div class="playlist-content">
                        <h2 class="playlist-heading">
                            Danh sách bài hát
                        </h2>
                        <div class="playlist-search">
                            <input
                                type="text"
                                placeholder="Tìm bài hát"
                                class="myPlaylist-search"
                            />
                        </div>
                        <button class="playlist-close">
                            <span>&times;</span>
                        </button>
                    </div>
                `;
            } catch (error) {}

            libraryItem.classList.add(`active`);
        }
    });
    contentWrapper.addEventListener("click", async function (e) {
        const closePlaylist = e.target.closest(".playlist-close");
        const addTracksBtn = e.target.closest(".add-tracks-btn");
        if (closePlaylist) {
            playlistSection.classList.toggle("show");
        }
        if (addTracksBtn) {
            playlistSection.classList.toggle("show");
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
        if (
            !userAvatar.contains(e.target) &&
            !userDropdown.contains(e.target)
        ) {
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
    await renderMyPlayList();
    toggleMainContent(0);
});
function toggleMainContent(code) {
    const artistHero = document.querySelector(".artist-hero");
    const artistControls = document.querySelector(".artist-controls");
    const popularSection = document.querySelector(".popular-section");
    const hitsSection = document.querySelector(".hits-section");
    const artistsSection = document.querySelector(".artists-section");
    const playlistSection = document.querySelector(".playlist-section");
    if (code === 0) {
        artistHero.classList.remove("show");
        artistControls.classList.remove("show");
        popularSection.classList.remove("show");
        hitsSection.classList.add("show");
        artistsSection.classList.add("show");
        playlistSection.classList.remove("show");
        return;
    }
    if (code === 1) {
        artistHero.classList.add("show");
        artistControls.classList.add("show");
        popularSection.classList.add("show");
        hitsSection.classList.remove("show");
        artistsSection.classList.remove("show");
        playlistSection.classList.remove("show");
        return;
    }
    if (code === 2) {
        playlistEmpty.classList.toggle("show");
        return;
    }
}
async function addTracksToPlaylists() {}
async function renderMyPlayList() {
    const navPlaylistBtn = document.querySelector(".nav-playlist-btn");
    const navArtistsBtn = document.querySelector(".nav-artists-btn");
    const libraryContent = document.querySelector(".library-content");
    libraryContent.innerHTML = `<div class="library-content"></div>`;
    const myPlaylists = localStorage.getItem("myPlaylists");
    if (myPlaylists) {
        navPlaylistBtn.classList.add("active");
        navArtistsBtn.classList.remove("active");
        const Playlists = JSON.parse(myPlaylists);
        Playlists.forEach((playlist) => {
            const playlistItem = document.createElement("div");
            playlistItem.innerHTML = `<div class="library-item" data-id="${EscapeHtml(
                playlist.id
            )}">
              <img
                src="${
                    EscapeHtml(playlist.image_url) || "placeholder.png"
                }?height=48&width=48"
                alt="${playlist.name}"
                class="item-image" onerror=" this.onerror=null ;this.src='../placeholder.png';"
              />
              <div class="item-info">
                <div class="item-title">${playlist.name}</div>
                <div class="item-subtitle">${playlist.description}</div>
              </div>
            </div>`;
            libraryContent.appendChild(playlistItem);
        });
    }
}

async function renderUserInfo() {
    const authButtons = document.querySelector(".auth-buttons");
    const userMenu = document.querySelector(".user-menu");
    const userAvatar = document.querySelector(".user-avatar-img");
    await renderMainContent();
    try {
        const { user } = await httpRequest.get("users/me");
        localStorage.setItem("user", JSON.stringify(user));
        authButtons.classList.remove("show");
        userMenu.classList.add("show");
        userAvatar.src = `${user.avatar_url || "placeholder.png"}`;
        await getMyPlayLists();
        tippy("#userAvatar", {
            content: `${user.display_name || user.username}`,
        });
    } catch (error) {
        authButtons.classList.add("show");
        userMenu.classList.remove("show");
    }
}
async function getMyPlayLists() {
    try {
        const { playlists } = await httpRequest.get("me/playlists");
        localStorage.setItem("myPlaylists", JSON.stringify(playlists));
    } catch (error) {}
}
async function renderMainContent() {
    const contentWrapper = document.querySelector(".content-wrapper");
    contentWrapper.classList.add("show");
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
