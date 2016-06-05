<?php

$credentials = array(
    "dbname" => "DigiDay",
    "host" => "127.0.0.1",
    "password" => "",
    "username" => "root"
);

try {
    $mysql = new PDO("mysql:host=" . $credentials["host"] . ";dbname=" . $credentials["dbname"] . "", $credentials["username"], $credentials["password"]);
    $mysql->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $exception) {
    echo json_encode(array(
        "error" => true,
        "message" => $exception->getMessage()
    ));
    die();
}
