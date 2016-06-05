<?php

session_start();


require_once "../../libraries/vendor/autoload.php";

$router = new Phroute\Phroute\RouteCollector();

/**
* Returns all the emails
*/
$router->get("DigiDay/php/routes/get.php/emails", function() {
  require_once "connection.php";

  try {
    $emails = array();
    foreach ($mysql->query("SELECT Email AS email FROM Utente") as $row) {
      $emails[] = $row["email"];
    }
    echo json_encode(array(
      "successful" => true,
      "emails" => $emails
    ));
  } catch (PDOException $exception) {
    echo json_encode(array(
      "successful" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Returns all the freshers
*/
$router->get("DigiDay/php/routes/get.php/freshers", function() {
  require_once "connection.php";

  try {
    $freshers = array();
    foreach ($mysql->query("SELECT Matricola AS fresher FROM Utente") as $row) {
      $freshers[] = $row["fresher"];
    }
    echo json_encode(array(
      "successful" => true,
      "freshers" => $freshers
    ));
  } catch (PDOException $exception) {
    echo json_encode(array(
      "successful" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});

/*
 * Returns all the classrooms including the sessions from which they are required
 */
 $router->get("DigiDay/php/routes/get.php/classrooms", function() {
   require_once "connection.php";

   try {
     $classrooms = array();
     foreach ($mysql->query("SELECT Aula.IdAula AS id, Aula.Nome AS name, Aula.Capienza AS capacity, Aula.Caratteristiche AS features, Sessione.DataInizio AS startingDate, Sessione.DataFine AS endingDate FROM Aula LEFT OUTER JOIN Sessione ON Aula.IdAula = Sessione.IdAula ORDER BY Aula.Nome") as $row) {
       $added = false;
       foreach ($classrooms as &$classroom) {
         if ($classroom["id"] == $row["id"]) {
           $added = true;
           $classroom["events"][] = array(
             "startingDate" => $row["startingDate"],
             "endingDate" => $row["endingDate"]
           );
         }
       }
       if (!$added) {
         $classrooms[] = array(
           "id" => $row["id"],
           "name" => $row["name"],
           "capacity" => $row["capacity"],
           "features" => $row["features"],
           "sessions" => null
         );
         if (isset($row["startingDate"]) || isset($row["endingDate"])) {
           $classrooms[count($classrooms) - 1]["events"] = array(
             "startingDate" => $row["startingDate"],
             "endingDate" => $row["endingDate"]
           );
         }
       }
     }
     echo json_encode(array(
       "successful" => true,
       "classrooms" => $classrooms
     ));
   } catch (PDOException $exception) {
     echo json_encode(array(
       "successful" => false,
       "message" => $exception->getMessage()
     ));
   } finally {
     $mysql = null;
   }
 });

/**
* Returns all the items including the sessions from which they are required
*/
$router->get("DigiDay/php/routes/get.php/items", function() {
  require_once "connection.php";

  try {
    $items = array();
    foreach ($mysql->query("SELECT Materiale.IdMateriale AS id, Materiale.Nome AS name, Materiale.Descrizione AS description, Materiale.Quantita AS amount, Richiede.Quantita AS requiredAmount, Sessione.DataInizio AS startingDate, Sessione.DataFine AS endingDate FROM Materiale LEFT OUTER JOIN Richiede ON Materiale.IdMateriale = Richiede.IdMateriale LEFT OUTER JOIN Sessione ON Richiede.IdSessione = Sessione.IdSessione ORDER BY Materiale.Nome") as $row) {
      $added = false;
      foreach ($items as &$item) {
        if ($item["id"] == $row["id"]) {
          $added = true;
          if(!is_array($item["sessions"])) {
            $item["events"] = array();
          }
          $item["events"][] = array(
              "requiredAmount" => $row["requiredAmount"],
              "startingDate" => $row["startingDate"],
              "endingDate" => $row["endingDate"]
          );
        }
      }
      if (!$added) {
        $items[] = array(
          "id" => $row["id"],
          "description" => $row["description"],
          "name" => $row["name"],
          "amount" => $row["amount"],
          "events" => null
        );
        if (isset($row["startingDate"]) || isset($row["endingDate"])) {
          if(!is_array($item["sessions"])) {
            $item[count($items) - 1]["events"] = array();
          }
          $items[count($items) - 1]["events"] = array(
            array(
              "requiredAmount" => $row["requiredAmount"],
              "startingDate" => $row["startingDate"],
              "endingDate" => $row["endingDate"]
            )
          );
        }
      }
    }
    echo json_encode(array(
      "successful" => true,
      "items" => $items
    ));
  } catch (PDOException $exception) {
    echo json_encode(array(
      "successful" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Returns all the topics
*/
$router->get("DigiDay/php/routes/get.php/topics", function() {
  require_once "connection.php";

  try {
    $topics = array();
    foreach ($mysql->query("SELECT IdArgomento AS id, Ambito AS scope, Descrizione AS description FROM Argomento ORDER BY scope") as $row) {
      $topics[] = array(
        "id" => $row["id"],
        "scope" => $row["scope"],
        "description" => $row["description"]
      );
    }
    echo json_encode(array(
      "successful" => true,
      "topics" => $topics
    ));
  } catch (PDOException $exception) {
    echo json_encode(array(
      "successful" => false,
      "message" => $exception->getMessage()
    ));
  } finally {
    $mysql = null;
  }
});


$dispatcher = new Phroute\Phroute\Dispatcher($router->getData());

$response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

echo $response;
