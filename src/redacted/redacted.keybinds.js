function initKeybinds() {
    keybinds.forEach(bind => {
        document.addEventListener('keydown', event => {
            if ((event.key === bind.key) && event.altKey) {
                event.preventDefault();
                eval(bind.action);
            }
        });
    });
}

function openModel() 
{
console.log("open model");
}

initKeybinds();