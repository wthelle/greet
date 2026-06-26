(function () {
  const SONGS = {
    images: "daylight.mp3",
    message: "offcampus.mp3",
  };

  const PLAY_FLAGS = {
    images: "playImagesSong",
    message: "playMessageSong",
  };

  function getSong(page) {
    const audioId = page + "-song";
    let audio = document.getElementById(audioId);

    if (!audio) {
      audio = document.createElement("audio");
      audio.id = audioId;
      audio.src = SONGS[page];
      audio.loop = true;
      audio.preload = "auto";
      document.body.appendChild(audio);
    } else if (!audio.getAttribute("src")) {
      audio.src = SONGS[page];
    }

    return audio;
  }

  function markSongForPlayback(page) {
    sessionStorage.setItem(PLAY_FLAGS[page], "true");
  }

  function playSong(page) {
    const audio = getSong(page);
    audio.volume = 1;
    return audio.play();
  }

  function playSongIfRequested(page) {
    if (sessionStorage.getItem(PLAY_FLAGS[page]) !== "true") {
      return;
    }

    playSong(page)
      .then(function () {
        sessionStorage.removeItem(PLAY_FLAGS[page]);
      })
      .catch(function () {
        document.body.addEventListener(
          "click",
          function playOnTap() {
            playSong(page)
              .then(function () {
                sessionStorage.removeItem(PLAY_FLAGS[page]);
              })
              .catch(function () {});
          },
          { once: true }
        );
      });
  }

  function setupNavButton(buttonId, page, href) {
    const button = document.getElementById(buttonId);

    if (!button) {
      return;
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      markSongForPlayback(page);

      playSong(page)
        .then(function () {
          window.location.href = href;
        })
        .catch(function () {
          window.location.href = href;
        });
    });
  }

  setupNavButton("images-btn", "images", "images.html");
  setupNavButton("message-btn", "message", "message.html");

  const currentPage = document.body.dataset.page;

  if (currentPage && SONGS[currentPage]) {
    playSongIfRequested(currentPage);

    window.addEventListener("pageshow", function () {
      playSongIfRequested(currentPage);
    });
  }
})();
