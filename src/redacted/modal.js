//woof not cooking with ai be like
document.addEventListener("DOMContentLoaded", function () {
  const modals = document.querySelectorAll(".modal"); 
  const settingsSvg = document.querySelector(".bottom-wrapper svg:nth-child(3)");
  const settingsGrid = document.querySelector(".settings-grid");
  const settingsGrid2 = document.querySelector(".settings-grid.visible");
  const themePanel = document.getElementById("theme-panel");
  const layoutPanel = document.getElementById("layout-panel");
  const shortcutPanel = document.getElementById("shortcut-panel");
  const backButtons = document.querySelectorAll(".back-button");
  const searchInput = document.getElementById("modal-search-input");

  function closeAllModals() {
    modals.forEach((modal) => {
      modal.classList.remove("visible");
    });
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

  settingsSvg.addEventListener("click", function () {
    openModal("settings-modal");
    showPanel(settingsGrid);
    hidePanel(themePanel);
    hidePanel(layoutPanel);
    hidePanel(shortcutPanel);
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  const settingsBricks = document.querySelectorAll(".settings-brick");
  settingsBricks.forEach((brick) => {
    brick.addEventListener("click", function () {
      const category = brick.getAttribute("data-category");

      hidePanel(settingsGrid2);

      if (category === "theme") {
        showPanel(themePanel);
      } else if (category === "layout") {
        showPanel(layoutPanel);
      } else if (category === "shortcut") {
        showPanel(shortcutPanel);
      }
    });
  });

  backButtons.forEach((button) => {
    button.addEventListener("click", function () {
      showPanel(settingsGrid);

      hidePanel(themePanel);
      hidePanel(layoutPanel);
      hidePanel(shortcutPanel);
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
      showPanel(settingsGrid);
      hidePanel(themePanel);
      hidePanel(layoutPanel);
      hidePanel(shortcutPanel);
    });
  } else {
    console.error("Settings link not found!");
  }

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