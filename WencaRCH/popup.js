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
          //  potvrzeniElement.textContent = `Aktivována funkce pro Tlačítko 2: Mění vel2.`;

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