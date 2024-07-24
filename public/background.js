const suportedTypes = {
  VIDEO: "VIDEO",
  PLAYLIST: "PLAYLIST",
};
const allSupportedTypes = Object.values(suportedTypes);

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (!allSupportedTypes.includes(request.type)) {
    return;
  }

  chrome.cookies?.get(
    { url: "https://tune-vault-api.online", name: "token" },
    (cookie) => {
      if (!cookie) {
        return;
      }
      const token = cookie.value;
      const id = request.message;
      const url =
        request.type === suportedTypes.VIDEO
          ? `https://www.youtube.com/watch?v=${id}`
          : `https://www.youtube.com/playlist?list=${id}`;

      fetch("https://tune-vault-api.online/discord/play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });
    },
  );

  sendResponse({ message: "SUCCESS" });
  return true;
});
