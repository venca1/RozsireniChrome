// Konstanty
const ACTION_KEY = 'selectedAction';
const DEFAULT_ACTION = 'test1';



function executePosli(newHeight) {
    // Vše, co je uvnitř této funkce, se spustí na cílové stránce
    const element = document.querySelector('.monaco-editor');



    var height= element.style.height;


    console.log({info:"r16",func:"executePosli",height:height/*,vyska:element?element.style.height:null*/});



    if (element) {
       // element.style.height = newHeight;
        console.log(`Script Tabidoo: Výška elementu .monaco-editor nastavena na ${newHeight}.`);

        if(height== '924px'){
            element.style.height = '324px';

        }else{
            element.style.height = '924px';
        }



    } else {
        console.warn('Script Tabidoo: Element s třídou .monaco-editor nebyl nalezen.');
    }
}



// Funkce, která provede akci "script Tabidoo"
// TATO funkce BUDE INJEKTOVÁNA A SPUŠTĚNA NA CÍLOVÉ STRÁNCE.
function executeTabidooScript(newHeight) {
    // Vše, co je uvnitř této funkce, se spustí na cílové stránce
    const element = document.querySelector('.monaco-editor');



    var height= element.style.height;


    console.log({info:"r51",height:height/*,vyska:element?element.style.height:null*/});



    if (element) {
       // element.style.height = newHeight;
        console.log(`Script Tabidoo: Výška elementu .monaco-editor nastavena na ${newHeight}.`);

        if(height== '924px'){
            element.style.height = '324px';

        }else{
            element.style.height = '924px';
        }



    } else {
        console.warn('Script Tabidoo: Element s třídou .monaco-editor nebyl nalezen.');
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
            id: 'select_Posli',
            title: 'Vybrat Akci: Zobrazit "Posli"',
            type: 'radio',
            contexts: ['action']
        });

        // Volba pro Akci 3: script Tabidoo
        chrome.contextMenus.create({
            id: 'select_Tabidoo',
            title: 'Vybrat Akci: Spustit "script Tabidoo" (Nastavit height)',
            type: 'radio',
            contexts: ['action']
        });

        // Nastavení, která volba má být zaškrtnuta
        chrome.storage.local.get([ACTION_KEY], (result) => {
            const selectedAction = result[ACTION_KEY] || DEFAULT_ACTION;
            const selectedId = 'select_' + selectedAction;
            
            // Kontrola existence id a zaškrtnutí
            if (selectedAction === 'Tabidoo') {
                chrome.contextMenus.update('select_Tabidoo', { checked: true });
            } else if (selectedAction === 'Posli') {
                chrome.contextMenus.update('select_Posli', { checked: true });
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
        
        // Logika pro "script Tabidoo"
        if (currentAction === 'Tabidoo') {

            // Spustí funkci executeTabidooScript na aktivní záložce
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: executeTabidooScript, // Předáme funkci
                args: ['924px'] // Předáme argument
            });
            console.log('Spouštění "script Tabidoo" na aktivní záložce.');
            return; 
        }


                if (currentAction === 'Posli') {

            // Spustí funkci executeTabidooScript na aktivní záložce
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: executePosli, // Předáme funkci
                args: ['924px'] // Předáme argument
            });
            console.log('Spouštění "script Posli" na aktivní záložce.');
            return; 
        }


        // Logika pro "Test1" a "Test2" (simulace popupu v nové kartě)
        let title;
        let bodyText;

        if (currentAction === 'test1') {
            title = 'Test1';
            bodyText = 'Akce Test1 byla vybrána a spuštěna.';
        } else {
            title = 'posli';
            bodyText = 'Akce posli byla vybrána a spuštěna.';
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