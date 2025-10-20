// Poslouchá událost kliknutí na ikonu rozšíření
chrome.action.onClicked.addListener((tab) => {
    // Spustí content.js na aktivní záložce
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});