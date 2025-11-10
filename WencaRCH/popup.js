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
    const potvrzeniElement = document.getElementById('potvrzeni');

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
    // --- Akce pro Tlačítko 2 (Spustí Content Script) ---
    const tlacitko2 = document.getElementById('tlacitko2');
    if (tlacitko2) {
        tlacitko2.addEventListener('click', function() {
            //  potvrzeniElement.textContent = `Aktivována funkce pro Tlačítko 2: Mění vel2.`;

            // Používáme chrome.scripting.executeScript pro spuštění zmenaVelikostTabodoo.js
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                const activeTab = tabs[0];
                
                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    files: ['ulozTabodoo.js'] 
                })
                .then(() => {console.log("Spuštění Uložení skriptu úspěšné.");
            potvrzeniElement.innerHTML = "Spuštění Uložení skriptu úspěšné."
        })
                .catch(err => {
                    console.error("Chyba při spouštění skriptu z popup:", err);
                    potvrzeniElement.innerHTML = "Chyba při Spuštění Uložení!"
                });

            });
        });
    }
    // --- Akce pro Tlačítko tlacitkoUloz2 (Spustí Content Script) ---
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
                                // Zpracování chyby, např. pokud content script neodpoví nebo dojde k chybě připojení
                                return reject(new Error('Chyba při komunikaci se skriptem (runtime error): ' + chrome.runtime.lastError.message));
                            }
                            if (response && response.status === 'success') {
                                resolve();
                            } else {
                                // Zpracování chyby, kterou vrátil content script
                                reject(new Error(`Odeslání dat selhalo (skript): ${response ? response.message : 'Neznámá chyba.'}`));
                            }
                        });
                    });
                })
                .then(() => {
                    console.log("Spuštění Uložení 2 skriptu a odeslání dat úspěšné.");
                    potvrzeniElement.innerHTML = "Spuštění Uložení 2 skriptu a odeslání dat **úspěšné**."
                })
                .catch(err => {
                    console.error("Chyba při spouštění skriptu z popup:", err);
                    potvrzeniElement.innerHTML = `Chyba při Spuštění Uložení 2: **${err.message}**`
                });

            });
        });
    }
             // --- Načtení dat při otevření Popupu ---
    
const inputElement = document.getElementById('inputNameTabidoo');

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
                    if (inputElement) {
                        inputElement.value = textFromAAA;
                    }
                } else {
                    console.log("Nepodařilo se získat data ze stránky nebo element 'aaa' nebyl nalezen.");
                    // Můžeš zde nastavit placeholder, např.:
                    if (inputElement) {
                        inputElement.value = "Data nebyla nalezena";
                    }
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