angular.module("CalendarMdl", [])

.controller("CalendarCtrl", function ($http, $scope, $uibModal, Events, Existing) {

  $scope.openEvent = function (size, view, event) {
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
            if ($scope.event.creator.fresher.toString().toUpperCase() == $scope.User.getUser().fresher.toString().toUpperCase()) {
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
                if (entry.fresher.toString().toUpperCase() == $scope.User.getUser().fresher.toString().toUpperCase()) {
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
              $scope.Events.refresh();
              if(!angular.isArray($scope.event.partecipants)) {
                $scope.event.partecipants = [];
              }
              $scope.event.partecipants.push({
                fresher: $scope.User.getUser().fresher,
                firstName: $scope.User.getUser().firstName,
                lastName: $scope.User.getUser().lastName,
                email: $scope.User.getUser().email
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
              $scope.Events.refresh();
              var splice;
              if (angular.isArray($scope.event.partecipants)) {
                $scope.event.partecipants.forEach(function (entry, index) {
                  if (entry.fresher.toString().toUpperCase() === $scope.User.getUser().fresher.toString().toUpperCase()) {
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

        $scope.openUser = function (size, view) {
          var modalInstance = $uibModal.open({
            animation: true,
            controller: function ($http, $scope, $timeout, $uibModalInstance, Events, Existing, Form, User, Utility) {

              $scope.ok = function () {
                $uibModalInstance.close();
              };

              $scope.cancel = function () {
                $uibModalInstance.dismiss("cancel");
              };

              $scope.Form = Form;
              $scope.User = User;
              $scope.Utility = Utility;

              $scope.showErrorMessage = false;
              $scope.showSuccessMessage = false;

              $scope.login = function (fresher, password) {
                $scope.User.login(fresher, password, function (message) {
                  $scope.showSuccessMessage = true;
                  $scope.message = message;
                  $timeout(function () {
                    $scope.showSuccessMessage = false;
                    $scope.cancel();
                  }, 500);
                }, function (message) {
                  $scope.showErrorMessage = true;
                  $scope.message = message;
                  $timeout(function () {
                    $scope.showErrorMessage = false;
                  }, 2500);
                });
              };

              $scope.create = function (user) {
                $scope.User.create(user, function (message) {
                  $scope.showSuccessMessage = true;
                  $scope.message = message;
                  $timeout(function () {
                    $scope.showSuccessMessage = false;
                    $scope.cancel();
                  }, 500);
                }, function (message) {
                  $scope.showErrorMessage = true;
                  $scope.message = message;
                  $timeout(function () {
                    $scope.showErrorMessage = false;
                  }, 2500);
                });
              };
            },
            size: size,
            templateUrl: view
          });
        };
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

  var vm = this;

  vm.Events = Events;
  vm.Existing = Existing;

  vm.Events.refresh();
  vm.Existing.refreshTopics();

  vm.calendarView = 'month';
  vm.viewDate = new Date();

  vm.eventClicked = function (event) {
    $scope.openEvent("lg", "views/calendar/session.html", event);
  };
});
