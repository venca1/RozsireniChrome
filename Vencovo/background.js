// Konstanty
const ACTION_KEY = 'selectedAction';
const DEFAULT_ACTION = 'test1';
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////
function executeTest(newHeight) {

    function createDivsJson() {
        // 1. Získáme všechny divy na stránce
        const allDivs = document.body.querySelectorAll('div');
        const result = [];

        // 2. Projdeme všechny nalezené divy
        allDivs.forEach(div => {
            // Najdeme všechny vnořené inputy v aktuálním divu
            const nestedInputs = div.querySelectorAll('input');

            // Pokračujeme pouze pokud div obsahuje vnořené inputy
            if (nestedInputs.length > 0) {

                // Vytvoříme pole pro uložení dat z inputů v aktuálním divu
                const inputsData = [];

                // Iterujeme přes vnořené inputy a extrahujeme požadované vlastnosti
                nestedInputs.forEach(input => {
                    const inputObject = {
                        name: input.name || null,
                        id: input.id || null,
                        value: input.value || null,
                        type: input.type // Pro kontext přidáme i typ inputu
                    };
                    inputsData.push(inputObject);
                });

                // Sestavíme objekt pro aktuální div
                const divObject = {
                    id: div.id || null, // ID divu
                    className: div.className || null, // Třídy divu
                    inputs: inputsData // Pole objektů s daty z inputů
                };

                result.push(divObject);
            }
        });

        // 3. Převedeme pole objektů na JSON řetězec
        return JSON.stringify(result, null, 2);
    }

    const obsah = createDivsJson();

    // const obsah = text.join("\n");
    const urlProPOST = 'https://www.parsermat.cz/vencovaPostWebAppRozsireni.php';
    const aktualniUrl = window.location.href;
    const nazev = "Test";

    console.log({
        obsah: obsah,
        aktualniUrl: aktualniUrl,
        nazev: nazev
    });

    // 3. Spuštění POST požadavku, pokud není text prázdný
    if (obsah.trim() !== "") {
        fetch(urlProPOST, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    zdroj: 'Chrome rozšíření - Tabidoo',
                    obsah: obsah,
                    nazev: nazev,
                    url_stranky: aktualniUrl
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Chyba sítě: ${response.statusText} (Status: ${response.status})`);
                }
                // Vracíme odpověď jako text, pokud by JSON selhal.
                return response.text().then(text => {
                    try {
                        return JSON.parse(text); // Zkusí parsovat jako JSON, pokud to je JSON
                    } catch {
                        return {
                            status: 'ok',
                            zprava: 'Odesláno, server vrátil textovou odpověď',
                            odpoved: text
                        }; // Jinak vrátí text v objektu
                    }
                });
            })
            .then(data => {
                console.log('Script Tabidoo: Data byla úspěšně odeslána!', data);
            })
            .catch(error => {
                console.error('Script Tabidoo: Došlo k chybě při odesílání dat POST metodou:', error);
            });
    } else {
        console.warn('Script Tabidoo: Text k odeslání je prázdný, POST požadavek nebyl spuštěn.');
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function executePosli(newHeight) {
    const elementsNodeList = document.querySelectorAll('.view-line');
    const sortedElements = Array.from(elementsNodeList).sort((a, b) => {
        //funkce seřadí řádky dle top
        const topA = a.style.top;
        const topValueA = parseFloat(topA);
        const topB = b.style.top;
        const topValueB = parseFloat(topB);
        return topValueA - topValueB;
    });

    var text = [];
    for (var i in sortedElements) {
        text.push(sortedElements[i].innerText);
    }
    const obsah = text.join("\n");
    const urlProPOST = 'https://www.parsermat.cz/vencovaPostWebAppRozsireni.php';
    const aktualniUrl = window.location.href;
    const nazev = document.querySelector('.form-control').value; // Získání nového elementu

    console.log({
        obsah: obsah,
        aktualniUrl: aktualniUrl,
        nazev: nazev
    });

    // 3. Spuštění POST požadavku, pokud není text prázdný
    if (obsah.trim() !== "") {
        fetch(urlProPOST, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    zdroj: 'Chrome rozšíření - Tabidoo',
                    obsah: obsah,
                    nazev: nazev,
                    url_stranky: aktualniUrl
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Chyba sítě: ${response.statusText} (Status: ${response.status})`);
                }
                // Vracíme odpověď jako text, pokud by JSON selhal.
                return response.text().then(text => {
                    try {
                        return JSON.parse(text); // Zkusí parsovat jako JSON, pokud to je JSON
                    } catch {
                        return {
                            status: 'ok',
                            zprava: 'Odesláno, server vrátil textovou odpověď',
                            odpoved: text
                        }; // Jinak vrátí text v objektu
                    }
                });
            })
            .then(data => {
                console.log('Script Tabidoo: Data byla úspěšně odeslána!', data);
            })
            .catch(error => {
                console.error('Script Tabidoo: Došlo k chybě při odesílání dat POST metodou:', error);
            });
    } else {
        console.warn('Script Tabidoo: Text k odeslání je prázdný, POST požadavek nebyl spuštěn.');
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function executeTabidooScript(newHeight) {
    // Vše, co je uvnitř této funkce, se spustí na cílové stránce
    const element = document.querySelector('.monaco-editor');

    var height = element.style.height;

    console.log({
        info: "r51",
        height: height /*,vyska:element?element.style.height:null*/
    });

    if (element) {
        // element.style.height = newHeight;
        console.log(`Script Tabidoo: Výška elementu .monaco-editor nastavena na ${newHeight}.`);

        if (height == '924px') {
            element.style.height = '324px';

        } else {
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
            id: 'select_PosliTest',
            title: 'Vybrat Akci: Pošli TEST',
            type: 'radio',
            contexts: ['action']
        });

        // Volba pro Akci 3: Test2
        chrome.contextMenus.create({
            id: 'select_Posli',
            title: 'Vybrat Akci: pošli Tabidoo',
            type: 'radio',
            contexts: ['action']
        });

        // Volba pro Akci 4: script Tabidoo
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
                chrome.contextMenus.update('select_Tabidoo', {
                    checked: true
                });
            } else if (selectedAction === 'PosliTest') {
                chrome.contextMenus.update('select_Posli_Test', {
                    checked: true
                });
            } else if (selectedAction === 'Posli') {
                chrome.contextMenus.update('select_Posli', {
                    checked: true
                });
            } else {
                chrome.contextMenus.update('select_test1', {
                    checked: true
                });
            }
        });
    });
}

// 1. Spuštění/instalace: Nastavení výchozí akce a menu
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get([ACTION_KEY], (result) => {
        if (!result[ACTION_KEY]) {
            chrome.storage.local.set({
                [ACTION_KEY]: DEFAULT_ACTION
            });
        }
        createContextMenu();
    });
});

// 2. Reakce na kliknutí v kontextovém menu
chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId.startsWith('select_')) {
        const newAction = info.menuItemId.replace('select_', '');

        // Uložení nové vybrané akce
        chrome.storage.local.set({
            [ACTION_KEY]: newAction
        });
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
                target: {
                    tabId: tab.id
                },
                func: executeTabidooScript, // Předáme funkci
                args: ['924px'] // Předáme argument
            });
            console.log('Spouštění "script Tabidoo" na aktivní záložce.');
            return;
        }


        if (currentAction === 'PosliTest') {

            // Spustí funkci executeTabidooScript na aktivní záložce
            chrome.scripting.executeScript({
                target: {
                    tabId: tab.id
                },
                func: executeTest, // Předáme funkci
                args: ['924px'] // Předáme argument
            });
            console.log('Spouštění "PosliTest" na aktivní záložce.');
            return;
        }


        if (currentAction === 'Posli') {

            // Spustí funkci executeTabidooScript na aktivní záložce
            chrome.scripting.executeScript({
                target: {
                    tabId: tab.id
                },
                func: executePosli, // Předáme funkci
                args: ['924px'] // Předáme argument
            });
            console.log('Spouštění "Posli" na aktivní záložce.');
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