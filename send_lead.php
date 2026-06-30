<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Obter dados do corpo da requisição (JSON)
    $input = json_decode(file_get_contents("php://input"), true);
    
    $name = isset($input["name"]) ? strip_tags(trim($input["name"])) : "";
    $email = isset($input["email"]) ? filter_var(trim($input["email"]), FILTER_SANITIZE_EMAIL) : "";
    $phone = isset($input["phone"]) ? strip_tags(trim($input["phone"])) : "";
    $schoolName = isset($input["schoolName"]) ? strip_tags(trim($input["schoolName"])) : "";
    $size = isset($input["estudantes"]) ? strip_tags(trim($input["estudantes"])) : "";
    
    // Validar campos obrigatórios
    if (empty($name) || empty($email) || empty($phone) || empty($schoolName)) {
        http_response_code(400);
        echo json_encode(["error" => "Por favor, preencha todos os campos obrigatórios."]);
        exit;
    }
    
    // Configurações do E-mail
    $to = "leandropisco51@gmail.com";
    $subject = "=?UTF-8?B?" . base64_encode("Novo Lead rmescola: " . $schoolName) . "?=";
    
    // Corpo do E-mail
    $message = "Você recebeu uma nova solicitação de acesso gratuito pelo site rmescola.com:\n\n";
    $message .= "----------------------------------------\n";
    $message .= "👤 Nome: " . $name . "\n";
    $message .= "📧 E-mail: " . $email . "\n";
    $message .= "📞 Telefone/WhatsApp: " . $phone . "\n";
    $message .= "🏫 Nome da Escola: " . $schoolName . "\n";
    $message .= "📊 Quantidade de Alunos: " . $size . "\n";
    $message .= "----------------------------------------\n\n";
    $message .= "Enviado automaticamente pelo servidor rmescola.com.";
    
    // Cabeçalhos do E-mail
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/plain; charset=UTF-8\r\n";
    $headers .= "From: rmescola <no-reply@rmescola.com>\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Enviar o e-mail
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["success" => true, "message" => "Solicitação enviada com sucesso!"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Erro interno no servidor ao enviar o e-mail."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método de requisição não suportado."]);
}
?>
