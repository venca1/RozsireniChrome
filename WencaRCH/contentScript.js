// contentScript.js
// Spouští se v kontextu webové stránky
(function() {
  /*  
    const elementy = document.querySelectorAll('.testclass');

    if (elementy.length > 0) {
        
        // Výpis PŘED změnou velikosti
        console.log(`[Rozšíření] Mění se výška ${elementy.length} elementů s třídou 'testclass' na 500px.`);
        
        elementy.forEach(element => {
            // Provedení změny velikosti
            element.style.height = '500px';
            element.style.border = '3px solid red'; // Vizuální kontrola
        });
        
        // Výpis PO změně velikosti
        console.log("[Rozšíření] Úspěch: Změna velikosti dokončena.");
        
    } else {
        // Výpis, pokud se element nenašel
        console.log("[Rozšíření] Upozornění: Na této stránce nebyly nalezeny žádné elementy s třídou 'testclass'.");
    }*/
    const element = document.querySelector('.monaco-editor');

    var height = element.style.height;

    console.log({
        info: "r51",
        height: height /*,vyska:element?element.style.height:null*/
    });

    if (element) {
        // element.style.height = newHeight;


        if (height == '924px') {
            element.style.height = '324px';

        } else {
            element.style.height = '924px';
        }

        console.log(`Script Tabidoo: Výška elementu .monaco-editor nastavena na ` + element.style.height);


    } else {
        console.warn('Script Tabidoo: Element s třídou .monaco-editor nebyl nalezen.');
    }


})();