(function() {
    const selector = '.monaco-editor';
    const targetHeight = '924px'; // Nová cílová výška
    const editor = document.querySelector(selector);

    if (!editor) {
        console.log(`Element ${selector} nenalezen.`);
        return;
    }

    // Použijeme data atribut k uložení původní výšky, abychom ji mohli vrátit
    const originalHeightKey = 'data-monaco-original-height';

    // 1. Zjistit, jestli už byla výška změněna
    const isToggled = editor.style.height === targetHeight;

    if (isToggled) {
        // 2. VRÁCENÍ ZPĚT: Element je nastaven na 924px, vrátíme původní výšku
        const originalHeight = editor.getAttribute(originalHeightKey);
        
        if (originalHeight) {
            editor.style.height = originalHeight;
            editor.removeAttribute(originalHeightKey);
            console.log(`Výška ${selector} vrácena na původní: ${originalHeight}.`);
        } else {
            // Bez původní výšky, prostě ji odebereme pro obnovení výchozího stavu
            editor.style.height = ''; 
            console.log(`Výška ${selector} vrácena na výchozí stav.`);
        }
        
    } else {
        // 3. NASTAVENÍ: Element má původní výšku, uložíme ji a nastavíme novou
        
        // Zjistíme aktuální computed výšku (nebo existující inline styl, pokud je nastaven)
        const currentHeight = editor.style.height || getComputedStyle(editor).height;

        // Uložíme ji pro budoucí návrat, pokud ještě není uložena
        if (!editor.hasAttribute(originalHeightKey)) {
             editor.setAttribute(originalHeightKey, currentHeight);
        }

        // Nastavíme novou cílovou výšku
        editor.style.height = targetHeight;
        console.log(`Výška ${selector} nastavena na ${targetHeight}. Původní: ${currentHeight}.`);
    }

})();