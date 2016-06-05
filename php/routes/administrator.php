<?php

session_start();


require_once "../../libraries/vendor/autoload.php";

$router = new Phroute\Phroute\RouteCollector();

/**
* Creates a classroom
*/
$router->post("DigiDay/php/administrator.php/create/classroom", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $name = filter_var($json->classroom->name, FILTER_SANITIZE_STRING);
  $capacity = filter_var($json->classroom->capacity, FILTER_SANITIZE_NUMBER_INT);
  if (isset($json->classroom->features)) {
    $features = filter_var($json->classroom->features, FILTER_SANITIZE_STRING);
  } else {
    $features = null;
  }

  try {
    $result = $mysql->query("INSERT INTO Aula (Nome, Capienza, Caratteristiche) VALUES ('" . $name . "', " . $capacity . ", '" . $features . "')");

    if ($result->rowCount() > 0) {
      echo json_encode(array(
        "created" => true,
        "message" => "Aula creata con successo"
      ));
    } else {
      echo json_encode(array(
        "created" => false,
        "message" => "Impossibile creare l'aula"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "created" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Creates an item
*/
$router->post("DigiDay/php/administrator.php/create/item", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $name = filter_var($json->item->name, FILTER_SANITIZE_STRING);
  if (isset($json->item->description)) {
    $description = filter_var($json->item->description, FILTER_SANITIZE_STRING);
  } else {
    $description = null;
  }

  try {
    $result = $mysql->query("INSERT INTO Materiale (Nome, Descrizione) VALUES ('" . $name . "', '" . $description . "')");

    if ($result->rowCount() > 0) {
      echo json_encode(array(
        "created" => true,
        "message" => "Materiale creato con successo"
      ));
    } else {
      echo json_encode(array(
        "created" => false,
        "message" => "Impossibile creare il materiale"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "created" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Creates a topic
*/
$router->post("DigiDay/php/administrator.php/create/topic", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $scope = filter_var($json->topic->scope, FILTER_SANITIZE_STRING);
  if (isset($json->topic->description)) {
    $description = filter_var($json->topic->description, FILTER_SANITIZE_STRING);
  } else {
    $description = null;
  }

  try {
    $result = $mysql->query("INSERT INTO Argomento (Ambito, Descrizione) VALUES ('" . $scope . "', '" . $description . "')");

    if ($result->rowCount() > 0) {
      echo json_encode(array(
        "created" => true,
        "message" => "Argomento creato con successo"
      ));
    } else {
      echo json_encode(array(
        "created" => false,
        "message" => "Impossibile creare l'argomento"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "created" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Updates a classroom
*/
$router->post("DigiDay/php/administrator.php/update/classroom", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $id = filter_var($json->classroom->id, FILTER_SANITIZE_NUMBER_INT);
  $name = filter_var($json->classroom->name, FILTER_SANITIZE_STRING);
  $capacity = filter_var($json->classroom->capacity, FILTER_SANITIZE_NUMBER_INT);
  if (isset($json->classroom->features)) {
    $features = filter_var($json->classroom->features, FILTER_SANITIZE_STRING);
  } else {
    $features = null;
  }

  try {
    $result = $mysql->query("UPDATE Aula SET Nome = '" . $name . "', Capienza = '" . $capacity . "', Caratteristiche = '" . $features . "' WHERE IdAula = '" . $id . "'");
    if ($result->rowCount() > 0) {
      echo json_encode(array(
        "updated" => true,
        "message" => "Aula modificata con successo"
      ));
    } else {
      echo json_encode(array(
        "updated" => false,
        "message" => "Impossibile modificare l'aula"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "updated" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Updates an item
*/
$router->post("DigiDay/php/administrator.php/update/item", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $id = filter_var($json->item->id, FILTER_SANITIZE_NUMBER_INT);
  $name = filter_var($json->item->name, FILTER_SANITIZE_STRING);
  if (isset($json->item->description)) {
    $description = filter_var($json->item->description, FILTER_SANITIZE_STRING);
  } else {
    $description = null;
  }

  try {
    $result = $mysql->query("UPDATE Materiale SET Nome = '" . $name . "', Descrizione = '" . $description . "' WHERE IdMateriale = '" . $id . "'");
    if ($result->rowCount() > 0) {
      echo json_encode(array(
        "updated" => false,
        "message" => "Materiale modificato con successo"
      ));
    } else {
      echo json_encode(array(
        "updated" => false,
        "message" => "Impossibile modificato il materiale"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "updated" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Updates a topic
*/
$router->post("DigiDay/php/administrator.php/update/topic", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $id = filter_var($json->topic->id, FILTER_SANITIZE_NUMBER_INT);
  $scope = filter_var($json->topic->scope, FILTER_SANITIZE_STRING);
  if (isset($json->item->description)) {
    $description = filter_var($json->item->description, FILTER_SANITIZE_STRING);
  } else {
    $description = null;
  }

  try {
    $result = $mysql->query("UPDATE Argomento SET Ambito = '" . $scope . "', Descrizione = '" . $description . "' WHERE IdArgomento = '" . $id . "'");
    if ($result->rowCount() > 0) {
      echo json_encode(array(
        "updated" => true,
        "message" => "Argomento modificato con successo"
      ));
    } else {
      echo json_encode(array(
        "updated" => false,
        "message" => "Impossibile modificare l'argomento"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "updated" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Deletes a classroom
*/
$router->post("DigiDay/php/administrator.php/delete/classroom", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $id = filter_var($json->id, FILTER_SANITIZE_STRING);

  try {
    $result = $mysql->query("DELETE FROM Aula WHERE IdAula = '" . $id . "'");
    if ($result->rowCount() > 0) {
      echo json_encode(array(
        "deleted" => true,
        "message" => "Aula eliminata con successo"
      ));
    } else {
      echo json_encode(array(
        "deleted" => false,
        "message" => "Impossibile eliminare l'aula"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "deleted" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Deletes an item
*/
$router->post("DigiDay/php/administrator.php/delete/item", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $id = filter_var($json->id, FILTER_SANITIZE_STRING);

  try {
    $result = $mysql->query("DELETE FROM Materiale WHERE IdMateriale = '" . $id . "'");
    if ($result->rowCount() > 0) {
      echo json_encode(array(
        "deleted" => true,
        "message" => "Materiale eliminato con successo"
      ));
    } else {
      echo json_encode(array(
        "deleted" => false,
        "message" => "Impossibile eliminare il materiale"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "deleted" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Deletes a topic
*/
$router->post("DigiDay/php/administrator.php/delete/topic", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $id = filter_var($json->id, FILTER_SANITIZE_STRING);

  try {
    $result = $mysql->query("DELETE FROM Argomento WHERE IdArgomento = '" . $id . "'");
    if ($result->rowCount() > 0) {
      echo json_encode(array(
        "deleted" => true,
        "message" => "Argomento eliminato con successo"
      ));
    } else {
      echo json_encode(array(
        "deleted" => false,
        "message" => "Impossibile eliminare l'argomento"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "deleted" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});


$dispatcher = new Phroute\Phroute\Dispatcher($router->getData());

$response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

echo $response;
