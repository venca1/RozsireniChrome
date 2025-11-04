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


    // --- Funkce pro Kliknutí na Tlačítka ---
    // Získáme všechna tlačítka, kterým chceme přiřadit funkci
    const tlacitkaAkce = [
        document.getElementById('tlacitko1'),
        document.getElementById('tlacitko2'),
        document.getElementById('tlacitko3'),
        document.getElementById('tlacitko4')
    ];

    tlacitkaAkce.forEach(tlacitko => {
        if (tlacitko) {
            tlacitko.addEventListener('click', function() {
                // Zobrazí potvrzení s českým textem
                potvrzeniElement.textContent = `Byla provedena akce na: ${this.textContent} (ID: ${this.id})`;
                console.log(`Kliknuto na tlačítko: ${this.textContent}`);
                
                // Zde by normálně proběhla reálná logika (např. chrome.tabs.query atd.)
            });
        }
    });
});