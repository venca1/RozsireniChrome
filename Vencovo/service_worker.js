chrome.action.onClicked.addListener((tab) => {
    // 1. Získat uloženou volbu
    chrome.storage.sync.get('selectedAction', (data) => {
        const action = data.selectedAction || 'none';

        // 2. Vložit a spustit content.js na aktivní záložce
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        }, () => {
            // 3. Po úspěšném vložení content.js, pošleme mu zprávu s akcí, kterou má provést
            chrome.tabs.sendMessage(tab.id, { action: action });
        });
    });
});