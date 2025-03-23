const ss = "/q/sw.js";
let inputC = document.getElementById("input-search");
let inputO = document.querySelector(".input-search");
document.addEventListener("keydown", function (event) {
  if (event.altKey) {
    switch (event.key) {
      case "c":
        break;
      case "t":
        newTab();
        break;
      case "k":
        openModal("search-modal");
        break;
      case "w":
        rmTab(currentFrame.id);
        break;
      case "h":
        home();
        break;
      case "r":
        refresh();
        break;
      case 37:
        back();
        break;
    }
  }
});




function refresh() {
  document.querySelector(".iframe-frame").contentWindow.location.href =
    document.querySelector(".iframe-frame").contentWindow.location.href;
}

function forward() {
  document.querySelector(".iframe-frame").contentWindow.history.forward();
}

function backward() {
  document.querySelector(".iframe-frame").contentWindow.history.back();
}

const modals = document.querySelectorAll(".modal");

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    closeAllModals();
    modal.classList.add("visible");
  } else {
    console.error(`Modal with ID ${modalId} not found!`);
  }
}

function closeAllModals() {
  modals.forEach((modal) => {
    modal.classList.remove("visible");
  });
}

if (!localStorage.getItem("sidebar")) {
  localStorage.setItem("sidebar", "true");
}
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const sidebarContent = document.querySelector(".sidebar-content");
  const tabsSection = document.querySelector(".tabs");
  const sidebarStickOutCheckbox = document.getElementById("sidebar-stick-out");
  const iframeTopBar = document.querySelector(".iframe-top-bar");
  const iframeSvgContainer = document.getElementById("iframe-svg-container");
  const iframeBottomSvgContainer = document.getElementById(
    "iframe-bottom-svg-container"
  );
  const collapseSidebarSvg = document.getElementById("collapse-sidebar");
  const topRight = document.querySelector(".top-right");
  const bottomWrapper = document.querySelector(".bottom-wrapper");
  let iframe = document.querySelector(".iframe-frame");

  function hideAllSections() {
    Array.from(sidebarContent.children).forEach((child) => {
      if (
        !child.classList.contains("top-wrapper") &&
        !child.classList.contains("bottom-wrapper")
      ) {
        child.classList.add("hidde");
        child.classList.remove("visible");
      }
    });
  }

  let theme = localStorage.getItem("theme");
  if (theme) {
    document.body.classList.add(theme);
  }

  function setSelection(id, value) {
    let element = document.getElementById(id);
    element.value = value;
  }

  function showSpecificSections() {
    tabsSection.classList.add("visible");
    tabsSection.classList.remove("hidde");
    topRight.classList.add("visible");
    topRight.classList.remove("hidde");
    bottomWrapper.classList.add("visible");
    bottomWrapper.classList.remove("hidde");
  }

  function showAllSections() {
    Array.from(sidebarContent.children).forEach((child) => {
      child.classList.add("visible");
      child.classList.remove("hidde");
    });
  }

  function moveSvgsToIframeTopBar() {
    while (topRight.firstChild) {
      iframeSvgContainer.appendChild(topRight.firstChild);
    }
    iframeSvgContainer.insertBefore(
      collapseSidebarSvg,
      iframeSvgContainer.firstChild
    );

    while (bottomWrapper.firstChild) {
      iframeBottomSvgContainer.appendChild(bottomWrapper.firstChild);
    }

    iframeTopBar.classList.remove("hidden");
    iframeTopBar.classList.add("visible");
  }

  function moveSvgsBackToSidebar() {
    while (iframeSvgContainer.firstChild) {
      topRight.appendChild(iframeSvgContainer.firstChild);
    }
    sidebar.insertBefore(collapseSidebarSvg, sidebar.firstChild);
    document
      .querySelector(".top-wrapper")
      .insertBefore(collapseSidebarSvg, topRight);

    while (iframeBottomSvgContainer.firstChild) {
      bottomWrapper.appendChild(iframeBottomSvgContainer.firstChild);
    }

    iframeTopBar.classList.add("hidden");
    iframeTopBar.classList.remove("visible");
  }

  function toggleSidebar() {
    // Ensure sidebar element exists
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) {
      console.error("Sidebar element not found");
      return;
    }

    // Check if the sidebar is currently collapsed
    const isCollapsed = sidebar.classList.contains("collapsed");

    // Update localStorage with the new state
    localStorage.setItem("sidebar", isCollapsed ? "true" : "false");

    // Hide all sections before toggling the sidebar
    hideAllSections();

    // Toggle the collapsed class on the sidebar
    sidebar.classList.toggle("collapsed");

    // Move SVGs based on the sidebar state
    if (isCollapsed) {
      moveSvgsBackToSidebar();
    } else {
      moveSvgsToIframeTopBar();
    }

    // Show sections after a delay (e.g., for animations)
    const transitionDelay = 300; // Adjust based on CSS transition duration
    setTimeout(() => {
      if (isCollapsed) {
        showAllSections();
      } else {
        showSpecificSections();
      }
    }, transitionDelay);

    // Communicate with the iframe
    const iframe = document.querySelector(".iframe-frame");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { sidebarCollapsed: !isCollapsed }, // Send the new state
        "*" // Consider specifying the target origin for security
      );
    }
  }
  
    // Check the sidebar state in localStorage
    const sidebarState = localStorage.getItem("sidebar");
  
    // If the sidebar state is "false", toggle the sidebar
    if (sidebarState === "false") {
      console.log("Sidebar was false, attempting to toggle sidebar");
      toggleSidebar();
    } else {
      console.log("Sidebar was not false");
    }

  document
    .getElementById("collapse-sidebar")
    .addEventListener("click", toggleSidebar);

  const savedSidebarStickOut =
    localStorage.getItem("sidebarStickOut") === "true";
  sidebarStickOutCheckbox.checked = savedSidebarStickOut;
  applySidebarStickOut(savedSidebarStickOut);

  function applySidebarStickOut(shouldStickOut) {
    if (shouldStickOut) {
      sidebar.classList.add("stick-out");
    } else {
      sidebar.classList.remove("stick-out");
    }
  }

  sidebarStickOutCheckbox.addEventListener("change", function () {
    localStorage.setItem("sidebarStickOut", this.checked);
    applySidebarStickOut(this.checked);
  });

  window.addEventListener("load", function () {
    iframe = document.querySelector(".iframe-frame");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { sidebarCollapsed: sidebar.classList.contains("collapsed") },
        "*"
      );
    }
  });

  // have to define these on page startup so it can be accessible :3
  const searchEngineMap = {
    brave: "https://search.brave.com/search?q=",
    google: "https://google.com/search?q=",
    bing: "https://www.bing.com/search?q=",
    yahoo: "https://search.yahoo.com/search?p=",
    duckduckgo: "https://duckduckgo.com/?q=",
    IRS: "https://www.irs.gov/site-index-search?search=",
    Wikipedia: "https://en.wikipedia.org/w/index.php?search=",
    "AOL Search": "https://search.aol.com/aol/search?q=",
    "Ask.com": "https://www.ask.com/web?q=",
    Yandex: "https://yandex.com/search/?text=",
    "Web Crawler": "https://www.webcrawler.com/serp?q=",
    Sougou: "https://www.sogou.com/web?query=",
    Opensearch: "https://opensearch.org/docs/latest/search.html?q=",
    "100searchengines": "https://www.100searchengines.com/?q=",
    caarchives: "https://www.canada.ca/en/sr/srb.html?q=",
    dogpile: "https://www.dogpile.com/serp?q=",
    searchalot: "https://www.searchalot.com/?q=",
    libraryofcongress: "https://www.loc.gov/search/?q=",
    nationalarchives: "https://catalog.archives.gov/search?q=",
    walmart: "https://www.walmart.com/search?q=",
    refseek: "https://www.refseek.com/search?q=",
    youtube: "https://www.youtube.com/results?q=",
    myallsearch: "https://www.myallsearch.com/search?q=",
    openmd: "https://openmd.com/search?q=",
    "info.com": "https://www.info.com/serp?q=",
    opencorporates: "https://opencorporates.com/companies?q=",
    entireweb: "https://search.entireweb.com/search?q=",
    custom: null
  };
  
  const engineSelector = document.getElementById("search-engine-select");
  const storedUrl = localStorage.getItem("engine");
  const defaultEngine = searchEngineMap.brave;
  
  if (storedUrl) {
    const engineKey = Object.keys(searchEngineMap).find(key => searchEngineMap[key] === storedUrl) || "custom";
    engineSelector.value = engineKey;
  } else {
    engineSelector.value = "brave";
    localStorage.setItem("engine", defaultEngine);
  }
  
  engineSelector.onchange = (event) => {
    const selection = event.target.value;
    let url;
  
    if (selection === "custom") {
      const customUrl = prompt("Enter custom search URL (e.g., https://example.com/?q=):");
      if (!customUrl) return;
      url = customUrl.includes("?q=") ? customUrl : `${customUrl}?q=`;
    } else {
      url = searchEngineMap[selection];
    }
  
    localStorage.setItem("engine", url);
    console.log(`Search engine set to: ${url}`);
  };
});




document.addEventListener("DOMContentLoaded", function () {
  const menuSvg = document.querySelector(".menu-container svg");
  const menu = document.querySelector(".menu-container .menu");
  const sidebar = document.querySelector(".sidebar");

  function toggleMenu() {
    const isSidebarOpen = !sidebar.classList.contains("collapsed");

    const svgRect = menuSvg.getBoundingClientRect();

    const menuWidth = menu.offsetWidth;
    const centerOffset = (menuWidth - svgRect.width) / 2;

    if (isSidebarOpen) {
      menu.style.top = `${svgRect.top - menu.offsetHeight}px`;
      menu.style.left = `${svgRect.left - centerOffset}px`;
    } else {
      menu.style.top = `${svgRect.bottom + 5}px`;
      menu.style.left = `${svgRect.left - centerOffset}px`;
    }

    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    if (menuRect.right > viewportWidth) {
      menu.style.left = `${viewportWidth - menuRect.width - 20}px`;
    }

    if (menuRect.left < 0) {
      menu.style.left = "10px";
    }

    if (menu.classList.contains("visible1")) {
      menu.classList.add("closing");
      menu.classList.remove("visible1");

      setTimeout(() => {
        menu.classList.remove("closing");
        menu.style.visibility = "hidden";
      }, 300);
    } else {
      menu.style.visibility = "visible";
      menu.classList.add("visible1");
    }
  }

  menuSvg.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", function (event) {
    if (!menu.contains(event.target) && !menuSvg.contains(event.target)) {
      if (menu.classList.contains("visible1")) {
        menu.classList.add("closing");
        menu.classList.remove("visible1");

        setTimeout(() => {
          menu.classList.remove("closing");
          menu.style.visibility = "hidden";
        }, 300);
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const themePreviews = document.querySelectorAll(".theme-preview"); 
  const screenshotModal = document.getElementById("screenshot-modal");
  const closeScreenshotModal = document.getElementById(
    "close-screenshot-modal"
  );
  const prevScreenshot = document.getElementById("prev-screenshot");
  const nextScreenshot = document.getElementById("next-screenshot");
  const screenshots = document.querySelectorAll(".screenshot");

  let currentScreenshotIndex = 0;
  let currentTheme = "";

  const themeScreenshots = {
    dark: [
      "/imgs/themespng/dark-screenshot1.webp",
      "/imgs/themespng/dark-screenshot2.webp",
    ],
    light: [
      "/imgs/themespng/light-screenshot1.webp",
      "/imgs/themespng/light-screenshot2.webp",
    ],
    crimson: [
      "/imgs/themespng/crimson-screenshot1.webp",
      "/imgs/themespng/crimson-screenshot2.webp",
    ],
    orange: [
      "/imgs/themespng/orange-screenshot1.webp",
      "/imgs/themespng/orange-screenshot2.webp",
    ],
    yellow: [
      "/imgs/themespng/yellow-screenshot1.webp",
      "/imgs/themespng/yellow-screenshot2.webp",
    ],
    green: [
      "/imgs/themespng/green-screenshot1.webp",
      "/imgs/themespng/green-screenshot2.png",
    ],
    blue: [
      "/imgs/themespng/blue-screenshot1.webp",
      "/imgs/themespng/blue-screenshot2.webp",
    ],
    purple: [
      "/imgs/themespng/purple-screenshot1.png",
      "/imgs/themespng/purple-screenshot2.webp",
    ],
  };

  themePreviews.forEach((preview) => {
    preview.addEventListener("click", function (event) {
      event.stopPropagation();

      const themeClasses = Array.from(preview.classList).filter(
        (cls) => cls !== "theme-preview"
      );
      const theme = themeClasses[0]; 

      if (theme && themeScreenshots[theme]) {
        currentTheme = theme;

        const screenshotPaths = themeScreenshots[theme];
        screenshots.forEach((screenshot, index) => {
          screenshot.src = screenshotPaths[index];
        });

        screenshotModal.classList.remove("hidden");
        screenshotModal.classList.add("visible");
        showScreenshot(0);
      } else {
        console.error("Theme not found or invalid:", theme);
      }
    });
  });

  closeScreenshotModal.addEventListener("click", function () {
    screenshotModal.classList.remove("visible");
    screenshotModal.classList.add("hidden");
  });

  prevScreenshot.addEventListener("click", function () {
    showScreenshot(currentScreenshotIndex - 1);
  });

  nextScreenshot.addEventListener("click", function () {
    showScreenshot(currentScreenshotIndex + 1);
  });

  function showScreenshot(index) {
    if (index < 0) {
      index = screenshots.length - 1;
    } else if (index >= screenshots.length) {
      index = 0;
    }

    screenshots.forEach((screenshot, i) => {
      if (i === index) {
        screenshot.classList.remove("hidden");
        screenshot.classList.add("visible");
      } else {
        screenshot.classList.remove("visible");
        screenshot.classList.add("hidden");
      }
    });

    currentScreenshotIndex = index;
  }

  // cloak page stuff
  const tabBrandSelector = document.getElementById("rebrand-method")
  const tabBrandStored = localStorage.getItem("TBStat")

  const savedSelection = localStorage.getItem("TBStat");
  console.log(`${tabBrandSelector} | ${tabBrandStored}, | ${savedSelection}`)
  if (savedSelection) {
      tabBrandSelector.value = savedSelection;
      tabBrandSelector.dispatchEvent(new Event('change'));
  }

  if (tabBrandStored) {
    tabBrandSelector.value = tabBrandStored;
  }

  tabBrandSelector.onchange = (event) => {
    const TBSelection = event.target.value;
    console.log(`TBS called: ${TBSelection}`)

    localStorage.setItem("TBStat", TBSelection);

    document.querySelectorAll('.TBToggleable').forEach(el => el.classList.add('hidde'));

    switch (TBSelection){
      case "Preset":
        // faggot
        const presetI = document.getElementById("Preset");
        presetI.classList.remove("hidde")
        break;
      case "Clone":
        // ass
        const cloneI = document.getElementById("Clone");
        cloneI.classList.remove("hidde")
        break;
      case "Manual":
        // bitch
        const manualI = document.getElementById("Manual");
        manualI.classList.remove("hidde")
        break;
        case "Disabled":
          // Hoe
          break;
    }
  }
});

async function xx() {
  if (!navigator.serviceWorker) {
    if (
      location.protocol !== "https:" &&
      !swAllowedHostnames.includes(location.hostname) 
    )
      throw new Error("Service workers cannot be registered without https.");

    throw new Error("Your browser doesn't support service workers.");
  }
  await navigator.serviceWorker.register(ss);
}

xx();