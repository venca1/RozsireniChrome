// contentScript.js
// Spouští se v kontextu webové stránky
(function() {
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