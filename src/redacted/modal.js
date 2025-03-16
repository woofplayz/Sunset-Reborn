function showPanel(panel) {
  if (panel) {
    panel.classList.remove("hidden");
    panel.classList.add("visible");
  }
}
 
function hidePanel(panel) {
  if (panel) {
    panel.classList.add("hidden");
    panel.classList.remove("visible");
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    closeAllModals();
    modal.classList.add("visible");
  } else {
    console.error(`Modal with ID ${modalId} not found!`);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const modals = document.querySelectorAll(".modal");
  const settingsSvg = document.querySelector(".bottom-wrapper svg:nth-child(3)");
  const settingsGrid = document.querySelector(".settings-grid");
  const settingsGrid2 = document.querySelector(".settings-grid.visible");
  const themePanel = document.getElementById("theme-panel");
  const layoutPanel = document.getElementById("layout-panel");
  const shortcutPanel = document.getElementById("shortcut-panel");
  const cloakingPanel = document.getElementById("cloaking-panel");
  const browserPanel = document.getElementById("browser-panel");
  const accountPanel = document.getElementById("account-panel");
  const advertismentsPanel = document.getElementById("advertisments-panel");
  const statisticsPanel = document.getElementById("statistics-panel");
  const upcomingPanel = document.getElementById("upcoming-panel");
  const backButtons = document.querySelectorAll(".back-button");
  const searchInput = document.getElementById("modal-search-input");
  const allHotKeys = document.querySelectorAll('shortcut-item');

  function closeAllModals() {
    modals.forEach((modal) => {
      modal.classList.remove("visible");
    });
  }

  function opensettingsclosepanels(){ 
    showPanel(settingsGrid);
    hidePanel(themePanel);
    hidePanel(layoutPanel);
    hidePanel(shortcutPanel);
    hidePanel(cloakingPanel);
    hidePanel(browserPanel);
    hidePanel(accountPanel);
    hidePanel(advertismentsPanel);
    hidePanel(statisticsPanel);
    hidePanel(upcomingPanel);
  };

  document.addEventListener("keydown", function (event) {
    if (event.altKey && event.key == 's') {
      event.preventDefault();
      openModal("settings-modal");
      opensettingsclosepanels();
    }
  })

  settingsSvg.addEventListener("click", function () {
    openModal("settings-modal");
    opensettingsclosepanels();
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  function openKeyModal(activastion) {
    let mm = document.getElementById('edit-shortcut-modal');
  if (mm) {
    closeAllModals();
    mm.classList.add("visible");
    let mewo = document.querySelector('.shortcut-item-pre')
    mewo.children[0].innerText = activastion
  } else {
    console.error(`Modal with ID ${activastion} not found!`);
  }
  }

  allHotKeys.forEach(hotkey => {
    hotkey.onclick = "openModal('edit-shortcut-modal')"
  });

  const settingsmodalthings = document.querySelectorAll(".settings-modalthing");
  settingsmodalthings.forEach((modalthing) => {
    modalthing.addEventListener("click", function () {
      const category = modalthing.getAttribute("data-category");

      hidePanel(settingsGrid2);
      let panel = document.getElementById(category+"-panel");
      if (!panel) {
        console.error(`Panel not found: ${panel}`);
        return;
    }
    showPanel(panel);  
    });
  });

  backButtons.forEach((button) => { 
    button.addEventListener("click", function () {
      opensettingsclosepanels();
    });
  });

  document.addEventListener("keydown", function (e) {
    const searchModalShortcut = localStorage.getItem("searchModalShortcut") || "Ctrl+K";
    if ((e.ctrlKey || e.metaKey) && e.key === searchModalShortcut.split("+")[1].toLowerCase()) {
      e.preventDefault();
      openModal("search-modal");
      if (document.getElementById("search-modal").classList.contains("visible")) {
        searchInput.focus();
      }
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });

  const settingsLink = document.querySelector('.modal-links .modal-link:nth-child(7)');
  if (settingsLink) {
    settingsLink.addEventListener("click", function (e) {
      e.preventDefault();
      openModal("settings-modal");
      opensettingsclosepanels();
    });
  } else {
    console.error("Settings link not found!");
  }



  window.addEventListener("message", function (event) {
    if (event.data === "openSearchModal") {
      openModal("search-modal");
      if (document.getElementById("search-modal").classList.contains("visible")) {
        searchInput.focus();
      }
    }
  });

  document.querySelectorAll("[id^='open-']").forEach((element) => {
    element.addEventListener("click", function (e) {
      e.preventDefault();
      const modalId = element.id.replace("open-", "") + "-modal";
      openModal(modalId);
    });
  });

  document.querySelectorAll(".modal-link[id]").forEach((element) => {
    element.addEventListener("click", function (e) {
      e.preventDefault();
      const modalId = element.id;
      openModal(modalId);
    });
  });
});