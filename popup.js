document.addEventListener("DOMContentLoaded", async () => {
  try {
    clearBadge();
    const response = await fetch("https://gg.deals/news/freebies/");
    const text = await response.text();
    console.log("Fetched HTML content:", text);

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    let links = [];
    doc.querySelectorAll("article").forEach((article) => {
      if (article.classList.contains("active")) {
        const link = article.querySelector("a.full-link");
        const image = article.querySelector("img");

        if (link && image) {
          links.push({
            headline: link.textContent.trim(),
            url: "https://gg.deals" + link.getAttribute("href"),
            imageUrl: image.src,
          });
        }
      }
    });

    console.log("Parsed links:", links);

    const linksDiv = document.getElementById("links");
    linksDiv.innerHTML = "";

    if (links.length > 0) {
      links.forEach((link) => {
        const linkDiv = document.createElement("div");
        linkDiv.classList.add("link-container");

        const image = document.createElement("img");
        image.src = link.imageUrl;
        image.alt = link.headline;

        const linkInfoDiv = document.createElement("div");

        const headline = document.createElement("div");
        headline.classList.add("link-headline");
        headline.textContent = link.headline;

        const anchor = document.createElement("a");
        anchor.href = link.url;
        anchor.textContent = link.url;
        anchor.target = "_blank"; // Op en link in new tab

        linkInfoDiv.appendChild(headline);
        linkInfoDiv.appendChild(anchor);

        linkDiv.appendChild(image);
        linkDiv.appendChild(linkInfoDiv);

        linksDiv.appendChild(linkDiv);
      });
    } else {
      linksDiv.textContent = "No links found.";
    }
  } catch (error) {
    console.error("Error fetching and parsing links:", error);
    document.getElementById("links").textContent = "Error fetching links.";
  }
});
function clearBadge() {
  chrome.action.setBadgeText({ text: "" });
}
