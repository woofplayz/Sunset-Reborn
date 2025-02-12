function bookMark(url) {
  //prevent bookmarking sunset:// pages
  const ll = location.protocol + "//" + location.host;
  if (
    url === ll + "/twink.html" ||
    url === ll + "/iframe-index.html" ||
    url === ll + "/ai.html" ||
    url === ll + "/redacted.html"
  )
    return;
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  let durl = url.replace(ll + "/q/rockets/", "");
  let parsedUrl = __uv$config.decodeUrl(durl);

  bookmarks.push(parsedUrl);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  console.log(bookmarks);

  const alz = document.createElement("div");
  const avz = document.createElement("img");

  avz.src = "/api/icons/v1?url=" + parsedUrl;
  alz.classList.add("favorite");
  alz.setAttribute("onclick", `launch('${parsedUrl}')`);

  alz.appendChild(avz);
  alz.addEventListener("contextmenu", function (event) {
    console.log("eeeee");
    event.preventDefault();
    const onclick = event.currentTarget.onclick.toString();
    console.log(onclick);
    const bookmark = onclick
      .replace("function onclick(event) {launch(", "")
      .replace(")}", "");
    let bookmarkArr = JSON.parse(localStorage.getItem("bookmarks"));
    bookmarkArr = bookmarkArr.filter((b) => b !== bookmark);
    event.currentTarget.remove();
    localStorage.setItem("bookmarks", JSON.stringify(bookmarkArr));
  });
  document.querySelector(".favorites").appendChild(alz);
}

function loadBookmarks() {
  const z = JSON.parse(localStorage.getItem("bookmarks"));
  if (localStorage.getItem("bookmarks") === null) {
    setBookMarks();
  }
  if (localStorage.getItem("bookmarks") === "[]") return;

  try {
    z.forEach((z) => {
      const al = document.createElement("div");
      const av = document.createElement("img");

      av.src = "/api/icons/v1?url=" + z;
      al.classList.add("favorite");
      al.setAttribute("onclick", `launch('${z}')`);

      al.appendChild(av);

      document.querySelector(".favorites").appendChild(al);
    });
  } catch (e) {
    console.log("[Redacted.Error] Error loading bookmarks " + e);
  }
}

function setBookMarks() {
  let zz = [];
  let urls = [
    "https://x.com",
    "https://github.com",
    "https://discord.com",
    "https://facebook.com",
    "https://instagram.com",
    "https://spotify.com",
    "https://linkedin.com",
  ];

  urls.forEach((url) => {
    zz.push(url);
  });
  localStorage.setItem("bookmarks", JSON.stringify(zz));
  //reload bookmarks
  loadBookmarks();
}
