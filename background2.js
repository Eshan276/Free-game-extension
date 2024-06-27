async function fetchAndParseLinks() {
  try {
    const response = await fetch("https://gg.deals/news/freebies/");
    const text = await response.text();

    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    iframe.style.display = "none";

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(text);
    doc.close();

    let links = [];
    doc.querySelectorAll("a.full-link").forEach((link) => {
      links.push({
        headline: link.textContent.trim(),
        url: link.href,
      });
    });

    document.body.removeChild(iframe);

    chrome.storage.local.set({ links });
  } catch (error) {
    console.error("Error fetching and parsing links:", error);
  }
}

chrome.runtime.onInstalled.addListener(fetchAndParseLinks);

chrome.action.onClicked.addListener(fetchAndParseLinks);
