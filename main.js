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
  const playlistSearchInput = document.querySelector("#playlist-search__input");
  const dropdownPlaylistContent = document.querySelector(
    ".dropdown-playlist-content"
  );
  const signupSubmitBtn = document.querySelector(
    ".auth-form-signup .auth-submit-btn"
  );
  const loginSubmitBtn = document.querySelector(
    ".auth-form-login .auth-submit-btn"
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
    if (e.key === "Escape" && playlistDropdown.classList.contains("show")) {
      playlistDropdown.classList.remove("show");
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

  if (signupSubmitBtn) {
    signupSubmitBtn.addEventListener("click", async function (e) {
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
        authFormSignup.reset();
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
        console.log(playlist);
        myPlaylist([playlist]);
      }
    });
  }
  // Đăng nhập
  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", async function (e) {
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
        authFormLogin.reset(); // Reset the form fields
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
        console.log(playlist);
        await myPlaylist([playlist]);
      }
    });
  }

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
      try {
        const res = await httpRequest.post("playlists", data);
        const playlist = res.playlist;
        const libraryItemOld = libraryContent.querySelector(
          ".library-item.active"
        );
        localStorage.setItem("currentPlaylist", JSON.stringify(playlist.id));
        libraryItemOld.classList.remove("active");
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
      } catch (error) {}
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
    const libraryItemOld = libraryContent.querySelector(".library-item.active");
    const dropdownSearchLibrary = libraryItemOld?.classList.remove(`active`);
    const libraryItem = e.target.closest(".library-item");
    trackList.innerHTML = "";
    dropdownPlaylistContent.innerHTML = "";
    playlistSearchInput.value = "";
    if (libraryItem) {
      const id = libraryItem.dataset.id;
      localStorage.setItem("currentPlaylist", JSON.stringify(id));
      try {
        const playlist = await httpRequest.get(`playlists/${id}`);
        const tracks = await httpRequest.get(`playlists/${id}/tracks`);
        if (tracks.tracks.length > 0) {
          renderTrackList(tracks.tracks);
          musicPlayer.songList = tracks.tracks;
          const data = {
            currentPlaylist: tracks.tracks,
            currentTrackIndex: 0,
          };
          localStorage.setItem("currentPlayer", JSON.stringify(data));
          musicPlayer.initialize();
          musicPlayer.togglePlayPause();
          toggleMainContent(false, false, true, true, true, false);
        } else {
          const artistHeroTitle = document.querySelector(".artist-hero-title");
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
    const playBtnLarge = e.target.closest(".play-btn-large");
    if (closePlaylist) {
      playlistSection.classList.toggle("show");
    }
    if (addTracksBtn) {
      playlistSection.classList.toggle("show");
    }
    if (playBtnLarge) {
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
        const playlistId = JSON.parse(localStorage.getItem("currentPlaylist"));

        const res = await httpRequest.post(
          `playlists/${playlistId}/tracks`,
          data
        );

        const track = await httpRequest.get(`tracks/${trackItem.dataset.id}`);
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
                                      (track.duration - (track.duration % 60)) /
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
        const playlists = JSON.parse(localStorage.getItem("myPlaylists"));
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
              html += `<div class="track-item" data-id="${track.id}">
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
    const homeBtn = e.target.closest(".home-btn");
    if (homeBtn) {
      toggleMainContent(true, true);
      musicPlayer.isPlaying = false;
      musicPlayer.initialize();
    }
    if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove("show");
    }
    if (
      !playlistDropdown.contains(e.target) &&
      !createPlaylistModal.contains(e.target)
    ) {
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
    localStorage.removeItem("currentPlayer");
    localStorage.removeItem("currentPlaylist");
    renderUserInfo();
    toggleMainContent(true, true);
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
  const currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
  if (currentPlayer) {
    musicPlayer.songList = currentPlayer.currentPlaylist;
    musicPlayer.currentSongIndex = currentPlayer.currentTrackIndex;
    musicPlayer.initialize();
  }
});
document.addEventListener("DOMContentLoaded", async function () {
  const contentWrapper = document.querySelector(".content-wrapper");
  contentWrapper.addEventListener("click", async (e) => {
    e.preventDefault();
    const item = e.target.closest(".card-btn");
    const playerLeft = document.querySelector(".player-left");
    const playerTitle = playerLeft.querySelector(".player-title");
    const playerArtist = playerLeft.querySelector(".player-artist");
    const playerImage = playerLeft.querySelector(".player-image");
    const addTrackToLikedListBtn = playerLeft.querySelector(".add-btn");
    const iconPlay = item.querySelector(".icon-play");
    const oldIconPlayTracks = document.querySelectorAll(".fa-pause");
    if (item) {
      playerLeft.classList.remove("show");
      playerLeft.classList.add("show");
      if (item.dataset.type === "track") {
        if (oldIconPlayTracks) {
          oldIconPlayTracks.forEach((icon) => {
            icon.classList.remove("fa-pause");
            icon.classList.add("fa-play");
          });
        }
        iconPlay.classList.remove("fa-play");
        iconPlay.classList.add("fa-pause");
        const idTrack = item.dataset.id;
        const track = await getTrackById(idTrack);
        playerTitle.textContent = track.title;
        playerArtist.textContent = track.artist_name;
        playerImage.src = track.image_url;

        const data = {
          currentPlaylist: [track],
          currentTrackIndex: 0,
        };
        const currentPlaylistData = JSON.parse(
          localStorage.getItem("currentPlayer")
        );
        const currentTrackId = currentPlaylistData?.currentPlaylist[0];
        if (!currentPlaylistData || currentTrackId.id !== idTrack) {
          musicPlayer.isPlaying = true;
          musicPlayer.songList = [track];
          localStorage.setItem("currentPlayer", JSON.stringify(data));
          musicPlayer.initialize();
        } else {
          musicPlayer.togglePlayPause();
        }
      } else {
        const type = item.dataset.type;
        const id = item.dataset.id;
        const { tracks } = await httpRequest.get(
          `${type + "s/" + id}/tracks/popular`
        );
        const artist = await httpRequest.get(`artists/${id}`);
        const trackPlaylist = await getListTrackById(tracks);
        setTimeout(() => {
          toggleMainContent(false, false, true, true, true, false);
          musicPlayer.isPlaying = false;
          musicPlayer.songList = trackPlaylist;
          const data = {
            currentPlaylist: trackPlaylist,
            currentTrackIndex: 0,
          };

          localStorage.setItem("currentPlayer", JSON.stringify(data));
          musicPlayer.initialize();
          musicPlayer.togglePlayPause();
        }, 0);
      }
    }
  });
});

async function search(path) {
  try {
    const { results } = await httpRequest.get(path);
    return results;
  } catch (error) {}
}
async function getTrackById(id) {
  const track = await httpRequest.get(`tracks/${id}`);
  return track;
}
async function getListTrackById(tracks) {
  const listTrack = [];
  if (tracks) {
    for (let i = 0; i < tracks.length; i++) {
      const trackById = await httpRequest.get(`tracks/${tracks[i]?.id}`);
      listTrack[i] = trackById;
    }
  }
  return listTrack;
}
async function addTrackToLikedList(id) {
  const track = await httpRequest.get(`tracks/${id}/like`);
  return track;
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
      const artistItem = `<div class="artist-card card-btn" data-type="artist" data-id="${EscapeHtml(
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
                                        <i class="fas fa-play icon-play"></i>
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
      const trackItem = `<div class="hit-card card-btn" data-type="track" data-id="${EscapeHtml(
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
                                        <i class="fas fa-play icon-play"></i>
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
function renderTrackList(tracks) {
  console.log(tracks);
  const artistHeroTitle = document.querySelector(".artist-hero-title");
  const artistHeroSubtitle = document.querySelector(".artist-hero-subtitle");
  const heroImage = document.querySelector(".hero-image");
  const trackList = document.querySelector(".track-list");
  const { currentTrackIndex } = JSON.parse(
    localStorage.getItem("currentPlayer")
  );
  trackList.innerHTML = "";
  let html = "";
  tracks.forEach(async (track, index) => {
    html += `<div class="track-item" data-index=${index}>
                                <div class="track-number">
                                     ${
                                       index === currentTrackIndex
                                         ? '<i class="fas fa-volume-up playing-icon"></i>'
                                         : ""
                                     }                                                                      
                                </div>
                                <div class="track-image">
                                    <img
                                        src="${
                                          track.image_url ||
                                          "http://spotify.f8team.dev" +
                                            track.track_image_url ||
                                          track.track_image_url
                                        }?height=40&width=40"
                                        alt="Lối Nhỏ"
                                    />
                                </div>
                                <div class="track-info">
                                    <div class="track-name playing-text">
                                        ${track.title || track.track_title}
                                    </div>
                                </div>
                                <div class="track-plays">${
                                  track.play_count || track.track_play_count
                                }</div>
                                <div class="track-duration">${
                                  (track.duration ||
                                    track.track_duration -
                                      ((track.duration ||
                                        track.track_duration) %
                                        60)) / 60
                                }:${
      (track.duration || track.track_duration) % 60
    }</div>
                                <button class="track-menu-btn">
                                    <i class="fas fa-ellipsis-h"></i>
                                </button>
                            </div>`;
  });
  heroImage.src =
    tracks[currentTrackIndex]?.image_url ||
    tracks[currentTrackIndex]?.album_cover_image_url;
  artistHeroTitle.textContent =
    tracks[currentTrackIndex]?.title ||
    tracks[currentTrackIndex]?.track_title ||
    tracks[currentTrackIndex]?.name ||
    tracks[currentTrackIndex]?.title;
  artistHeroSubtitle.textContent =
    tracks[currentTrackIndex]?.artist_name ||
    tracks[currentTrackIndex]?.artist_name ||
    tracks[currentTrackIndex]?.description ||
    tracks[currentTrackIndex]?.bio;
  trackList.innerHTML = html;
}
const musicPlayer = {
  NEXT_SONG: 1,
  PREV_SONG: -1,
  PREV_RESET_TIME: 2,

  STORAGE_KEYS: {
    LOOP_MODE: "musicPlayer_loopMode",
    SHUFFLE_MODE: "musicPlayer_shuffleMode",
  },
  playlistContainer: document.querySelector(".playlist"),
  playLargeToggleBtn: document.querySelector(".play-btn-large"),
  playToggleBtn: document.querySelector(".play-btn"),
  currentSongTitle: document.querySelector(".current-song-title"),
  audioPlayer: document.querySelector(".audio-player"),
  playIcon: document.querySelector(".play-icon"),
  playIconLarge: document.querySelector(".play-icon-large"),
  prevBtn: document.querySelector(".btn-prev"),
  nextBtn: document.querySelector(".btn-next"),
  loopBtn: document.querySelector(".btn-loop"),
  shuffleBtn: document.querySelector(".btn-shuffle"),
  progressBar: document.querySelector(".progress-bar"),

  playerLeft: document.querySelector(".player-left"),
  playerTitle: document.querySelector(".player-title"),
  playerArtist: document.querySelector(".player-artist"),
  playerImage: document.querySelector(".player-image"),
  addLikedBtn: document.querySelector(".add-liked-btn"),

  songList: null,
  currentSongIndex: 0,
  isPlaying: false,
  isLoopMode: false,
  isShuffleMode: false,

  async initialize() {
    this.loadPlayerState();
    this.setupCurrentSong();
    this.setupEventListeners();
  },

  loadPlayerState() {
    this.isLoopMode =
      localStorage.getItem(this.STORAGE_KEYS.LOOP_MODE) === "true";
    this.isShuffleMode =
      localStorage.getItem(this.STORAGE_KEYS.SHUFFLE_MODE) === "true";
  },

  setupEventListeners() {
    this.playToggleBtn.onclick = this.togglePlayPause.bind(this);

    this.audioPlayer.onplay = () => {
      this.isPlaying = true;
      this.playIcon.classList.remove("fa-play");
      this.playIcon.classList.add("fa-pause");
    };

    this.audioPlayer.onpause = () => {
      this.isPlaying = false;
      this.playIcon.classList.remove("fa-pause");
      this.playIcon.classList.add("fa-play");
    };

    this.prevBtn.onclick = this.handleSongNavigation.bind(this, this.PREV_SONG);
    this.nextBtn.onclick = this.handleSongNavigation.bind(this, this.NEXT_SONG);

    // Sự kiện toggle chế độ lặp lại
    this.loopBtn.onclick = () => {
      this.isLoopMode = !this.isLoopMode;
      this.updateLoopButtonState();
      // Lưu trạng thái vào localStorage để giữ khi reload trang
      localStorage.setItem(this.STORAGE_KEYS.LOOP_MODE, this.isLoopMode);
    };

    // Sự kiện toggle chế độ phát ngẫu nhiên
    this.shuffleBtn.onclick = () => {
      this.isShuffleMode = !this.isShuffleMode;
      this.updateShuffleButtonState();
      // Lưu trạng thái vào localStorage để giữ khi reload trang
      localStorage.setItem(this.STORAGE_KEYS.SHUFFLE_MODE, this.isShuffleMode);
    };

    // Sự kiện cập nhật thanh tiến trình khi audio đang phát
    this.audioPlayer.ontimeupdate = () => {
      // Không cập nhật nếu user đang kéo thanh tiến trình
      if (this.progressBar.seeking) return;

      // Tính phần trăm tiến trình
      const progressPercent =
        (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
      this.progressBar.value = progressPercent || 0;
    };

    // Sự kiện khi user bắt đầu kéo thanh tiến trình
    this.progressBar.onmousedown = () => {
      this.progressBar.seeking = true;
    };

    // Sự kiện khi user thả thanh tiến trình
    this.progressBar.onmouseup = () => {
      const targetPercent = +this.progressBar.value;
      const seekTime = (this.audioPlayer.duration / 100) * targetPercent;
      this.audioPlayer.currentTime = seekTime;

      this.progressBar.seeking = false;
    };

    // Sự kiện khi bài hát kết thúc
    this.audioPlayer.onended = () => {
      this.handleSongNavigation(this.NEXT_SONG);
    };
  },

  // Xử lý điều hướng bài hát (trước/sau)
  handleSongNavigation(direction) {
    // Luôn phát khi chuyển bài dù trước đó đang pause
    this.isPlaying = true;

    const shouldResetCurrentSong =
      this.audioPlayer.currentTime > this.PREV_RESET_TIME;

    // Nếu nhấn nút "trước" và bài hát đã phát > 2 giây, thì reset về đầu bài thay vì chuyển bài
    if (direction === this.PREV_SONG && shouldResetCurrentSong) {
      this.audioPlayer.currentTime = 0;
      return;
    }

    // Xác định bài hát tiếp theo
    if (this.isShuffleMode) {
      // Nếu đang ở chế độ shuffle, chọn bài ngẫu nhiên
      this.currentSongIndex = this.getRandomSongIndex();
    } else {
      // Nếu không, chuyển theo thứ tự
      this.currentSongIndex += direction;
    }

    // Xử lý chỉ số và cập nhật player
    this.handleNewSongIndex();
  },

  // Tạo chỉ số ngẫu nhiên cho bài hát (không trùng với bài hiện tại)
  getRandomSongIndex() {
    // Nếu chỉ có <= 1 bài thì không cần random
    if (this.songList.length <= 1) {
      return this.currentSongIndex;
    }

    let randomIndex = null;
    // Tạo số ngẫu nhiên cho đến khi khác với bài hiện tại
    do {
      randomIndex = Math.floor(Math.random() * this.songList.length);
    } while (randomIndex === this.currentSongIndex);

    return randomIndex;
  },

  // Xử lý khi có chỉ số bài hát mới
  handleNewSongIndex() {
    // Đảm bảo chỉ số luôn trong phạm vi hợp lệ (0 đến length-1)
    // Sử dụng modulo để tạo vòng lặp: -1 -> length-1, length -> 0
    this.currentSongIndex =
      (this.currentSongIndex + this.songList.length) % this.songList.length;

    // Thiết lập bài hát mới và render lại playlist
    this.setupCurrentSong();
  },

  // Cập nhật trạng thái nút lặp lại
  updateLoopButtonState() {
    this.audioPlayer.loop = this.isLoopMode;
    this.loopBtn.classList.toggle("active", this.isLoopMode);
  },

  // Cập nhật trạng thái nút phát ngẫu nhiên
  updateShuffleButtonState() {
    this.shuffleBtn.classList.toggle("active", this.isShuffleMode);
  },

  // Thiết lập bài hát hiện tại (tải file, cập nhật tiêu đề, thiết lập trạng thái)
  setupCurrentSong() {
    const currentSong = this.getCurrentSong();
    if (currentSong) {
      const data = {
        currentPlaylist: this.songList,
        currentTrackIndex: this.currentSongIndex,
      };

      localStorage.setItem("currentPlayer", JSON.stringify(data));
      renderTrackList(this.songList);
      // Cập nhật tiêu đề bài hát đang phát
      this.playerLeft.classList.remove("show");
      this.playerLeft.classList.add("show");
      this.playerImage.src =
        currentSong.image_url ||
        `http://spotify.f8team.dev/${currentSong.track_image_url}` ||
        currentSong.track_image_url;
      this.playerTitle.textContent =
        currentSong.title || currentSong.track_title;
      this.playerArtist.textContent = currentSong.artist_name;

      if (!currentSong.is_liked) {
        this.addLikedBtn.classList.add("show");
      } else {
        this.addLikedBtn.classList.remove("show");
      }
    }

    // Tải file audio
    this.audioPlayer.src =
      currentSong?.audio_url || currentSong?.track_audio_url;

    // Cập nhật trạng thái các nút
    this.updateLoopButtonState();
    this.updateShuffleButtonState();

    // Sự kiện khi audio sẵn sàng phát
    this.audioPlayer.oncanplay = () => {
      // Chỉ tự động phát nếu đang trong trạng thái playing
      if (this.isPlaying) {
        this.audioPlayer.play();
      }
    };
  },

  // Lấy thông tin bài hát hiện tại
  getCurrentSong() {
    return this.songList[this.currentSongIndex];
  },

  // Toggle play/pause
  togglePlayPause() {
    if (this.audioPlayer.paused) {
      this.audioPlayer.play();
    } else {
      this.audioPlayer.pause();
    }
  },

  // Render danh sách bài hát ra HTML

  escapeHTML(html) {
    if (typeof html !== "string") {
      return "";
    }
    const tempDiv = document.createElement("div");
    tempDiv.textContent = html;
    return tempDiv.innerHTML;
  },
};
