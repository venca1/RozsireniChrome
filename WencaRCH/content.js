// content.js

/**
 * Tato funkce se spustí na cílové webové stránce.
 *
 * @returns {string} Textový obsah prvního elementu s třídou 'aaa'.
 */
function getTextFromAAA() {
    // Použijeme querySelector pro nalezení prvního elementu s třídou 'aaa'
    const element = document.querySelector('.form-control');

   // const nazev = document.querySelector('.form-control').value; // Získání nového elementu

    if (element) {
        // Získáme textový obsah elementu. 
        // Lze použít i .innerHTML, pokud by element obsahoval HTML tagy, které chceš zachovat.

        if(element.value){
            return element.textContent.trim();
        }
        return element.value.trim();
    }
    
    // Pokud element nebyl nalezen, vrátíme prázdný řetězec nebo null
    return null; 
}

// Vrátíme výsledek funkce zpět do popup.js
getTextFromAAA();