// Function to fake a keyboard event so your existing game code works instantly
function simulateKeyPress(keyName) {
    const event = new KeyboardEvent('keydown', {
        key: keyName,
        code: keyName,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(event);
}

// Attach tap events to the HTML elements
document.getElementById("btn-up").addEventListener("touchstart", (e) => {
    e.preventDefault();
    simulateKeyPress("ArrowUp");
});

document.getElementById("btn-down").addEventListener("touchstart", (e) => {
    e.preventDefault();
    simulateKeyPress("ArrowDown");
});

document.getElementById("btn-left").addEventListener("touchstart", (e) => {
    e.preventDefault();
    simulateKeyPress("ArrowLeft");
});

document.getElementById("btn-right").addEventListener("touchstart", (e) => {
    e.preventDefault();
    simulateKeyPress("ArrowRight");
});
