const savedTheme = localStorage.getItem("theme")
document.addEventListener("DOMContentLoaded", function () {
  const themeOptions = document.querySelectorAll(".theme-option");
  themeOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const selectedTheme = option.getAttribute("data-theme");
      applyTheme(selectedTheme);
    });
  });

  function applyTheme(theme) {
    localStorage.setItem("theme", theme)
    document.body.setAttribute("class", theme)
    
    let iframe = document.querySelector(".iframe-frame");
    let s = document.querySelectorAll(".frame_bt");
    if (iframe) {
        iframe.contentWindow.postMessage({ theme: theme }, "*");
    }
    s.forEach((ss) =>{
      ss.contentWindow.postMessage({ theme: theme }, "*");
    });

    document.querySelectorAll(".theme-option").forEach(option => {
      option.classList.remove("active-theme");

      let pops = option.querySelector(".active-pop");
      if (pops) pops.remove();

      if (option.getAttribute("data-theme") === theme) {
        option.classList.add("active-theme");
        option.insertAdjacentHTML("beforeend", `<div class="active-pop">Active</div>`)
      }
    });
  }

  if (savedTheme) {
    applyTheme(savedTheme);
  }

  const sidebarStickOutCheckbox = document.getElementById("sidebar-stick-out");
  if (sidebarStickOutCheckbox) {
    sidebarStickOutCheckbox.checked =
      localStorage.getItem("sidebarStickOut") === "true";
    sidebarStickOutCheckbox.addEventListener("change", function () {
      localStorage.setItem("sidebarStickOut", this.checked);
      applySidebarStickOut(this.checked);
    });
  }

  function applySidebarStickOut(shouldStickOut) {
    const sidebar = document.querySelector(".sidebar");
    const tabIcons = document.querySelectorAll(".tab-icon");

    if (shouldStickOut) {
      sidebar.classList.add("stick-out");
      tabIcons.forEach((icon) => icon.classList.add("visible-icon"));
    } else {
      sidebar.classList.remove("stick-out");
      tabIcons.forEach((icon) => icon.classList.remove("visible-icon"));
    }
  }

  const allShortCuts = document.querySelectorAll("shortcut-item")

  allShortCuts.forEach(shortcut => {

    shortcut.addEventListener("click", {
      openShortCutModal(shortcut.getAttribute("data-shortcut"))
    })
  });

  function openShortCutModal(shortcut) {
    const ShortCutModal = document.getElementById("edit-shortcut-modal");
    if (ShortCutModal) {
      closeAllModals();
      ShortCutModal.classList.add("visible");
    } else {
      console.error(`nobodycares is fucking stupid :3`);
    }
  }
  
  const savedSidebarStickOut =
    localStorage.getItem("sidebarStickOut") === "true";
  applySidebarStickOut(savedSidebarStickOut);

  const shortcutPanel = document.getElementById("shortcut-panel");
  const addShortcutButton = document.getElementById("add-shortcut");
  const shortcutList = document.getElementById("shortcut-list");
  const shortcutNameInput = document.getElementById("shortcut-name");
  const shortcutUrlInput = document.getElementById("shortcut-url");
  const shortcutKeysInput = document.getElementById("shortcut-keys");

  const searchModalShortcutInput = document.getElementById(
    "search-modal-shortcut"
  );
  const panicShortcutUrlInput = document.getElementById("panic-shortcut-url");
  const panicShortcutKeysInput = document.getElementById("panic-shortcut-keys");

  const recordSearchModalShortcutButton = document.getElementById(
    "record-search-modal-shortcut"
  );
  const recordPanicShortcutButton = document.getElementById(
    "record-panic-shortcut"
  );
  const recordNewShortcutButton = document.getElementById(
    "record-new-shortcut"
  );

  const saveSearchModalShortcutButton = document.getElementById(
    "save-search-modal-shortcut"
  );
  const savePanicShortcutButton = document.getElementById(
    "save-panic-shortcut"
  );
  const resetToDefaultsButton = document.getElementById("reset-to-defaults");

  let shortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];
  let isRecordingKeys = false;
  let currentRecordingInput = null;
  let recordedKeys = [];
  let isEditPageActive = false; 

  const savedSearchModalShortcut =
    localStorage.getItem("searchModalShortcut") || "Ctrl+K";
  const savedPanicShortcut = localStorage.getItem("panicShortcut") || "Ctrl+G";
  const savedPanicShortcutUrl =
    localStorage.getItem("panicShortcutUrl") || "https://www.google.com";

  searchModalShortcutInput.value = savedSearchModalShortcut;
  panicShortcutKeysInput.value = savedPanicShortcut;
  panicShortcutUrlInput.value = savedPanicShortcutUrl;

  function renderShortcuts() {
    shortcutList.innerHTML = "";
    shortcuts.forEach((shortcut, index) => {
      const shortcutItem = document.createElement("div");
      shortcutItem.className = "shortcut-item";
      shortcutItem.innerHTML = `
        <span>${shortcut.name} (${shortcut.keys}) → ${shortcut.url}</span>
        <button onclick="editShortcut(${index})">Edit</button>
        <button onclick="removeShortcut(${index})">Remove</button>
      `;
      shortcutList.appendChild(shortcutItem);
    });
  }

  function startRecordingKeys(inputElement) {
    isRecordingKeys = true;
    currentRecordingInput = inputElement;
    currentRecordingInput.placeholder = "Press 1-3 special keys + 1 letter...";
    currentRecordingInput.value = "";
    recordedKeys = [];
  }

  function stopRecordingKeys() {
    isRecordingKeys = false;
    if (currentRecordingInput) {
      currentRecordingInput.placeholder = "Press 'Record Keys' to set shortcut";
    }
    currentRecordingInput = null;
  }


  document.addEventListener("keydown", function (e) {
    if (!isRecordingKeys || !currentRecordingInput || isEditPageActive) return;

    e.preventDefault();

    const specialKeys = [];
    if (e.ctrlKey || e.metaKey) specialKeys.push("Ctrl");
    if (e.altKey) specialKeys.push("Alt");
    if (e.shiftKey) specialKeys.push("Shift");

    const letterKey =
      e.key.length === 1 && /[a-zA-Z]/.test(e.key) ? e.key.toUpperCase() : null;

    if (letterKey) {
      recordedKeys = [...specialKeys, letterKey];
      currentRecordingInput.value = recordedKeys.join("+");
      stopRecordingKeys();
    }
  });

  recordSearchModalShortcutButton.addEventListener("click", function () {
    startRecordingKeys(searchModalShortcutInput);
  });

  recordPanicShortcutButton.addEventListener("click", function () {
    startRecordingKeys(panicShortcutKeysInput);
  });

  recordNewShortcutButton.addEventListener("click", function () {
    startRecordingKeys(shortcutKeysInput);
  });

  saveSearchModalShortcutButton.addEventListener("click", function () {
    const keys = searchModalShortcutInput.value.trim();
    if (keys) {
      localStorage.setItem("searchModalShortcut", keys);
      alert("Search Modal Shortcut saved!");
    }
  });

  savePanicShortcutButton.addEventListener("click", function () {
    const keys = panicShortcutKeysInput.value.trim();
    const url = panicShortcutUrlInput.value.trim();
    if (keys && url) {
      localStorage.setItem("panicShortcut", keys);
      localStorage.setItem("panicShortcutUrl", url);
      alert("Panic Shortcut saved!");
    }
  });

  addShortcutButton.addEventListener("click", function () {
    const name = shortcutNameInput.value.trim();
    const url = shortcutUrlInput.value.trim();
    const keys = shortcutKeysInput.value.trim();

    if (name && url && keys) {
      const isDuplicate = shortcuts.some((shortcut) => shortcut.keys === keys);
      if (isDuplicate) {
        alert(
          "Shortcut with the same activation keys already exists! Please choose a different set of keys."
        );
        return;
      }

      shortcuts.push({ name, url, keys });
      localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
      renderShortcuts();
      shortcutNameInput.value = "";
      shortcutUrlInput.value = "";
      shortcutKeysInput.value = "";

      notifyIframeShortcutSaved({ name, url, keys });
    }
  });

  function notifyIframeShortcutSaved(shortcut) {
    const iframe = document.getElementById("main-iframe");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: "shortcutSaved", shortcut },
        "*"
      );
    }
  }

  window.editShortcut = function (index) {
    isEditPageActive = true; 
    const shortcut = shortcuts[index];
    shortcutNameInput.value = shortcut.name;
    shortcutUrlInput.value = shortcut.url;
    shortcutKeysInput.value = shortcut.keys;
    shortcuts.splice(index, 1);
    localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
    renderShortcuts();
  };

  window.removeShortcut = function (index) {
    shortcuts.splice(index, 1);
    localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
    renderShortcuts();
  };

  resetToDefaultsButton.addEventListener("click", function () {
    localStorage.setItem("searchModalShortcut", "Ctrl+K");
    localStorage.setItem("panicShortcut", "Ctrl+G");
    localStorage.setItem("panicShortcutUrl", "https://www.google.com");
    localStorage.setItem("shortcuts", JSON.stringify([]));

    searchModalShortcutInput.value = "Ctrl+K";
    panicShortcutKeysInput.value = "Ctrl+G";
    panicShortcutUrlInput.value = "https://www.google.com";
    shortcuts = [];
    renderShortcuts();

    alert("Shortcuts reset to defaults!");
  });

  renderShortcuts();

  window.addEventListener("message", function (event) {
    if (event.data.type === "shortcutActivated") {
      const pressedKeys = event.data.keys;
      const shortcut = shortcuts.find((shortcut) => shortcut.keys === pressedKeys);

      if (shortcut) {
        const iframe = document.getElementById("main-iframe");
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            { type: "activateShortcut", shortcut },
            "*"
          );
        }
      }
    }
  });

  document.addEventListener("keydown", function (e) {
    if (isEditPageActive) return; 

    const panicShortcut = localStorage.getItem("panicShortcut") || "Ctrl+G";
    const panicShortcutUrl =
      localStorage.getItem("panicShortcutUrl") || "https://www.google.com";

    const keys = [];
    if (e.ctrlKey || e.metaKey) keys.push("Ctrl");
    if (e.altKey) keys.push("Alt");
    if (e.shiftKey) keys.push("Shift");
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key))
      keys.push(e.key.toUpperCase());

    const pressedKeys = keys.join("+");

    if (pressedKeys === panicShortcut) {
      e.preventDefault();
      window.location.href = panicShortcutUrl; 
    }
  });
});