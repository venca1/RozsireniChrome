// content.js

/**
 * Tato funkce se spustí na cílové webové stránce.
 *
 * @returns {string} Textový obsah prvního elementu s třídou 'aaa'.
 */
function getTextFromAAA() {
    // Použijeme querySelector pro nalezení prvního elementu s třídou 'aaa'
    const element = document.querySelector('.tbd-modal-header');

    if (element) {
        // Získáme textový obsah elementu. 
        // Lze použít i .innerHTML, pokud by element obsahoval HTML tagy, které chceš zachovat.
        return element.textContent.trim();
    }

// return "r26";

   // const elementPrvniNahrani = document.querySelector('.tbd-modal-header');
    var zalozkaScriptovani = document.querySelector('.mdc-tab--active');

     if (zalozkaScriptovani ) {
   // if (zalozkaScriptovani && zalozkaScriptovani.classList.contains('mdc-tab--active')) {
        return zalozkaScriptovani.textContent.trim();
    //}
      //  var zalozkaScriptovani = document.getElementById('mat-tab-label-3-0');  

    }






return "r41b";





    
    // Pokud element nebyl nalezen, vrátíme prázdný řetězec nebo null
    return null; 
}

// Vrátíme výsledek funkce zpět do popup.js
getTextFromAAA();