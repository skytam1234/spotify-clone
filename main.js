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
    //const navSection = document.querySelector(".nav-section");
    const createPlaylistModal = document.querySelector(".create-btn");
    const playlistDropdown = document.querySelector(".playlist-dropdown");

    const contentWrapper = document.querySelector(".content-wrapper");

    const navPlaylistBtn = document.querySelector(".nav-playlist-btn");
    const navArtistsBtn = document.querySelector(".nav-artists-btn");
    const libraryContent = document.querySelector(".library-content");
    const searchLibraryBtn = document.querySelector(".search-library-btn");
    const searchLibrary = document.querySelector("#searchLibrary");
    const dropdownSearchLibrary = document.querySelector(
        ".dropdown-search-library"
    );
    //const searchInput = document.querySelector(".search-input");

    const artistHero = document.querySelector(".artist-hero");
    const artistControls = document.querySelector(".artist-controls");
    const popularSection = document.querySelector(".popular-section");
    const hitsSection = document.querySelector(".hits-section");
    const artistsSection = document.querySelector(".artists-section");
    const playlistSection = document.querySelector(".playlist-section");
    const playlistSearchInput = document.querySelector(
        "#playlist-search__input"
    );
    const dropdownPlaylistContent = document.querySelector(
        ".dropdown-playlist-content"
    );

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
    modalClose.addEventListener("click", () => {
        authFormLogin.reset();
        authFormSignup.reset();
        closeModal();
    });

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
        let isSuccess = false;
        const certificate = {
            email: signupEmail.value,
            username: signupEmail.value.split("@")[0],
            password: signupPassword.value,
            display_name: signupEmail.value.split("@")[0],
            bio: "Test bio",
            country: "US",
        };
        try {
            const { user, access_token, message } = await httpRequest.post(
                "auth/register",
                certificate
            );
            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("user", JSON.stringify(user));
            iziToast.success({
                title: "OK",
                message: message,
                position: "topCenter",
            });
            this.reset();
            closeModal();
            renderUserInfo();
            isSuccess = true;
        } catch (error) {
            iziToast.error({
                title: "Error",
                message: error,
                position: "topCenter",
            });
        }
        if (isSuccess) {
            const playlist = await getMyPlayLists();
            myPlaylist([playlist]);
        }
    });
    // Đăng nhập
    authFormLogin.addEventListener("submit", async function (e) {
        e.preventDefault();
        let isSuccess = false;
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
            isSuccess = true;
        } catch (error) {
            console.error("Error during login:", error);
            iziToast.error({
                title: "Error",
                message:
                    "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.",
                position: "topCenter",
            });
        }
        if (isSuccess) {
            const playlist = await getMyPlayLists();
            await myPlaylist([playlist]);
        }
    });

    createPlaylistModal.addEventListener("click", async function (e) {
        e.preventDefault();
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
    playlistDropdown.addEventListener("click", async function (e) {
        e.preventDefault();
        const createPlaylist = e.target.closest("#createPlaylist");
        if (createPlaylist) {
            const user = JSON.parse(localStorage.getItem("user"));
            const data = {
                name: "Dương Đức Tâm",
                description: `Danh sách đang phát. ${user.display_name}`,
                is_public: true,
                image_url: "https://example.com/playlist-cover.jpg",
            };
            const res = await httpRequest.post("playlists", data);
            const playlist = res.playlist;
            const playlistItem = document.createElement("div");
            playlistItem.innerHTML = `<div class="library-item active" data-id="${EscapeHtml(
                playlist.id
            )}">
              <img
                src="${
                    EscapeHtml(playlist.image_url) || "placeholder.svg"
                }?height=48&width=48"
                alt="${EscapeHtml(playlist.name || playlist.title)}"
                class="item-image" onerror=" this.onerror=null ;this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9C76COoU19vxN_sXxYEFBhFbJlfN42zstWg&s';"
              />
              <div class="item-info">
                <div class="item-title">${EscapeHtml(
                    playlist.name || playlist.title
                )}</div>
                <div class="item-subtitle">${
                    playlist.description || playlist.subtitle
                }</div>
              </div>
            </div>`;
            const likeItem = libraryContent.children[1];
            libraryContent.insertBefore(playlistItem, likeItem);
            playlistDropdown.classList.remove("show");
            await getMyPlayLists();
            toggleMainContent(false, false, true, true, true, false);
        }
    });
    // Load lại danh sách playlist của mình
    navPlaylistBtn.addEventListener("click", async function () {
        const playlists = JSON.parse(localStorage.getItem("myPlaylists"));
        await myPlaylist([playlists], "playlist");
    });
    // load lại danh sách artist đã follow, chua co API de lam
    navArtistsBtn.addEventListener("click", async function () {
        await myArtistFollows();
    });
    //xử lý click vào libraryContent để mở ra 1 bộ sưu tập
    libraryContent.addEventListener("click", async function (e) {
        e.preventDefault;
        const libraryItemOld = libraryContent.querySelector(
            ".library-item.active"
        );
        const dropdownSearchLibrary =
            libraryItemOld?.classList.remove(`active`);
        const libraryItem = e.target.closest(".library-item");
        trackList.innerHTML = "";
        dropdownPlaylistContent.innerHTML = "";
        playlistSearchInput.value = "";

        if (libraryItem) {
            const id = libraryItem.dataset.id;
            localStorage.setItem("currentPlaylist", JSON.stringify(id));
            const playlistHeader = document.querySelector(".playlist-header");
            try {
                const playlist = await httpRequest.get(`playlists/${id}`);
                const tracks = await httpRequest.get(`playlists/${id}/tracks`);
                if (tracks.tracks.length > 0) {
                    trackList.innerHTML = "";
                    let html = "";
                    //thêm <i class="fas fa-volume-up playing-icon"></i>  vào tracks-number sẽ có cá loa
                    tracks.tracks.forEach((track) => {
                        html += `<div class="track-item">
                                <div class="track-number">
                                                                                                           
                                </div>
                                <div class="track-image">
                                    <img
                                        src="http://spotify.f8team.dev/${
                                            track.track_image_url
                                        }?height=40&width=40"
                                        alt="Lối Nhỏ"
                                    />
                                </div>
                                <div class="track-info">
                                    <div class="track-name playing-text">
                                        ${track.track_title}
                                    </div>
                                </div>
                                <div class="track-plays">${
                                    track.track_play_count
                                }</div>
                                <div class="track-duration">${
                                    (track.track_duration -
                                        (track.track_duration % 60)) /
                                    60
                                }:${track.track_duration % 60}</div>
                                <button class="track-menu-btn">
                                    <i class="fas fa-ellipsis-h"></i>
                                </button>
                            </div>`;
                    });
                    trackList.innerHTML = html;
                    toggleMainContent(false, false, true, true, true, false);
                } else {
                    const artistHeroTitle =
                        document.querySelector(".artist-hero-title");
                    const artistHeroSubtitle = document.querySelector(
                        ".artist-hero-subtitle"
                    );

                    artistHeroTitle.textContent = playlist.name;
                    artistHeroSubtitle.textContent = playlist.description;
                    toggleMainContent(false, false, true, false, true, true);
                }
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
    playlistSection.addEventListener("click", async (e) => {
        e.preventDefault();
        const addTrackToList = e.target.closest("#add-track-to-list");
        const trackItem = e.target.closest(".track-item");

        if (addTrackToList) {
            try {
                const id = trackItem.dataset.id;
                const data = {
                    track_id: id,
                    position: "1",
                };
                console.log(data);
                const playlistId = JSON.parse(
                    localStorage.getItem("currentPlaylist")
                );

                const res = await httpRequest.post(
                    `playlists/${playlistId}/tracks`,
                    data
                );

                const track = await httpRequest.get(
                    `tracks/${trackItem.dataset.id}`
                );
                const divElement = document.createElement("div");
                divElement.innerHTML = `<div class="track-item">
                                    <div class="track-number">
                                    </div>
                                    <div class="track-image">
                                        <img
                                            src="${
                                                EscapeHtml(
                                                    track.album_cover_image_url
                                                ) || "placeholder.svg"
                                            }?height=40&width=40"
                                            alt="${EscapeHtml(trackItem.title)}"
                                        />
                                    </div>
                                    <div class="track-info">
                                        <div class="track-name playing-text">
                                            ${track.title}
                                        </div>
                                    </div>
                                    <div class="track-plays">${
                                        track.play_count
                                    }</div>
                                    <div class="track-duration">${
                                        (track.duration -
                                            (track.duration % 60)) /
                                        60
                                    }:${track.duration % 60}</div>
                                    <button class="track-menu-btn">
                                        <i class="fas fa-ellipsis-h"></i>
                                    </button>
                                </div>`;
                trackList.appendChild(divElement);
            } catch (error) {
                throw error;
            }
        }
    });
    searchLibraryBtn.addEventListener("click", () => {
        searchLibrary.value = "";
        searchLibrary.focus();
        dropdownSearchLibrary.classList.toggle("open");
    });
    let timeDelay;
    searchLibrary.addEventListener("input", (e) => {
        clearTimeout(timeDelay);
        timeDelay = setTimeout(async () => {
            const para = searchLibrary.value;
            if (para) {
                const path = `search?q=${para}&type=all&limit=20&offset=0`;
                const result = await search(path);
                const arr = [
                    result.albums,
                    result.tracks,
                    result.artists,
                    result.playlists,
                ];
                await myPlaylist(arr);

                console.log(arr);
            } else {
                const playlists = JSON.parse(
                    localStorage.getItem("myPlaylists")
                );
                await myPlaylist([playlists]);
            }
        }, 1000);
    });

    playlistSearchInput.addEventListener(
        "input",
        async () => {
            clearTimeout(timeDelay);
            timeDelay = setTimeout(async () => {
                const value = playlistSearchInput.value;
                if (value) {
                    const path = `search?q=${value}&type=track&limit=10`;
                    const result = await search(path);
                    const tracks = result.tracks;

                    dropdownPlaylistContent.innerHTML = "";
                    let html = "";
                    //thêm <i class="fas fa-volume-up playing-icon"></i>  vào tracks-number sẽ có cá loa
                    if (tracks) {
                        tracks.forEach((track, index) => {
                            html += `<div class="track-item" data-id="${
                                track.id
                            }">
                                <div class="track-number">
                                        ${
                                            index + 1
                                        }                                                                   
                                </div>
                                <div class="track-image">
                                    <img
                                        src="${
                                            EscapeHtml(track.image_url) ||
                                            "placeholder.svg"
                                        }?height=40&width=40"
                                        alt="Lối Nhỏ"
                                    />
                                </div>
                                <div class="track-info">
                                    <div class="track-name playing-text">
                                        ${EscapeHtml(track.title)}
                                    </div>
                                </div>
                                <div class="track-info">
                                    <div class="track-name playing-text">
                                        ${EscapeHtml(track.subtitle)}
                                    </div>
                                </div>
                                <div class="track-plays">${EscapeHtml(
                                    track.track_play_count
                                )}</div>
                                <div class="track-duration">${EscapeHtml(
                                    (track.additional_info.duration -
                                        (track.additional_info.duration % 60)) /
                                        60
                                )}:${EscapeHtml(
                                track.additional_info.duration % 60
                            ).padStart(2, "0")}</div>
                                <button class="track-menu-btn " id="add-track-to-list">
                                    Thêm
                                </button>
                            </div>`;
                        });
                        dropdownPlaylistContent.innerHTML = html;
                    }
                }
            });
        },
        600
    );
});

// User Menu Dropdown Functionality
document.addEventListener("DOMContentLoaded", function () {
    const userAvatar = document.getElementById("userAvatar");
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");
    const playlistDropdown = document.querySelector(".playlist-dropdown");
    const createPlaylistModal = document.querySelector(".create-btn");

    // Toggle dropdown when clicking avatar
    userAvatar.addEventListener("click", function (e) {
        e.stopPropagation();
        userDropdown.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        e.preventDefault();
        if (
            !userAvatar.contains(e.target) &&
            !userDropdown.contains(e.target)
        ) {
            userDropdown.classList.remove("show");
        }
        if (!playlistDropdown.contains(e.target) && !createPlaylistModal) {
            playlistDropdown.classList.remove("show");
        }
    });

    // Close dropdown when pressing Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && userDropdown.classList.contains("show")) {
            userDropdown.classList.remove("show");
        }
    });

    // Handle logout button click
    logoutBtn.addEventListener("click", async function () {
        // Close dropdown first
        await httpRequest.post("auth/logout");
        userDropdown.classList.remove("show");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("myPlaylists");
        localStorage.removeItem("artistFollows");
        renderUserInfo();
        await myPlaylist();
        await httpRequest.post("auth/logout");
        // TODO: Students will implement logout logic here
    });
});

// Other functionality
document.addEventListener("DOMContentLoaded", async function () {
    // TODO: Implement other functionality here
    toggleMainContent(true, true);
    await tracksTrending();
    await artistsTrending();
    await renderUserInfo();
    const myPlaylists = JSON.parse(localStorage.getItem("myPlaylists"));
    if (myPlaylists) {
        await myPlaylist([myPlaylists], "playlist");
    }
});
async function search(path) {
    try {
        const { results } = await httpRequest.get(path);
        return results;
    } catch (error) {}
}
function toggleMainContent(
    hitsSectionShow,
    artistsSectionShow,
    artistHeroShow,
    artistControlsShow,
    popularSectionShow,
    playlistSectionShow
) {
    const artistHero = document.querySelector(".artist-hero");
    const artistControls = document.querySelector(".artist-controls");
    const popularSection = document.querySelector(".popular-section");
    const hitsSection = document.querySelector(".hits-section");
    const artistsSection = document.querySelector(".artists-section");
    const playlistSection = document.querySelector(".playlist-section");
    artistHeroShow
        ? artistHero.classList.add("show")
        : artistHero.classList.remove("show");
    artistControlsShow
        ? artistControls.classList.add("show")
        : artistControls.classList.remove("show");
    popularSectionShow
        ? popularSection.classList.add("show")
        : popularSection.classList.remove("show");
    hitsSectionShow
        ? hitsSection.classList.add("show")
        : hitsSection.classList.remove("show");
    artistsSectionShow
        ? artistsSection.classList.add("show")
        : artistsSection.classList.remove("show");
    playlistSectionShow
        ? playlistSection.classList.add("show")
        : playlistSection.classList.remove("show");
}
async function renderUserInfo() {
    const authButtons = document.querySelector(".auth-buttons");
    const userMenu = document.querySelector(".user-menu");
    const userAvatar = document.querySelector(".user-avatar-img");
    try {
        const { user } = await httpRequest.get("users/me");
        localStorage.setItem("user", JSON.stringify(user));
        authButtons.classList.remove("show");
        userMenu.classList.add("show");
        userAvatar.src = `${user.avatar_url || "placeholder.svg"}`;
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
        return playlists;
    } catch (error) {}
}
async function myPlaylist(list, type) {
    const navPlaylistBtn = document.querySelector(".nav-playlist-btn");
    const navArtistsBtn = document.querySelector(".nav-artists-btn");
    const libraryContent = document.querySelector(".library-content");
    libraryContent.innerHTML = ``;
    if (list) {
        navPlaylistBtn.classList.add("active");
        navArtistsBtn.classList.remove("active");
        list.forEach((playlists) => {
            playlists.forEach((playlist) => {
                const playlistItem = document.createElement("div");
                playlistItem.innerHTML = `<div class="library-item" data-type="${EscapeHtml(
                    type || playlist.type
                )}" data-id="${EscapeHtml(playlist.id)}">
              <img
                src="${EscapeHtml(playlist.image_url)}?height=48&width=48"
                alt="${EscapeHtml(playlist.name || playlist.title)}"
                class="item-image" onerror=" this.onerror=null ;this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9C76COoU19vxN_sXxYEFBhFbJlfN42zstWg&s';"
              />
              <div class="item-info">
                <div class="item-title">${EscapeHtml(
                    playlist.name || playlist.title
                )}</div>
                <div class="item-subtitle">${
                    playlist.description || playlist.subtitle
                }</div>
              </div>
            </div>`;
                libraryContent.appendChild(playlistItem);
            });
        });
        const res = await httpRequest.get("me/tracks/liked?limit=20&offset=0");
        const divElement = document.createElement("div");
        divElement.innerHTML = `<div class="library-item active">       
                                    <div class="item-icon liked-songs">
                                        <i class="fas fa-heart"></i>
                                    </div>
                                    <div class="item-info">
                                        <div class="item-title">Liked Songs</div>
                                        <div class="item-subtitle">
                                            <i class="fas fa-thumbtack"></i>
                                            Playlist • ${res.tracks.length} songs
                                        </div>
                                    </div>
                                </div>`;
        libraryContent.prepend(divElement);
    }
}
async function getArtistFollows() {
    try {
        // chưa có API nên  lấy all artistsFollow
        const { artists } = await httpRequest.get("artists?limit=20&offset=0");
        return artists;
    } catch (error) {}
}
async function myArtistFollows() {
    const artistFollows = await getArtistFollows();
    const navPlaylistBtn = document.querySelector(".nav-playlist-btn");
    const navArtistsBtn = document.querySelector(".nav-artists-btn");
    const libraryContent = document.querySelector(".library-content");
    libraryContent.innerHTML = ``;
    if (artistFollows) {
        navPlaylistBtn.classList.remove("active");
        navArtistsBtn.classList.add("active");
        artistFollows.forEach((artist) => {
            const artistItem = document.createElement("div");
            artistItem.innerHTML = `<div class="library-item" data-type="artist" data-id="${EscapeHtml(
                artist.id
            )}">
              <img
                src="${
                    EscapeHtml(artist.image_url) || "placeholder.svg"
                }?height=48&width=48"
                alt="${artist.name}"
                class="item-image" onerror=" this.onerror=null ;this.src='placeholder.svg';"
              />
              <div class="item-info">
                <div class="item-title">${artist.name}</div>
                <div class="item-subtitle">${artist.bio}</div>
              </div>
            </div>`;
            libraryContent.appendChild(artistItem);
        });
        const res = await httpRequest.get("me/tracks/liked?limit=20&offset=0");
        const divElement = document.createElement("div");
        divElement.innerHTML = `<div class="library-item active">       
                                    <div class="item-icon liked-songs">
                                        <i class="fas fa-heart"></i>
                                    </div>
                                    <div class="item-info">
                                        <div class="item-title">Liked Songs</div>
                                        <div class="item-subtitle">
                                            <i class="fas fa-thumbtack"></i>
                                            Playlist • ${res.tracks.length} songs
                                        </div>
                                    </div>
                                </div>`;
        libraryContent.prepend(divElement);
    }
}
async function artistsTrending() {
    const res = await httpRequest.get("artists/trending?limit=20");
    const artistsGrid = document.querySelector(".artists-grid");
    let popularArtists = "";
    if (res) {
        res.artists.forEach((artist) => {
            const artistItem = `<div class="artist-card" data-type="artist" data-id="${EscapeHtml(
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
            popularArtists += artistItem;
        });
    }
    artistsGrid.innerHTML = popularArtists;
}
async function tracksTrending() {
    const res = await httpRequest.get("tracks/trending?limit=20");
    const tracksGrid = document.querySelector(".hits-grid");
    let popularTracks = "";
    if (res) {
        res.tracks.forEach((track) => {
            const trackItem = `<div class="hit-card" data-type="track" data-id="${EscapeHtml(
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
function EscapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
