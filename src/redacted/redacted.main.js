//peak going to love my js :3
let tabs = [];
let tabID = [0];
let aa;
let bb;
let currentFrame;
let activeTab;

function switchTo(url) {
  try {
    document.querySelector(".iframe-frame").contentWindow.location.href = url;
  } catch (e) {
    console.log("[Redacted.Error] Error Switching frame src" + e);
    alert("[Redacted.Error] Error Switching frame src" + e);
  }
}

function newTab() {
  aa = document.getElementById("tabContainer");
  bb = document.getElementById("iframe");

  try {
    let ti = document.querySelector(".tab.-selected");
    let x = document.querySelector(".iframe-frame");

    ti.classList.remove("-selected");
    x.setAttribute("class", "frame_bt");
  } catch (e) {
    console.log("[Redacted.error] " + e);
  }

  const nn = {
    i: tabID[tabID.length - 1] + 1,
    ti: "Home",
    s: "iframe-index.html",
    x: "/imgs/newtab.png",
    b: document.createElement("div"),
    m: document.createElement("iframe"),
  };
  let tt = nn.b;
  const sv = `<div class="tab-x" onclick="rmTab(${nn.i})"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></div>`;

  //tab type shit
  tt.classList.add("tab", "-selected");
  tt.id = nn.i;
  tt.innerHTML = `<button class="tabbtn" onclick="switchTab(${nn.i})"><div class="tab-icon"><img src="${nn.x}" id="tab-icon" alt="t_icon" /></div><p class="tab-title" id="tab-title">${nn.ti}</p></button>${sv}`;

  nn.m.src = nn.s;
  nn.m.id = nn.i;
  nn.m.classList.add("iframe-frame");

  bb.appendChild(nn.m);
  aa.appendChild(tt);

  tabID.push(nn.i);
  tabs.push(nn);
  zz();
  console.log("[Redacted.complete] Tab Created!");
}

function rmTab(tabId) {
  const ff = document.querySelector(`iframe[id='${tabId}']`);
  const gg = document.getElementById(`${tabId}`);
  if (!ff || !gg) return "gg and ff not found";
  if (gg.classList.contains("-selected")) {
    tabs = tabs.filter((t) => t.i !== tabId);
    tabID = tabID.filter((t) => t !== tabId);
    if (tabs.length > 0) {
      switchTab(tabs[0].i);
    }
  }

  ff.remove();
  gg.remove();

  tabs = tabs.filter((e) => e.tabID !== tabId);
  tabID = tabID.filter((e) => e !== tabId);
  console.log("[Redacted.complete] Tab Deleted!");
}

function switchTab(tabId) {
  const d = document.querySelector(".iframe-frame");
  const e = document.querySelector(".tab.-selected");

  if (d) {
    d.classList.remove("iframe-frame");
    d.classList.add("frame_bt");
  }
  if (e) e.classList.remove("-selected");

  const a = document.querySelector(`iframe[id='${tabId}']`);
  const b = document.querySelector(`div[id='${tabId}']`);

  if (a) {
    a.classList.add("iframe-frame");
    a.classList.remove("frame_bt");
  }
  if (b) b.classList.add("-selected");
}

function zz() {
  currentFrame = document.querySelector(".iframe-frame");
  activeTab = document.querySelector(".tab.-selected");
  let frameTitle = currentFrame.contentWindow.document.title;
  let tabName = activeTab.querySelector(".tab-title");
  let tIcon = activeTab.querySelector(".tab-icon");
  const spliturl = __uv$config.decodeUrl(
    currentFrame.contentWindow.location.href
      .replace(location.protocol + "//" + location.host, "")
      .replace(__uv$config.prefix, ""),
  );

  let id = currentFrame.id - 1;
  tabName.innerText = frameTitle;
  tabs[id].title = frameTitle;
  if (
    spliturl === "/kfpaoe/ildgx,hvmn" ||
    spliturl === "a`owt8bnalk" ||
    spliturl === "/ci,hvmn" ||
    spliturl === "/pefaatgd,hvmn" ||
    spliturl === "/vwkni.jtol"
  ) {
    tIcon.querySelector("img").src = "/imgs/newtab.png";
    tabs[id].icon = "/imgs/newtab.png";
  } else {
    tIcon.querySelector("img").src = "/api/icons/v1?url=" + spliturl;
    tabs[id].icon = "/api/icons/v1?url=" + spliturl;
  }
  try {
    if (
      document.activeElement === document.getElementById("input-search") ||
      document.activeElement === document.querySelector(".input-search")
    ) {
    } else {
      //check for sunset links
      switch (spliturl) {
        case "/ci,hvmn":
          document.getElementById("input-search").value = "sunset://ai";
          document.querySelector(".input-search").value = "sunset://ai";
          break;
        case "/kfpaoe/ildgx,hvmn":
          document.getElementById("input-search").value = "sunset://home";
          document.querySelector(".input-search").value = "sunset://home";
          break;
        case "a`owt8bnalk":
          document.getElementById("input-search").value = "sunset://blank";
          document.querySelector(".input-search").value = "sunset://blank";
          break;
        case "/pefaatgd,hvmn":
          document.getElementById("input-search").value = "sunset://games";
          document.querySelector(".input-search").value = "sunset://games";
          break;
        case "/vwkni.jtol":
          document.getElementById("input-search").value = "sunset://games";
          document.querySelector(".input-search").value = "sunset://games";
          break;
        default:
          document.getElementById("input-search").value = spliturl;
          document.querySelector(".input-search").value = spliturl;
          break;
      }
    }
  } catch (e) {
    console.log("[Redacted.error] Failed setting URL! " + e);
  }
}
const lls = `function onclick(event) {`;
document.addEventListener("DOMContentLoaded", function () {
  newTab();
  loadBookmarks();
  document.getElementById("tool").addEventListener("click", tool);
  document.getElementById("g").addEventListener("click", function () {
    switchTo("/redacted.html");
  });
  document.getElementById("a").addEventListener("click", function () {
    switchTo("/twink.html");
  });
  document.getElementById("home").addEventListener("click", function () {
    switchTo("/iframe-index.html");
  });
  document.getElementById("aa").addEventListener("click", function () {
    switchTo("/ai.html");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "`") {
      top.location.href = "https://google.com";
    }
  });
  let bk = document.querySelectorAll(".favorite");
  bk.forEach((b) => {
    b.addEventListener("contextmenu", function (event) {
      console.log("eeeee");
      event.preventDefault();
      const onclick = event.currentTarget.onclick.toString();
      console.log(onclick);
      //jank danky!!!!
      try {
        const bookmarkk = onclick
          .replace(lls, "")
          .replace("launch(", "")
          .replace(")", "")
          .replace("}", "")
          .replace("'", ``)
          .replace("'", ``)
          .trim();
        let bookmarkArr = JSON.parse(localStorage.getItem("bookmarks"));
        const newbk = bookmarkArr.filter((b) => {
          return b !== bookmarkk;
        });
        event.currentTarget.remove();
        localStorage.setItem("bookmarks", JSON.stringify(newbk));
        console.log("[Redacted.complete] Bookmark Removed ", bookmarkk);
      } catch (error) {
        console.error("[Redacted.Error] ", error);
      }
    });
  });
  console.log("[Redacted.Service] Loaded!");
});

async function launch(url) {
  await newTab();
  document.querySelector(".iframe-frame").contentWindow.location.href =
    __uv$config.prefix + __uv$config.encodeUrl(url);
}

setInterval(function () {
  zz();
  fg();
  //alert("join the discord server! https://discord.gg/By73SDzkCQ")
}, 1000);

function tool() {
  openModal("tools-modal");
}

//that one thing that lets us search
document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".input-search");
  const asda = document.getElementById("input-search");
  input.addEventListener("keydown", handleInput);
  asda.addEventListener("keydown", handleInput);

  function handleInput(e) {
    if (e.key !== "Enter") return;
    const query = formatSearch(input.value);
    switch (query) {
      case "sunset://games":
        document.querySelector(".iframe-frame").contentWindow.location.href =
          "/redacted.html";
        break;
      case "sunset://home":
        document.querySelector(".iframe-frame").contentWindow.location.href =
          "/iframe-index.html";
        break;
      case "sunset://blank":
        document.querySelector(".iframe-frame").contentWindow.location.href =
          "about:blank";
        break;
      case "sunset://apps":
        document.querySelector(".iframe-frame").contentWindow.location.href =
          "/twink.html";
        break;
      default:
        document.querySelector(".iframe-frame").contentWindow.location.href =
          __uv$config.prefix + __uv$config.encodeUrl(query);
        break;
    }
  }
  // i got to make a 404 page right 0_o
  // Yes UWU
  // FUCK
  function formatSearch(query) {
    const engine = localStorage.getItem("engine");
    if (engine === null) {
      localStorage.setItem("engine", "https://google.com/search?q=");
    }

    try {
      return new URL(query).toString();
    } catch (e) {}

    try {
      const url = new URL(`https://${query}`);
      if (url.hostname.includes(".")) return url.toString();
    } catch (e) {}

    return new URL(engine + `${query}`).toString();
  }
});

//error type shit
window.onerror = function (error) {
  console.log("[Redacted.error] " + error);
};
