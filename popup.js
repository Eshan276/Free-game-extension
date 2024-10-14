document.addEventListener("DOMContentLoaded", async () => {
  try {
    clearBadge();
    const response = await fetch("https://gg.deals/news/freebies/");
    const text = await response.text();
    console.log("Fetched HTML content:", text);
    const response2 = await fetch(
      "https://gg.deals/news/feed/?availability=1&type=6&utm_source=eshan"
    );

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const doc2 = parser.parseFromString(
      await response2.text(),
      "application/xml"
    );
    let links = [];
    // doc.querySelectorAll("article").forEach((article) => {
    //   if (article.classList.contains("active")) {
    //     const link = article.querySelector("a.full-link");
    //     const image = article.querySelector("img");

    //     if (link && image) {
    //       links.push({
    //         headline: link.textContent.trim(),
    //         url: "https://gg.deals" + link.getAttribute("href"),
    //         imageUrl: image.src,
    //       });
    //     }
    //   }
    // });

    console.log("Parsed links:", links);

    const linksDiv = document.getElementById("links");
    linksDiv.innerHTML = "";
    const testing = document.getElementById("testing");
    testing.innerHTML = "";

    // Parse and display RSS feed items
    doc2.querySelectorAll("item").forEach((item) => {
      const title = item.querySelector("title").textContent;
      const description = item.querySelector("description").textContent;
      const link = item.querySelector("link").textContent;

      // Extract image URL from description
      const imgMatch = description.match(/<img src="([^"]+)"/);
      const imageUrl = imgMatch ? imgMatch[1] : "";
      if (link && imageUrl) {
        links.push({
          headline: title,
          url: link, //"https://gg.deals" + link.getAttribute("href"),
          imageUrl: imageUrl,
        });
      }
      // const itemDiv = document.createElement("div");
      // itemDiv.classList.add("item-container");

      // const image = document.createElement("img");
      // image.src = imageUrl;
      // image.alt = title;

      // const titleDiv = document.createElement("div");
      // titleDiv.classList.add("item-title");
      // titleDiv.textContent = title;

      // const anchor = document.createElement("a");
      // anchor.href = link;
      // anchor.textContent = link;
      // anchor.target = "_blank"; // Open link in new tab

      // itemDiv.appendChild(image);
      // itemDiv.appendChild(titleDiv);
      // itemDiv.appendChild(anchor);

      // testing.appendChild(itemDiv);
    });

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
        anchor.target = "_blank"; // Open link in new tab

        linkInfoDiv.appendChild(headline);
        linkInfoDiv.appendChild(anchor);
        const button = document.createElement("button");
        button.textContent = "Go To Deal";
        button.addEventListener("click", async () => {
          try {
            const response = await fetch(link.url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");

            const dealLink = doc.evaluate(
              '//a[contains(text(), "Go To Deal")]',
              doc,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;

            let dealUrl = dealLink ? dealLink.href : "";
            if (dealUrl && !dealUrl.startsWith("http")) {
              dealUrl = `https://gg.deals${"/us" + dealUrl.split("/us")[1]}`;
            }
            if (dealUrl) {
              window.open(dealUrl, "_blank");
            } else {
              console.error("Deal URL not found.");
            }
          } catch (error) {
            console.error("Error fetching deal URL:", error);
          }
        });
        linkInfoDiv.appendChild(button);
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
