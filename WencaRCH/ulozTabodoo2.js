// contentScript.js - ulozTabodoo2.js
// Spouští se v kontextu webové stránky

// Funkce, která provede veškerou logiku: sběr dat ze stránky a POST požadavek.
// Přijímá data (nazev, logrozsireni) z popupu.
function procesTabidooData(nazev, logrozsireni) {
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

    console.log({
        obsah: obsah,
        aktualniUrl: aktualniUrl,
        nazev: nazev, // Hodnota přijatá ze zprávy
        logrozsireni: logrozsireni // Hodnota přijatá ze zprávy
    });

    // 2. Spuštění POST požadavku, pokud není text prázdný
    if (obsah.trim() !== "") {
        // Vracíme Promise, aby se čekalo na dokončení fetch požadavku
        return fetch(urlProPOST, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    zdroj: 'Chrome rozšíření - Tabidoo',
                    obsah: obsah,
                    nazev: nazev,
                    logrozsireni: logrozsireni,
                    url_stranky: aktualniUrl
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Chyba sítě: ${response.statusText} (Status: ${response.status})`);
                }
                return response.text();
            })
            .then(text => {
                console.log('Script Tabidoo: Data byla úspěšně odeslána! Odpověď serveru:', text);
                // Vrátit úspěch volajícímu (popup.js)
                return { status: 'success', message: 'Data úspěšně odeslána.' };
            })
            .catch(error => {
                console.error('Script Tabidoo: Došlo k chybě při odesílání dat POST metodou:', error);
                // Vrátit chybu volajícímu
                return { status: 'error', message: `POST chyba: ${error.message}` };
            });
    } else {
        console.warn('Script Tabidoo: Text k odeslání je prázdný, POST požadavek nebyl spuštěn.');
        // Vrátit chybu volajícímu
        return Promise.resolve({ status: 'error', message: 'Text k odeslání je prázdný.' });
    }
}


// Posluchač zpráv pro příjem dat z popup.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // Kontrola, zda se jedná o správnou akci
        if (request.action === "ulozTabidoo2") {
            // Asynchronní volání funkce a předání dat
            procesTabidooData(request.nazev, request.logrozsireni)
                .then(sendResponse);
            
            // Důležité: Návrat hodnoty 'true' dává Chromu vědět, že 
            // 'sendResponse' bude zavolán asynchronně.
            return true; 
        }
    }
);