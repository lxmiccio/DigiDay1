angular.module("CalendarMdl", [])

.controller("CalendarCtrl", function ($http, $scope, $uibModal, Events, Existing) {

  $scope.openEvent = function (view, event) {
    var modalInstance = $uibModal.open({
      animation: true,
      controller: function ($http, $scope, $uibModalInstance, Events, User, Utility, event) {

        $scope.Events = Events;
        $scope.User = User;
        $scope.Utility = Utility;

        $scope.event = event;

        $scope.ok = function () {
          $uibModalInstance.close();
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss("cancel");
        };

        $scope.deleteEvent = function () {
          $scope.Events.delete($scope.event.id);
          $scope.cancel();
        };

        $scope.isOwner = function () {
          var boolean = false;
          if ($scope.User.getUser()) {
            if ($scope.event.creator.id.toUpperCase().toString() == $scope.User.getUser().fresher.toUpperCase().toString()) {
              boolean = true;
            }
          }
          return boolean;
        };

        $scope.isSubscribed = function () {
          var boolean = false;
          if ($scope.User.getUser()) {
            if (angular.isArray($scope.event.partecipants)) {
              $scope.event.partecipants.forEach(function (entry) {
                if (entry.id.toUpperCase().toString() == $scope.User.getUser().fresher.toUpperCase().toString()) {
                  boolean = true;
                }
              });
            }
          }
          return boolean;
        };

        $scope.subscribe = function () {
          $http.post("/DigiDay/php/routes/event.php/subscribe", {id: event.id})
          .success(function (data, status, headers, config) {
            if (data.subscribed) {
              $scope.event.partecipants.push({
                id: $scope.User.getUser().fresher,
                firstName: $scope.User.getUser().firstName,
                lastName: $scope.User.getUser().lastName,
                image: $scope.User.getUser().email
              });
            } else {
              console.log(data);
            }
          })
          .error(function (data, status, headers, config) {
            console.log(data);
          });
        };

        $scope.unsubscribe = function () {
          $http.post("/DigiDay/php/routes/event.php/unsubscribe", {id: event.id})
          .success(function (data, status, headers, config) {
            if (data.unsubscribed) {
              var splice;
              if (angular.isArray($scope.event.partecipants)) {
                $scope.event.partecipants.forEach(function (entry, index) {
                  if (entry.id.toUpperCase().toString() === $scope.User.getUser().fresher.toUpperCase().toString()) {
                    splice = index;
                  }
                });
              }
              $scope.event.partecipants.splice(splice, 1);
            } else {
              console.log(data);
            }
          })
          .error(function (data, status, headers, config) {
            console.log(data);
          });
        };

        $scope.openPartecipants = function (size, view) {

          var modalInstance = $uibModal.open({
            animation: true,
            controller: function ($scope, $uibModalInstance, event) {

              $scope.ok = function () {
                $uibModalInstance.close();
              };

              $scope.cancel = function () {
                $uibModalInstance.dismiss("cancel");
              };

              $scope.event = event;
            },
            resolve: {
              event: function () {
                return event;
              }
            },
            size: size,
            templateUrl: view
          });
        };

        $scope.openUser = function (view) {
          var modalInstance = $uibModal.open({
            animation: true,
            controller: function ($http, $scope, $timeout, $uibModalInstance, Events, Existing, Form, User, Utility) {

              $scope.ok = function () {
                $uibModalInstance.close();
              };

              $scope.cancel = function () {
                $uibModalInstance.dismiss("cancel");
              };

              $scope.Events = Events;

              $scope.Existing = Existing;
              $scope.Form = Form;
              $scope.User = User;
              $scope.Utility = Utility;

              $scope.Existing.refreshEmails();
              $scope.Existing.refreshFreshers();

              $scope.showErrorMessage = false;
              $scope.showSuccessMessage = false;

              $scope.login = function (user) {
                $scope.User.login(user, function () {
                  $scope.Events.refresh();
                  $scope.showSuccessMessage = true;
                  $scope.message = "Autenticazione riuscita!";
                  $timeout(function () {
                    $scope.showSuccessMessage = false;
                    $scope.cancel();
                  }, 500);
                }, function () {
                  $scope.showErrorMessage = true;
                  $scope.message = "Autenticazione fallita!";
                  $scope.submessage = "Matricola e Password non corrispondono";
                  $timeout(function () {
                    $scope.showErrorMessage = false;
                  }, 3000);
                });
              };

              $scope.create = function (user) {
                $scope.User.create(user, function () {
                  $scope.showSuccessMessage = true;
                  $scope.message = "Utente creato con successo!";
                  $timeout(function () {
                    $scope.showSuccessMessage = false;
                    $scope.cancel();
                    $scope.open("views/user/login.html");
                  }, 500);
                }, function () {
                  $scope.showErrorMessage = true;
                  $scope.message = "Impossibile creare l'Utente!";
                  $timeout(function () {
                    $scope.showErrorMessage = false;
                  }, 3000);
                });
              };

              $scope.freshers = [];

              $scope.emails = [];

              $http.get("/DigiDay/php/router.php/freshers")
              .success(function (data, status, headers, config) {
                if (Array.isArray(data.freshers)) {
                  data.freshers.forEach(function (entry) {
                    $scope.freshers.push(entry);
                  });
                }
              })
              .error(function (data, status, headers, config) {
                console.log(data);
              });

              $http.get("/DigiDay/php/router.php/emails")
              .success(function (data, status, headers, config) {
                if (Array.isArray(data.emails)) {
                  data.emails.forEach(function (entry) {
                    $scope.emails.push(entry);
                  });
                }
              })
              .error(function (data, status, headers, config) {
                console.log(data);
              });
            },
            size: "lg",
            templateUrl: view
          });
        };
      },
      resolve: {
        event: function () {
          return event;
        }
      },
      size: "lg",
      templateUrl: view
    });
  };

  var vm = this;

  vm.Events = Events;
  vm.Existing = Existing;

  vm.Events.refresh();
  vm.Existing.refreshTopics();

  vm.calendarView = 'month';
  vm.viewDate = new Date();

  vm.eventClicked = function (event) {
    $scope.openSession("views/calendar/session.html", event);
  };
})

.filter("partecipants", function () {
  return function (partecipants) {
    if (angular.isArray(partecipants)) {
      var array = [];
      partecipants.forEach(function (entry, index) {
        entry.lowerFirstName = entry.firstName.toLowerCase();
        array.push(entry);
      });
      console.log(array);
      return array;
    } else {
      return partecipants;
    }
  };
});
