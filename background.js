// background.js - Listens for clicks on the extension icon in the toolbar.
chrome.action.onClicked.addListener((tab) => {
    // Send a message to the content script in the active tab to toggle/open the sidebar.
    chrome.tabs.sendMessage(tab.id, { action: "toggle-sidebar" }).catch((err) => {
        console.log("Could not send toggle-sidebar message. Content script might not be loaded yet or on a restricted page.");
    });
});
