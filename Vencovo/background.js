// Konstanty
const ACTION_KEY = 'selectedAction';
const DEFAULT_ACTION = 'test1';

// Funkce, která provede akci "script abidoo"
// TATO funkce BUDE INJEKTOVÁNA A SPUŠTĚNA NA CÍLOVÉ STRÁNCE.
function executeAbidooScript(newHeight) {
    // Vše, co je uvnitř této funkce, se spustí na cílové stránce
    const element = document.querySelector('.monaco-editor');
    if (element) {
        element.style.height = newHeight;
        console.log(`Script Abidoo: Výška elementu .monaco-editor nastavena na ${newHeight}.`);
    } else {
        console.warn('Script Abidoo: Element s třídou .monaco-editor nebyl nalezen.');
    }
}

// Funkce pro vytvoření kontextového menu
function createContextMenu() {
    chrome.contextMenus.removeAll(() => {
        // Volba pro Akci 1: Test1
        chrome.contextMenus.create({
            id: 'select_test1',
            title: 'Vybrat Akci: Zobrazit "Test1"',
            type: 'radio',
            contexts: ['action']
        });

        // Volba pro Akci 2: Test2
        chrome.contextMenus.create({
            id: 'select_test2',
            title: 'Vybrat Akci: Zobrazit "Test2"',
            type: 'radio',
            contexts: ['action']
        });

        // Volba pro Akci 3: script abidoo
        chrome.contextMenus.create({
            id: 'select_abidoo',
            title: 'Vybrat Akci: Spustit "script abidoo" (Nastavit height)',
            type: 'radio',
            contexts: ['action']
        });

        // Nastavení, která volba má být zaškrtnuta
        chrome.storage.local.get([ACTION_KEY], (result) => {
            const selectedAction = result[ACTION_KEY] || DEFAULT_ACTION;
            const selectedId = 'select_' + selectedAction;
            
            // Kontrola existence id a zaškrtnutí
            if (selectedAction === 'abidoo') {
                chrome.contextMenus.update('select_abidoo', { checked: true });
            } else if (selectedAction === 'test2') {
                chrome.contextMenus.update('select_test2', { checked: true });
            } else {
                chrome.contextMenus.update('select_test1', { checked: true });
            }
        });
    });
}

// 1. Spuštění/instalace: Nastavení výchozí akce a menu
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get([ACTION_KEY], (result) => {
        if (!result[ACTION_KEY]) {
            chrome.storage.local.set({ [ACTION_KEY]: DEFAULT_ACTION });
        }
        createContextMenu();
    });
});

// 2. Reakce na kliknutí v kontextovém menu
chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId.startsWith('select_')) {
        const newAction = info.menuItemId.replace('select_', '');
        
        // Uložení nové vybrané akce
        chrome.storage.local.set({ [ACTION_KEY]: newAction });
    }
});

// 3. Reakce na kliknutí na ikonu rozšíření
chrome.action.onClicked.addListener((tab) => {
    chrome.storage.local.get([ACTION_KEY], (result) => {
        const currentAction = result[ACTION_KEY] || DEFAULT_ACTION;
        
        // Logika pro "script abidoo"
        if (currentAction === 'abidoo') {
            // Spustí funkci executeAbidooScript na aktivní záložce
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: executeAbidooScript, // Předáme funkci
                args: ['924px'] // Předáme argument
            });
            console.log('Spouštění "script abidoo" na aktivní záložce.');
            return; 
        }

        // Logika pro "Test1" a "Test2" (simulace popupu v nové kartě)
        let title;
        let bodyText;

        if (currentAction === 'test1') {
            title = 'Test1';
            bodyText = 'Akce Test1 byla vybrána a spuštěna.';
        } else {
            title = 'Test2';
            bodyText = 'Akce Test2 byla vybrána a spuštěna.';
        }

        // Tvorba HTML obsahu pro simulaci popupu
        const popupContent = `
            <html>
            <head>
                <meta charset='UTF-8'>
                <title>Zvolená akce: ${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
                    h1 { color: #333; }
                    p { font-size: 1.1em; color: #666; }
                </style>
            </head>
            <body>
                <h1>Zvolená akce: ${title}</h1>
                <p>${bodyText}</p>
            </body>
            </html>
        `;

        // Otevření nové karty s HTML obsahem
        chrome.tabs.create({
            url: 'data:text/html,' + encodeURIComponent(popupContent)
        });
    });
});