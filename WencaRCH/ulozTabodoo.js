// contentScript.js
// Spouští se v kontextu webové stránky
(function() {

   /*    const elementsNodeList = document.querySelectorAll('.lines-content');
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
    const obsah = text.join("\n");*/

const selection = window.getSelection();

//var obsah = selection.toString().trim();

var obsah =  document.querySelector('.lines-content').textContent.trim(); // Získání nového elementu

//const elementsNodeList = document.querySelectorAll('.view-line');


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
/////////////

/*
takto to nefunguje
const potvrzeniElement = document.getElementById('potvrzeni');
 potvrzeniElement.innerHTML = "Spuštění content skriptu úspěšné4."
 */
/////////////
})();