<?php

require_once "../libraries/vendor/autoload.php";

$mail = new PHPMailer();

$mail->isSMTP();
$mail->SMTPAuth = true;

$mail->isHTML(true);

$mail->SMTPSecure = "tls";
$mail->Port = 587;

$mail->Host = "smtp.gmail.com";
$mail->Username = "miccio.alex@gmail.com";
$mail->Password = "password";

$mail->setFrom("miccio.alex@gmail.com", "Alex Miccio");

/*
$mail->addAddress($recipient, $name);
$mail->addAddress($recipient);

$mail->Subject = $subject;
$mail->Body = $body;

$json = array();
if (!$this->mail->send()) {
    $json["error"] = true;
    $json["message"] = $this->mail->ErrorInfo;
} else {
    $json["error"] = false;
    $json["message"] = "Email Has Been Sent";
}
return json_encode($json);
*/
