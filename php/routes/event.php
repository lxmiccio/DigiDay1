<?php

session_start();


require_once "../../libraries/vendor/autoload.php";

$router = new Phroute\Phroute\RouteCollector();


/**
* Returns all the sessions to print them into the calendar
*/
$router->get("DigiDay/php/routes/event.php/events", function() {
  require_once "connection.php";

  try {
    $events = array();
    foreach ($mysql->query("SELECT Sessione.IdSessione AS id, Sessione.Titolo AS title, Sessione.DataInizio AS startingDate, Sessione.DataFine AS endingDate, Sessione.NumeroMassimo AS maxPartecipants, Sessione.Dettagli AS details, Sessione.MatricolaCreatore AS creatorFresher, "
    . "Creatore.Nome AS creatorFirstName, Creatore.Cognome AS creatorLastName, Creatore.Email AS creatorEmail, "
    . "Partecipa.MatricolaUtente AS partecipantFresher, Utente.Nome AS partecipantFirstName, Utente.Cognome AS partecipantLastName, Utente.Email AS partecipantEmail, "
    . "Argomento.IdArgomento AS topicId, Argomento.Ambito AS topicScope, Argomento.Descrizione as topicDescription, "
    . "Aula.IdAula AS classId, Aula.Nome AS className, Aula.Caratteristiche AS classFeatures, "
    . "Richiede.IdMateriale AS requiredItemId, Richiede.Quantita AS requiredItemAmount "
    . "FROM Sessione INNER JOIN Utente AS Creatore ON Sessione.MatricolaCreatore = Creatore.Matricola "
    . "INNER JOIN Argomento ON Sessione.IdArgomento = Argomento.IdArgomento "
    . "LEFT JOIN Partecipa ON Sessione.IdSessione = Partecipa.IdSessione "
    . "LEFT JOIN Utente ON Partecipa.MatricolaUtente = Utente.Matricola "
    . "LEFT JOIN Aula ON Sessione.IdAula = Aula.IdAula "
    . "LEFT JOIN Richiede On Sessione.IdSessione = Richiede.IdSessione") as $row) {
      $added = false;
      foreach ($events as &$event) {
        if ($event["id"] == $row["id"]) {
          $added = true;
          if (!is_null($row["partecipantFresher"])) {
            if(!is_array($event)) {
              $event["partecipants"] = array();
            }
            $event["partecipants"][] = array(
              "fresher" => $row["partecipantFresher"],
              "firstName" => $row["partecipantFirstName"],
              "lastName" => $row["partecipantLastName"],
              "email" => $row["partecipantEmail"]
            );
          }
        }
      }
      if (!$added) {
        $events[] = array(
          "id" => $row["id"],
          "title" => $row["title"],
          "startingDate" => $row["startingDate"],
          "endingDate" => $row["endingDate"],
          "startsAt" => str_replace(" ", "T", $row["startingDate"]) . "Z",
          "endsAt" => str_replace(" ", "T", $row["endingDate"]) . "Z",
          "maxPartecipants" => $row["maxPartecipants"],
          "details" => $row["details"],
          "creator" => array(
            "fresher" => $row["creatorFresher"],
            "firstName" => $row["creatorFirstName"],
            "lastName" => $row["creatorLastName"],
            "email" => $row["creatorEmail"]
          ),
          "partecipants" => null,
          "topic" => array(
            "id" => $row["topicId"],
            "scope" => $row["topicScope"],
            "description" => $row["topicDescription"]
          ),
          "classroom" => array(
            "id" => $row["classId"],
            "name" => $row["className"],
            "features" => $row["classFeatures"]
          ),
          "items" => array(
            "id" => $row["requiredItemId"],
            "requiredAmount" => $row["requiredItemAmount"]
          )
        );
        if (!is_null($row["partecipantFresher"])) {
          if(!is_array($events[count($events) - 1]["partecipants"])) {
            $events[count($events) - 1]["partecipants"] = array();
          }
          $events[count($events) - 1]["partecipants"][] = array(
            "fresher" => $row["partecipantFresher"],
            "firstName" => $row["partecipantFirstName"],
            "lastName" => $row["partecipantLastName"],
            "email" => $row["partecipantEmail"]
          );
        }
      }
    }
    echo json_encode(array(
      "error" => false,
      "events" => $events
    ));
  } catch (PDOException $exception) {
    echo json_encode(array(
      "error" => true,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Creates an event
*/
$router->post("DigiDay/php/routes/event.php/create", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $startingDate = date("Y-m-d H:i:s", strtotime(filter_var($json->event->startingDate, FILTER_SANITIZE_STRING)));
  $endingDate = date("Y-m-d H:i:s", strtotime(filter_var($json->event->endingDate, FILTER_SANITIZE_STRING)));
  $classroom = filter_var($json->event->classroom->id, FILTER_SANITIZE_STRING);
  $maxPartecipants = filter_var($json->event->maxPartecipants, FILTER_SANITIZE_STRING);
  $items = $json->event->items;
  $title = filter_var($json->event->title, FILTER_SANITIZE_STRING);
  $topic = filter_var($json->event->topic->id, FILTER_SANITIZE_STRING);
  if (isset($json->classroom->features)) {
    $details = filter_var($json->event->details, FILTER_SANITIZE_STRING);
  } else {
    $details = null;
  }

  try {
    $result = $mysql->query("INSERT INTO Sessione (Titolo, DataInizio, DataFine, NumeroMassimo, Dettagli, MatricolaCreatore, IdAula, IdArgomento) VALUES ('" . $title . "', '" . $startingDate . ':00' . "', '" . $endingDate . ':00' . "', '" . $maxPartecipants . "', '" . $details . "', '" . $_SESSION["user"]["fresher"] . "', '" . $classroom . "', '" . $topic . "')");
    if ($result->rowCount() > 0) {
      $id = $mysql->lastInsertId();
      foreach ($items as $item) {
        $mysql->query("INSERT INTO Richiede (IdSessione, IdMateriale, Quantita) VALUES (" . $id . ", " . $item->id . ", " . $item->required . ")");
      }
      echo json_encode(array(
        "created" => true,
        "message" => "Evento creato con successo"
      ));
    } else {
      echo json_encode(array(
        "created" => false,
        "message" => "Impossibile creare l'evento"
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
* Deletes an event
*/
$router->post("DigiDay/php/routes/event.php/delete", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $id = filter_var($json->id, FILTER_SANITIZE_STRING);

  try {
    $result = $mysql->query("DELETE FROM Sessione WHERE IdSessione = '" . $id . "'");
    if ($result->rowCount() > 0) {
      echo json_encode(array(
        "deleted" => true,
        "message" => "Evento eliminato con successo"
      ));
    } else {
      echo json_encode(array(
        "deleted" => false,
        "message" => "Impossibile eliminare l'evento"
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
* Subscribes the logged user
*/
$router->post("DigiDay/php/routes/event.php/subscribe", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $id = filter_var($json->id, FILTER_SANITIZE_STRING);

  try {
    $result = $mysql->query("INSERT INTO Partecipa (MatricolaUtente, IdSessione) VALUES('" . $_SESSION["user"]["fresher"] . "', '" . $id . "')");
    if ($result->rowCount() > 0) {
      echo json_encode(array(
        "subscribed" => true,
        "message" => "Iscritto con successo"
      ));
    } else {
      echo json_encode(array(
        "subscribed" => false,
        "message" => "Impossibile iscriversi"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "subscribed" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Unsubscribes the logged user
*/
$router->post("DigiDay/php/routes/event.php/unsubscribe", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $id = filter_var($json->id, FILTER_SANITIZE_STRING);

  try {
    $result = $mysql->query("DELETE FROM Partecipa WHERE MatricolaUtente = '" . $_SESSION["user"]["fresher"] . "' AND IdSessione = '" . $id . "'");
    if ($result->rowCount() > 0) {
      echo json_encode(array(
        "unsubscribed" => true,
        "message" => "Disiscritto con successo"
      ));
    } else {
      echo json_encode(array(
        "unsubscribed" => false,
        "message" => "Impossibile disiscriversi"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "unsubscribed" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});


$dispatcher = new Phroute\Phroute\Dispatcher($router->getData());

$response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

echo $response;
