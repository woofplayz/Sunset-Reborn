//loads keybinds
/*const keybinds = "/keybinds.json"
async function loadKeybinds() {
    const defaultKeybinds = JSON.parse(await fetch(keybinds))
    const savedKeybinds = JSON.parse(localStorage.getItem("keybinds"))
    if(!savedKeybinds) {
        //set default keybinds 
        let strKeybinds = JSON.stringify(defaultKeybinds)
        localStorage.setItem("keybinds", strKeybinds)
        //proceed
        loadKeybinds() //recall the function [BAD!]
    }

    try {
        savedKeybinds.forEach((key) => {
            alz.addEventListener("keyDown", function (e) {
            if(e.key === key.key) {
                const action = new Function(key.action);
                action;
            }
            });
        });
    }catch (e) {
        console.log("[Redacted.error] Error setting keybinds! " + e)
    }
}

function openModal(modal) {
switch(modal) {
    case "settings":
        openModal("settings-modal");
        showPanel(settingsGrid);
        hidePanel(themePanel);
        hidePanel(layoutPanel);
        hidePanel(shortcutPanel);
    break;
}
}
*/