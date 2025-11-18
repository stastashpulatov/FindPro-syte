<?php
/**
 * PHP Proxy для FastAPI
 * Разместите этот файл в public_html/api/index.php
 * Или используйте .htaccess для перенаправления /api на этот файл
 */

// URL FastAPI backend
$fastapi_url = 'http://127.0.0.1:8000';

// Получаем путь запроса
$request_uri = $_SERVER['REQUEST_URI'];

// Убираем /api из начала пути, если он там есть
$api_path = preg_replace('#^/api#', '', $request_uri);

// Если путь пустой или начинается не с /, добавляем /api/v1
if (empty($api_path) || $api_path === '/') {
    $api_path = '/api/v1';
} elseif (strpos($api_path, '/v1') !== 0) {
    $api_path = '/api/v1' . $api_path;
} else {
    $api_path = '/api' . $api_path;
}

// Формируем полный URL
$target_url = $fastapi_url . $api_path;

// Добавляем query string, если есть
if (!empty($_SERVER['QUERY_STRING'])) {
    $target_url .= '?' . $_SERVER['QUERY_STRING'];
}

// Подготавливаем заголовки
$headers = [];
if (isset($_SERVER['CONTENT_TYPE'])) {
    $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
}
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $headers[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];
}

// Подготавливаем запрос
$ch = curl_init($target_url);

// Настройки cURL
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HEADER => true,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_CUSTOMREQUEST => $_SERVER['REQUEST_METHOD'],
    CURLOPT_TIMEOUT => 30,
    CURLOPT_CONNECTTIMEOUT => 5,
]);

// Передаём тело запроса для POST/PUT/PATCH/DELETE
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    $input = file_get_contents('php://input');
    if (!empty($input)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
    }
}

// Выполняем запрос
$response = curl_exec($ch);

if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode([
        'detail' => 'Backend недоступен. Проверьте, что FastAPI запущен на порту 8000.'
    ]);
    exit;
}

$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

// Разделяем заголовки и тело
$response_headers = substr($response, 0, $header_size);
$body = substr($response, $header_size);

// Парсим и передаём заголовки ответа
$header_lines = explode("\r\n", $response_headers);
foreach ($header_lines as $header_line) {
    $header_line = trim($header_line);
    if (empty($header_line)) continue;
    
    // Пропускаем HTTP статус строку
    if (strpos($header_line, 'HTTP/') === 0) continue;
    
    // Передаём важные заголовки
    $lower_header = strtolower($header_line);
    if (strpos($lower_header, 'content-type:') === 0 ||
        strpos($lower_header, 'content-length:') === 0 ||
        strpos($lower_header, 'access-control-') === 0) {
        header($header_line);
    }
}

// Устанавливаем HTTP код ответа
http_response_code($http_code);

// Отдаём тело ответа
echo $body;
?>

