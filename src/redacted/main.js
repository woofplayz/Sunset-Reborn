const ss = "/q/sw.js"
let inputC = document.getElementById("input-search")
let inputO = document.querySelector(".input-search")
//where all the stupid ass keybinds are stored
//#ihatewoof
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

function fg() {
  const fsrc = __uv$config.decodeUrl(document.querySelector(".iframe-frame").contentWindow.location.href.replace(__uv$config.prefix));
  try {
  if(fsrc.includes("https://www.google.com/search=q?")) {
    let substr = fsrc.split("?");
    let decoded = __uv$config.decodeUrl(substr[1]);
    document.querySelector(".iframe-frame").src =
      __uv$config.prefix +
      __uv$config.encodeUrl("https://www.google.com/search?q=" + decoded);
    console.log("[Redacted.fix] Fixed Google!");
  }
} catch (error) {
  console.log("[Redacted.error] " + error)
}
}

function refresh() {
  document.querySelector(".iframe-frame").contentWindow.location.href = document.querySelector(".iframe-frame").contentWindow.location.href
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

  if(!localStorage.getItem("sidebar")) {
    localStorage.setItem("sidebar", "true")
  }
  //[START] woofs chatgpt code
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
      const isCollapsed = sidebar.classList.contains("collapsed");
      
      if (isCollapsed) {
        localStorage.setItem("sidebar", "true")
        hideAllSections(); 
        sidebar.classList.remove("collapsed"); 
  
        moveSvgsBackToSidebar();
  
        setTimeout(() => {
          showAllSections();
        }, 300); 
      } else {
        localStorage.setItem("sidebar", "false")
        hideAllSections(); 
        sidebar.classList.add("collapsed"); 
  
        moveSvgsToIframeTopBar();
  
        setTimeout(() => {
          showSpecificSections();
        }, 300); 
      }
      iframe = document.querySelector(".iframe-frame"); 
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { sidebarCollapsed: sidebar.classList.contains("collapsed") },
          "*"
        );
      }
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
    const viewSvgs = document.querySelectorAll(".view-svg");
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
      dark: ["/imgs/themespng/dark-screenshot1.webp", "/imgs/themespng/dark-screenshot2.webp"],
      light: ["/imgs/themespng/light-screenshot1.webp", "/imgs/themespng/light-screenshot2.webp"],
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
      green: ["/imgs/themespng/green-screenshot1.webp", "/imgs/themespng/green-screenshot2.webp"],
      blue: ["/imgs/themespng/blue-screenshot1.webp", "/imgs/themespng/blue-screenshot2.webp"],
      purple: [
        "/imgs/themespng/purple-screenshot1.webp",
        "/imgs/themespng/purple-screenshot2.webp",
      ],
    };
  
    viewSvgs.forEach((svg) => {
      svg.addEventListener("click", function (event) {
        event.stopPropagation(); 
        const theme = svg.closest(".theme-option").getAttribute("data-theme");
        currentTheme = theme;
  
        const screenshotPaths = themeScreenshots[theme];
        screenshots.forEach((screenshot, index) => {
          screenshot.src = screenshotPaths[index];
        });
  
        screenshotModal.classList.remove("hidden");
        screenshotModal.classList.add("visible");
  
        showScreenshot(0);
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
  });
  //[END] woofs chatgpt code


async function xx() {
  if (!navigator.serviceWorker) {
      if (
          location.protocol !== 'https:' &&
          !swAllowedHostnames.includes(location.hostname)
      )
          throw new Error(
              'Service workers cannot be registered without https.'
          )

      throw new Error("Your browser doesn't support service workers.")
  }
  await navigator.serviceWorker.register(ss)
}

xx();