<?php

session_start();


require_once "../../libraries/vendor/autoload.php";

$router = new Phroute\Phroute\RouteCollector();

/**
* Returns the logged user
*/
$router->get("DigiDay/php/routes/user.php/me", function() {
  if (isset($_SESSION["user"])) {
    echo json_encode(array(
      "logged" => true,
      "user" => $_SESSION["user"]
    ));
  } else {
    echo json_encode(array(
      "logged" => false,
    ));
  }
});

/**
* Creates an user and returns it
*/
$router->post("DigiDay/php/routes/user.php/create", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $fresher = filter_var($json->user->fresher, FILTER_SANITIZE_STRING);
  $password = crypt($json->user->password, "$2y$10$" . substr(md5(uniqid(rand(), true)), 0, 22));
  $firstName = filter_var($json->user->firstName, FILTER_SANITIZE_STRING);
  $lastName = filter_var($json->user->lastName, FILTER_SANITIZE_STRING);
  $email = filter_var($json->user->email, FILTER_SANITIZE_EMAIL);
  $birthdate = date("Y-m-d", strtotime(filter_var($json->user->birthdate, FILTER_SANITIZE_STRING)));
  $role = filter_var($json->user->role, FILTER_SANITIZE_STRING);
  $sex = filter_var($json->user->sex, FILTER_SANITIZE_STRING);

  if (!strcmp($sex, "Uomo")) {
    $image = "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-128.png";
  } else {
    $image = "https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-128.png";
  }

  try {
    $result = $mysql->query("INSERT INTO Utente (Matricola, Password, Nome, Cognome, Email, DataNascita, Ruolo, Sesso, Foto) VALUES ('" . $fresher . "', '" . $password . "', '" . $firstName . "', '" . $lastName . "', '" . $email . "', '" . $birthdate . "', '" . $role . "', '" . $sex . "', '" . $image . "')");

    if ($result->rowCount() > 0) {
      $_SESSION["user"]["fresher"] = $fresher;
      $_SESSION["user"]["firstName"] = $firstName;
      $_SESSION["user"]["lastName"] = $lastName;
      $_SESSION["user"]["email"] = $email;
      $_SESSION["user"]["administrator"] = false;
      $_SESSION["user"]["birthdate"] = $birthdate;
      $_SESSION["user"]["role"] = $role;
      $_SESSION["user"]["sex"] = $sex;
      $_SESSION["user"]["image"] = $image;

      echo json_encode(array(
        "created" => true,
        "message" => "Utente creato con successo",
        "user" => $_SESSION["user"]
      ));
    } else {
      echo json_encode(array(
        "created" => false,
        "message" => "Impossibile creare l'utente"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "created" => false,
      "message" => "Impossibile creare l'utente [" . $exception->getMessage() . "]"
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Logs the user in and returns it
*/
$router->post("DigiDay/php/routes/user.php/login", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $fresher = filter_var($json->fresher, FILTER_SANITIZE_STRING);
  $password = $json->password;

  try {
    $logged = false;

    foreach ($mysql->query("SELECT Matricola AS fresher, Password AS password, Nome AS firstName, Cognome AS lastName, Email AS email, Amministratore AS administrator, DataNascita AS birthdate, Ruolo AS role, Sesso AS sex, Foto AS image FROM Utente WHERE Matricola = '" . $fresher . "' LIMIT 1") as $row) {
      if (crypt($password, $row["password"]) == $row["password"]) {
        $logged = true;

        $_SESSION["user"]["fresher"] = $row["fresher"];
        $_SESSION["user"]["firstName"] = $row["firstName"];
        $_SESSION["user"]["lastName"] = $row["lastName"];
        $_SESSION["user"]["email"] = $row["email"];
        $_SESSION["user"]["administrator"] = $row["administrator"];
        $_SESSION["user"]["birthdate"] = $row["birthdate"];
        $_SESSION["user"]["role"] = $row["role"];
        $_SESSION["user"]["sex"] = $row["sex"];
        $_SESSION["user"]["image"] = $row["image"];
      }
    }
    if ($logged) {
      echo json_encode(array(
        "logged" => true,
        "message" => "Utente autenticato con successo",
        "user" => $_SESSION["user"]
      ));
    } else {
      echo json_encode(array(
        "logged" => false,
        "message" => "Impossibile autenticare l'utente [Matricola e Password non corrispondono]"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "logged" => false,
      "message" => "Impossibile autenticare l'utente [" . $exception->getMessage() . "]"
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Logs the user out
*/
$router->get("DigiDay/php/routes/user.php/logout", function() {
  session_unset();
  session_destroy();
});

/**
* Deletes the user and logs it out
*/
$router->post("DigiDay/php/routes/user.php/delete", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $password = $json->password;

  try {
    $rightPassword = false;

    foreach ($mysql->query("SELECT Matricola AS fresher, Password AS password, Nome AS firstName, Cognome AS lastName, Email AS email, DataNascita AS birthdate, Ruolo AS role, Sesso AS sex, Foto AS image FROM Utente WHERE LOWER(Matricola) = '" . $_SESSION["user"]["fresher"] . "' LIMIT 1") as $row) {
      if (crypt($password, $row["password"]) == $row["password"]) {
        $rightPassword = true;

        $result = $mysql->query("DELETE FROM Utente WHERE Matricola = '" . $_SESSION["user"]["fresher"] . "'");

        if ($result->rowCount() > 0) {
          echo json_encode(array(
            "deleted" => true,
            "message" => "Utente eliminato con successo"
          ));
        } else {
          echo json_encode(array(
            "deleted" => false,
            "message" => "Impossibile eliminare l'utente"
          ));
        }
      }
    }
    if (!$rightPassword) {
      echo json_encode(array(
        "deleted" => false,
        "message" => "Impossibile eliminare l'utente [Password attuale errata]"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "deleted" => false,
      "message" => "Impossibile eliminare l'utente [" . $exception->getMessage() . "]"
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Updates the user's email
*/
$router->post("DigiDay/php/routes/user.php/email", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $email = filter_var($json->email, FILTER_SANITIZE_EMAIL);

  try {
    $result = $mysql->query("UPDATE Utente SET Email = '" . $email . "' WHERE Matricola = '" . $_SESSION["user"]["fresher"] . "'");

    if ($result->rowCount() > 0) {
      $_SESSION["user"]["email"] = $email;

      echo json_encode(array(
        "changed" => true,
        "message" => "Indirizzo e-mail modificato con successo"
      ));
    } else {
      echo json_encode(array(
        "changed" => false,
        "message" => "Impossibile modificare l'indirizzo e-mail"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "changed" => false,
      "message" => "Impossibile modificare l'indirizzo e-mail [" . $exception->getMessage() . "]"
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Updates the user's image
*/
$router->post("DigiDay/php/routes/user.php/image", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));
  $image = $json->image;

  try {
    $result = $mysql->query("UPDATE Utente SET Foto = '" . $image . "' WHERE Matricola = '" . $_SESSION["user"]["fresher"] . "'");

    if ($result->rowCount() > 0) {
      $_SESSION["user"]["image"] = $image;

      echo json_encode(array(
        "changed" => true,
        "message" => "Immagine modificata con successo"
      ));
    } else {
      echo json_encode(array(
        "changed" => false,
        "message" => "Impossibile modificare l'immagine"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "changed" => false,
      "message" => "Impossibile modificare l'immagine [" . $exception->getMessage() . "]"
    ));
  } finally {
    $mysql = null;
  }
});

/**
* Updates the user's password
*/
$router->post("DigiDay/php/routes/user.php/password", function() {
  require_once "connection.php";

  $json = json_decode(file_get_contents('php://input'));

  $oldPassword = $json->oldPassword;
  $newPassword = crypt($json->newPassword, "$2y$10$" . substr(md5(uniqid(rand(), true)), 0, 22));

  try {
    $rightPassword = false;
    foreach ($mysql->query("SELECT Password AS password FROM Utente WHERE Matricola = '" . $_SESSION["user"]["fresher"] . "' LIMIT 1") as $row) {
      if (crypt($oldPassword, $row["password"]) == $row["password"]) {
        $rightPassword = true;

        $result = $mysql->query("UPDATE Utente SET Password = '" . $newPassword . "' WHERE Matricola = '" . $_SESSION["user"]["fresher"] . "'");

        if ($result->rowCount() > 0) {
          echo json_encode(array(
            "changed" => true,
            "message" => "Password modificata con successo"
          ));
        } else {
          echo json_encode(array(
            "changed" => false,
            "message" => "Impossibile modificare la password"
          ));
        }
      }
    }
    if (!$rightPassword) {
      echo json_encode(array(
        "changed" => false,
        "message" => "Impossibile modificare la password [Password attuale errata]"
      ));
    }
  } catch (PDOException $exception) {
    echo json_encode(array(
      "changed" => false,
      "message" => "Impossibile modificare la password [" . $exception->getMessage() . "]"
    ));
  } finally {
    $mysql = null;
  }
});


$dispatcher = new Phroute\Phroute\Dispatcher($router->getData());

$response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

echo $response;
