const PLAYLIST_TITLE_CLASS = "ytmusic-responsive-header-renderer";
const SONG_LINK_CLASS = "yt-formatted-string";

document.addEventListener("DOMContentLoaded", bootstrap());

function bootstrap() {
  createCustomStyles();

  const linkClass = `[class*="${SONG_LINK_CLASS}"]`;
  const validElementsList = document.querySelectorAll(
    `a[href*='watch?']${linkClass}, a[href*='list?']${linkClass}, h2.${PLAYLIST_TITLE_CLASS}`,
  );

  validElementsList.forEach(appnedButtonsToElements);

  const docBody = document.querySelector("body");
  function mutationCallback(mutation) {
    mutation.forEach((mutation) => {
      if (!mutation.addedNodes.length) {
        return;
      }
      mutation.addedNodes.forEach(appnedButtonsToElements);
    });
  }

  observe(docBody, mutationCallback);
}

function appnedButtonsToElements(node) {
  const isSongLink =
    node.tagName === "A" &&
    (node.href.includes("watch?") || node.href.includes("list?")) &&
    node.getAttribute("class").includes(SONG_LINK_CLASS) &&
    node.childNodes.length === 1;

  const isPlaylistTitle =
    node.tagName === "H2" &&
    node.getAttribute("class").includes(PLAYLIST_TITLE_CLASS);

  if (node.nodeType !== 1 || (!isSongLink && !isPlaylistTitle)) {
    return;
  }

  node.setAttribute(
    "class",
    "tune-vault__wrapper " + node.getAttribute("class"),
  );

  const playButton = document.createElement("div");

  const large = isPlaylistTitle;
  playButton.innerHTML = getPlayIcon(large);
  playButton.setAttribute("class", `tune-vault-play ${large ? " large" : ""}`);

  playButton.addEventListener("click", (e) => {
    const supportedTypes = {
      VIDEO: "VIDEO",
      PLAYLIST: "PLAYLIST",
    };
    e.preventDefault();
    e.stopPropagation();

    if (!node.href) {
      const linkParams = new URLSearchParams(window.location.search);
      const type = supportedTypes.PLAYLIST;
      const id = linkParams.get("list");

      chrome.runtime.sendMessage({ message: id, type }, (response) => {
        console.log({ RESPONSE: response?.message });
      });
      return;
    }

    const linkParams = new URLSearchParams(node.href.split("?")[1]);
    const type = node.href?.includes("playlist?")
      ? supportedTypes.PLAYLIST
      : supportedTypes.VIDEO;

    const id =
      type === supportedTypes.PLAYLIST
        ? linkParams.get("list")
        : linkParams.get("v");

    chrome.runtime.sendMessage({ message: id, type }, (response) => {
      console.log({ RESPONSE: response?.message });
    });

    setTimeout(() => {
      alert("АРТЬОМ ЛОХ!!!! 😂😂😂");
    }, 2000);
  });

  node.appendChild(playButton);
}

function createCustomStyles() {
  const docBody = document.querySelector("body");
  const styleElem = document.createElement("style");
  styleElem.innerHTML = `
    .tune-vault__wrapper {
      display: flex!important;
      align-items: center;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .tune-vault-play {
      width: 15px;
      height: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tune-vault-play.large {
      width: 20px;
      height: 20px;
      padding-top: 5px;
    }
    .tune-vault-play:hover {
      cursor: pointer;
      transform: scale(1.1);
    }
  `;
  docBody.appendChild(styleElem);
}

function observe(obj, callback) {
  if (!obj || obj.nodeType !== 1) {
    return;
  }

  const mutationObserver = new window.MutationObserver(callback);
  mutationObserver.observe(obj, { childList: true, subtree: true });

  return mutationObserver;
}

function getPlayIcon(large = false) {
  return `
  <svg width="${large ? "20px" : "15px"}" height="${large ? "20px" : "15px"}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">

  <g id="SVGRepo_bgCarrier" stroke-width="0"/>

  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

  <g id="SVGRepo_iconCarrier"> <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/> </g>

  </svg>`;
}
