// Function to fetch games from GG Deals
async function fetchGames() {
  try {
    const response = await fetch("https://gg.deals/news/freebies/");
    const text = await response.text();
    console.log("Fetched HTML content:", text);

    // const parser = new DOMParser();
    // const doc = parser.parseFromString(text, "text/html");

    let newGames = [];
    doc.querySelectorAll("article").forEach((article) => {
      if (article.classList.contains("active")) {
        const link = article.querySelector("a.full-link");
        const image = article.querySelector("img");

        if (link && image) {
          newGames.push({
            headline: link.textContent.trim(),
            url: "https://gg.deals" + link.getAttribute("href"),
            imageUrl: image.src,
          });
        }
      }
    });

    return newGames;
  } catch (error) {
    //console.error("Error fetching games:", error);
    return [];
  }
}

// Function to set badge with red dot
function setBadge() {
  chrome.action.setBadgeText({ text: "•" });
  chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
}

// Function to clear the badge
function clearBadge() {
  chrome.action.setBadgeText({ text: "" });
}

// Function to check for new games and update storage
async function checkForNewGames() {
  console.log("Checking for new games...");
  const newGames = await fetchGames();
  chrome.storage.local.get("games", (result) => {
    const storedGames = result.games || [];

    const newGameFound = newGames.some((newGame) => {
      return !storedGames.find((storedGame) => storedGame.url === newGame.url);
    });

    if (newGameFound) {
      setBadge();
    }

    chrome.storage.local.set({ games: newGames });
  });
}

// Setup alarm to check every 2 hours
chrome.alarms.create("checkForNewGames", { periodInMinutes: 120 });

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkForNewGames") {
    checkForNewGames();
  }
});

// Initial check when extension is installed or reloaded
chrome.runtime.onInstalled.addListener(() => {
  checkForNewGames();
  clearBadge(); // Clear badge when the extension is first installed/reloaded
});

// Listener for action icon click to execute content script
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
});
