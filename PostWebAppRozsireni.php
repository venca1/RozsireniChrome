<?php


header('Access-Control-Allow-Origin: *');// header('Access-Control-Allow-Origin: https://app.tabidoo.cloud');// bys měl ideálně nahradit '*' konkrétní doménou Tabidoo, např.

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');// Povolí určité HTTP metody, které může klient použít (GET, POST, OPTIONS atd.)
header('Access-Control-Allow-Headers: Content-Type, Authorization');// Povolí určité hlavičky v požadavku od klienta
header('Access-Control-Max-Age: 86400'); // 24 hodin  Volitelné: Doba, po kterou prohlížeč může kešovat informace o CORS
header('Content-type: application/json');// 2. Nastavení typu obsahu pro JSON

$posts = array();// Deklarace proměnné $posts


    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

$gas_url = 'https://script.google.com/macros/s/AKfycbx4ybWPJBPBKsGjrT_vEJiZNM6FOac5Z6lDJ82cdCuccq0EaGR5F7hv6F-c8N2m0pZfNg/exec';


   // $post_fields = json_encode($data);
 $post_fields = $json_data;


$ch = curl_init();

    // Převod dat do formátu vhodného pro POST (např. JSON nebo query string)
    // Pro GAS je obvykle nejlepší poslat pole rovnou, cURL ho formátuje jako x-www-form-urlencoded
    
    // Pro GAS obvykle stačí poslat data jako pole
    
    // Můžete poslat i jako JSON, pokud to GAS očekává:
    // $post_fields = json_encode($input_data);
    // curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    
    // 3b. Nastavení cURL možností
    curl_setopt($ch, CURLOPT_URL, $gas_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Chceme, aby vrátil výsledek jako string
    curl_setopt($ch, CURLOPT_POST, true);           // Nastavíme metodu POST
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields); // Přidáme data k odeslání

    // Volitelné: Nastavení delšího timeoutu, pokud je GAS pomalý
    // curl_setopt($ch, CURLOPT_TIMEOUT, 30); 

    // 3c. Provedení cURL požadavku a získání odpovědi
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // 3d. Uzavření cURL spojení
    curl_close($ch);




/*

    $posts[0] = "aa2_user" . $userData; // Použití $userData
    $posts[1] = 6;
    $posts[2] = 1;
    $posts[3] = 3.14;
    $posts[4] = false;
    $posts[5] = $data;
 */

$posts[0] = "www/vencovaPostWebAppRozsireni.php" . $userData; // Použití $userData
$posts[1] = $response;

    // Odeslání JSON odpovědi s daty
    echo json_encode(array('posts' => $posts));


?>		