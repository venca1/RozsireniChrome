// Konstanty pro klíče v Chrome Storage
const TEXTAREA_KEY = 'textareaTabidooValue';
const INPUT_KEY = 'inputNameTabidooValue'; // Pro úplnost, ukládejme i input
const INPUT_VELTABIDOO = 'velikostTabidooValue'; // Pro úplnost, ukládejme i input




document.getElementById('sendButtonOdeslani').addEventListener('click', () => {
    // Získání hodnot z formuláře
    const selector = document.getElementById('selectorInput').value;
    const url = document.getElementById('urlInput').value;
    const statusMessage = document.getElementById('statusMessage');
    
    // Rychlá validace
    if (!selector || !url) {
        statusMessage.textContent = 'Chyba: Vyplňte selektor i URL!';
        statusMessage.style.color = 'red';
        return;
    }
    
    statusMessage.textContent = 'Odesílám...';
    statusMessage.style.color = 'orange';

    // Získání aktivní záložky a spuštění skriptu
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        
        // Spuštění 'content.js' s předanými argumenty
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ['content.js']
        }, () => {
             // Po vložení content skriptu (nebo při jeho existenci)
             // odešleme zprávu s daty pro zpracování
             chrome.tabs.sendMessage(activeTab.id, {
                 action: 'processElement',
                 selector: selector,
                 url: url
             }, (response) => {
                 // Zpracování odpovědi z 'content.js'
                 if (chrome.runtime.lastError) {
                      statusMessage.textContent = 'Chyba: Nelze komunikovat se stránkou.';
                      statusMessage.style.color = 'red';
                      return;
                 }
                 
                 if (response && response.status === 'success') {
                      statusMessage.textContent = `Úspěch! Odesláno: ${response.data.text.substring(0, 30)}...`;
                      statusMessage.style.color = 'green';
                 } else {
                      statusMessage.textContent = `Chyba při odeslání: ${response.message}`;
                      statusMessage.style.color = 'red';
                 }
             });
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const tlacitkaZalozek = document.querySelectorAll('.zalozka-tlacitko');
    const obsahZalozek = document.querySelectorAll('.zalozka-obsah');
    const tlacitkaZalozekt = document.querySelectorAll('.zalozka-tlacitkot');
    const obsahZalozekt = document.querySelectorAll('.zalozka-obsaht');


    const potvrzeniElement = document.getElementById('potvrzeni');
    const inputNameTabidoo = document.getElementById('inputNameTabidoo');
    const velikostTabidoo = document.getElementById('velikostTabidoo');
    const textareaTabidoo = document.getElementById('textareaTabidoo');


    // --- Inicializace: Načtení uložených hodnot ---
    chrome.storage.local.get([TEXTAREA_KEY, INPUT_KEY, INPUT_VELTABIDOO], function(data) {
        if (data[TEXTAREA_KEY] && textareaTabidoo) {
            textareaTabidoo.value = data[TEXTAREA_KEY];
        }
        if (data[INPUT_VELTABIDOO] && velikostTabidoo) {
            velikostTabidoo.value = data[INPUT_VELTABIDOO];
        }
        if (data[INPUT_KEY] && inputNameTabidoo) {
             // Nastavíme hodnotu pouze pokud se ji nepodařilo vyplnit z content.js (viz níže)
             // Prozatím to necháme, ať to nepřepisuje data z content.js, ale jen inicializuje
             // Ponecháme načítání v obsluze content.js níže, kde se snažíme získat data ze stránky.
             // console.log("Načtena hodnota z inputu ze Storage (pro info):", data[INPUT_KEY]);
        }
    });

    // --- Ukládání hodnot při změně ---
    if (textareaTabidoo) {
        textareaTabidoo.addEventListener('input', function() {
            chrome.storage.local.set({ [TEXTAREA_KEY]: this.value });
        });
    }
    if (velikostTabidoo) {
        velikostTabidoo.addEventListener('input', function() {
            chrome.storage.local.set({ [INPUT_VELTABIDOO]: this.value });
        });
    }
    if (inputNameTabidoo) {
        inputNameTabidoo.addEventListener('input', function() {
            chrome.storage.local.set({ [INPUT_KEY]: this.value });
        });
    }



    // --- Funkce pro Přepínání Záložek ---
    tlacitkaZalozek.forEach(tlacitko => {
        tlacitko.addEventListener('click', function() {
            const cilovaZalozkaId = this.dataset.zalozka;

            // Skrýt veškerý obsah a zrušit aktivní stav
            obsahZalozek.forEach(obsah => obsah.classList.remove('aktivni'));
            tlacitkaZalozek.forEach(btn => btn.classList.remove('aktivni'));

            // Zobrazit cílovou záložku a nastavit aktivní stav
            document.getElementById(cilovaZalozkaId).classList.add('aktivni');
            this.classList.add('aktivni');
        });
    });

    // Nastavení první záložky jako aktivní při startu
    if (tlacitkaZalozek.length > 0) {
        tlacitkaZalozek[0].classList.add('aktivni');
    }


        // --- Funkce pro Přepínání Záložek ---
    tlacitkaZalozekt.forEach(tlacitko => {
        tlacitko.addEventListener('click', function() {
            const cilovaZalozkaId = this.dataset.zalozka;

            // Skrýt veškerý obsah a zrušit aktivní stav
            obsahZalozekt.forEach(obsah => obsah.classList.remove('aktivnit'));
            tlacitkaZalozekt.forEach(btn => btn.classList.remove('aktivnit'));

            // Zobrazit cílovou záložku a nastavit aktivní stav
            document.getElementById(cilovaZalozkaId).classList.add('aktivnit');
            this.classList.add('aktivnit');
        });
    });

    // Nastavení první záložky jako aktivní při startu
    if (tlacitkaZalozekt.length > 0) {
        tlacitkaZalozekt[0].classList.add('aktivnit');
    }



    // --- Akce pro Tlačítko 1 (Spustí Content Script) ---
    const tlacitko1 = document.getElementById('tlacitko1');
    if (tlacitko1) {
        tlacitko1.addEventListener('click', function() {
            potvrzeniElement.textContent = `Aktivována funkce pro Tlačítko 1: Mění velokost okna.`;

            // Používáme chrome.scripting.executeScript pro spuštění zmenaVelikostTabodoo.js
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                const activeTab = tabs[0];
                
                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    files: ['zmenaVelikostTabodoo.js'] 
                })
                .then(() => console.log("Spuštění content skriptu úspěšné."))
                .catch(err => console.error("Chyba při spouštění skriptu z popup:", err));
            });
        });
    }
// --- Akce pro Tlačítko tlacitkoUloz2 (Spustí Content Script a Odešle Data) ---
    const tlacitkoUlozWa = document.getElementById('tlacitkoUlozWa');
    if (tlacitkoUlozWa) {
        tlacitkoUlozWa.addEventListener('click', function() {
             // 1. Získání hodnot z input/textarea
            const inputNameTabidoo = document.getElementById('inputNameTabidoo').value;
            const textareaTabidoo = document.getElementById('textareaTabidoo').value;

            potvrzeniElement.textContent = `Příprava na odeslání dat...`;


             // Používáme chrome.scripting.executeScript pro spuštění ulozTabodoo2.js a PŘEDÁNÍ DAT
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                const activeTab = tabs[0];
                
                // 1. Spustíme SOUBOR ulozTabodoo2.js.
                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    files: ['ulozTabodooWs.js'] 
                })
                .then(() => {
                    // 2. Po úspěšném spuštění souboru odešleme data pomocí MESSAGE PASSING
                    return new Promise((resolve, reject) => {
                        chrome.tabs.sendMessage(activeTab.id, {
                            action: 'ulozTabidooWs',
                            nazev: inputNameTabidoo,
                            textareaTabidooWa: textareaTabidoo
                        }, (response) => {
                            if (chrome.runtime.lastError) {
                                return reject(new Error('Chyba při komunikaci se skriptem (runtime error): ' + chrome.runtime.lastError.message));
                            }
                            if (response && response.status === 'success') {
                                resolve(response); // Předáme odpověď pro následné vymazání
                            } else {
                                reject(new Error(`Odeslání dat selhalo (skript): ${response ? response.message : 'Neznámá chyba.'}`));
                            }
                        });
                    });
                })
                .then((response) => {
                    console.log({INFO:"Spuštění Uložení 2 skriptu a odeslání dat úspěšné.",response:response});
                   // potvrzeniElement.innerHTML = 'Spuštění Uložení 2 skriptu a odeslání dat **úspěšné**.<br><a href="https://script.google.com/macros/s/AKfycbwIZEvpMEjLuHv-LtMSkbhmuQDezyixp6fBkl3uCaV6QnxKi7U/exec?jsonSouborId=1LTYbJyUJSiajYeVcCFTu75MbG8ei02W5" target="_blank">Otevřít Json Viewer</a>'
                     potvrzeniElement.innerHTML = 'OK'
                    // *** NOVÁ LOGIKA: VYMAZÁNÍ HODNOTY PO ÚSPĚŠNÉM ODESLÁNÍ ***
                    document.getElementById('textareaTabidoo').value = '';
                    chrome.storage.local.remove(TEXTAREA_KEY, () => {
                         console.log("Hodnota textarea byla po úspěšném odeslání vymazána ze Storage.");
                    });
                    // *** KONEC NOVÉ LOGIKY ***

                })
                .catch(err => {
                    console.error("Chyba při spouštění skriptu z popup:", err);
                    potvrzeniElement.innerHTML = `Chyba při Spuštění Uložení 2: **${err.message}**`
                });

            });
        });
    }
    // --- Akce pro Tlačítko tlacitkoUloz2 (Spustí Content Script a Odešle Data) ---
    const tlacitkoUloz2 = document.getElementById('tlacitkoUloz2');
    if (tlacitkoUloz2) {
        tlacitkoUloz2.addEventListener('click', function() {
             // 1. Získání hodnot z input/textarea
            const inputNameTabidoo = document.getElementById('inputNameTabidoo').value;
            const textareaTabidoo = document.getElementById('textareaTabidoo').value;

            potvrzeniElement.textContent = `Příprava na odeslání dat...`;


             // Používáme chrome.scripting.executeScript pro spuštění ulozTabodoo2.js a PŘEDÁNÍ DAT
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                const activeTab = tabs[0];
                
                // 1. Spustíme SOUBOR ulozTabodoo2.js.
                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    files: ['ulozTabodoo2.js'] 
                })
                .then(() => {
                    // 2. Po úspěšném spuštění souboru odešleme data pomocí MESSAGE PASSING
                    return new Promise((resolve, reject) => {
                        chrome.tabs.sendMessage(activeTab.id, {
                            action: 'ulozTabidoo2',
                            nazev: inputNameTabidoo,
                            logrozsireni: textareaTabidoo
                        }, (response) => {
                            if (chrome.runtime.lastError) {
                                return reject(new Error('Chyba při komunikaci se skriptem (runtime error): ' + chrome.runtime.lastError.message));
                            }
                            if (response && response.status === 'success') {
                                resolve(response); // Předáme odpověď pro následné vymazání
                            } else {
                                reject(new Error(`Odeslání dat selhalo (skript): ${response ? response.message : 'Neznámá chyba.'}`));
                            }
                        });
                    });
                })
                .then((response) => {
                    console.log("Spuštění Uložení 2 skriptu a odeslání dat úspěšné.");
                    potvrzeniElement.innerHTML = 'Spuštění Uložení 2 skriptu a odeslání dat **úspěšné**.<br><a href="https://script.google.com/macros/s/AKfycbwIZEvpMEjLuHv-LtMSkbhmuQDezyixp6fBkl3uCaV6QnxKi7U/exec?jsonSouborId=1LTYbJyUJSiajYeVcCFTu75MbG8ei02W5" target="_blank">Otevřít Json Viewer</a>'
                    
                    // *** NOVÁ LOGIKA: VYMAZÁNÍ HODNOTY PO ÚSPĚŠNÉM ODESLÁNÍ ***
                    document.getElementById('textareaTabidoo').value = '';
                    chrome.storage.local.remove(TEXTAREA_KEY, () => {
                         console.log("Hodnota textarea byla po úspěšném odeslání vymazána ze Storage.");
                    });
                    // *** KONEC NOVÉ LOGIKY ***

                })
                .catch(err => {
                    console.error("Chyba při spouštění skriptu z popup:", err);
                    potvrzeniElement.innerHTML = `Chyba při Spuštění Uložení 2: **${err.message}**`
                });

            });
        });
    }
    // --- Načtení dat při otevření Popupu ---
    
    // 1. Získání aktuální aktivní záložky
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const activeTab = tabs[0];
        
        if (activeTab) {
            // 2. Spuštění content.js a získání výsledku
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                files: ['content.js']
            }, (results) => {
                if (results && results[0] && results[0].result) {
                    const textFromAAA = results[0].result;
                    
                    // 3. Vyplnění inputu získaným textem
                    if (inputNameTabidoo) {
                        inputNameTabidoo.value = textFromAAA;
                        chrome.storage.local.set({ [INPUT_KEY]: textFromAAA }); // Uložíme i novou hodnotu
                    }


                } else {
                    console.log("Nepodařilo se získat data ze stránky nebo element 'aaa' nebyl nalezen. Načítám ze Storage.");
                    
                    // Pokud se nepodařilo získat data ze stránky, použijeme uloženou hodnotu
                    chrome.storage.local.get(INPUT_KEY, function(data) {
                        if (data[INPUT_KEY] && inputNameTabidoo) {
                            inputNameTabidoo.value = data[INPUT_KEY];
                        } else if (inputNameTabidoo) {
                             inputNameTabidoo.value = "Data nebyla nalezena";
                        }
                    });


                }
            });
        }
    });


    // --- Akce pro Tlačítko 3, 4 (Pouze potvrdí kliknutí) ---
    const tlacitkaAkce = [
        document.getElementById('tlacitko3'),
        document.getElementById('tlacitko4')
    ];

    tlacitkaAkce.forEach(tlacitko => {
        if (tlacitko) {
            tlacitko.addEventListener('click', function() {
                // Zobrazí potvrzení s českým textem
                potvrzeniElement.textContent = `Byla provedena akce na: ${this.textContent} (ID: ${this.id})`;
                console.log(`Kliknuto na tlačítko: ${this.textContent}`);
            });
        }
    });
});