angular.module("DigiDayMdl", ["Factories", "Filters", "ngRoute", "mwl.calendar", "nya.bootstrap.select", "ui.bootstrap", "ui.router", "AdministratorMdl", "CalendarMdl"])

.config(function ($routeProvider, $stateProvider) {

  $routeProvider.when("/", {
    templateUrl: "views/calendar/calendar.html"
  });
  $routeProvider.when("/amministratore", {
    templateUrl: "views/administrator/administrator.html"
  });
  $routeProvider.when("/utente", {
    templateUrl: "views/user/profile.html"
  });
  $routeProvider.otherwise({
    templateUrl: "views/calendar/calendar.html"
  });

  $stateProvider.state("event", {
    url: "",
    templateUrl: "views/event/form.html",
    controller: "formController"
  }).state('event.1', {
    url: "",
    templateUrl: "views/event/form/1.html"
  }).state('event.2', {
    url: "",
    templateUrl: "views/event/form/2.html"
  }).state('event.3', {
    url: "",
    templateUrl: "views/event/form/3.html"
  }).state('event.4', {
    url: "",
    templateUrl: "views/event/form/4.html"
  });
})

.controller('formController', function ($http, $scope, $timeout, Existing) {

  $scope.Existing = Existing;

  $scope.newSession = {};

  $scope.errorForm1 = true;
  $scope.errorForm2 = true;
  $scope.errorForm3 = false;
  $scope.errorForm4 = true;

  $scope.changeStartingDate = function(session) {
    $scope.newSession.endingDate = null;
    $scope.newSession.classroom = null;
    $scope.newSession.maxPartecipants = null;
    $scope.newSession.items = [];
    $scope.requiredItems = [];
    $scope.setErrorForm1(session);
    $scope.setErrorForm2(session);
    $scope.setErrorForm3(session);
  }

  $scope.changeEndingDate = function(session) {
    $scope.newSession.classroom = null;
    $scope.newSession.maxPartecipants = null;
    $scope.newSession.items = [];
    $scope.requiredItems = [];
    $scope.setErrorForm1(session);
    $scope.setErrorForm2(session);
    $scope.setErrorForm3(session);
  }

  $scope.setErrorForm1 = function (session) {
    if (session.startingDate && session.startingDate.length > 0 && session.endingDate && session.endingDate.length > 0) {
      $scope.errorForm1 = false;
    } else {
      $scope.errorForm1 = true;
    }
  };

  $scope.setErrorForm2 = function (session) {
    if (session.classroom && session.classroom.name.length > 0 && session.maxPartecipants && session.maxPartecipants > 0 && !$scope.Form.isInvalidNumber(session.classroom.capacity, session.maxPartecipants)) {
      $scope.errorForm2 = false;
    } else {
      $scope.errorForm2 = true;
    }
  };

  $scope.setErrorForm3 = function (session) {
    $scope.errorForm3 = false;
    if(angular.isArray(session.items)) {
      session.items.forEach(function (entry) {
        if(entry.required > entry.available) {
          $scope.errorForm3 = true;
        }
      });
    }
  };

  $scope.setErrorForm4 = function (session) {
    if (session.title && session.title.length > 0 && session.topic && session.topic.scope.length > 0) {
      $scope.errorForm4 = false;
    } else {
      $scope.errorForm4 = true;
    }
  };

  $scope.create = function (event) {
    $scope.Events.create(event, function (message) {
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
})

.controller("HomeCtrl", function ($scope, $uibModal, User, Utility) {

  var vm = this;

  vm.User = User;
  vm.Utility = Utility;

  $scope.openUser = function (size, view) {
    var modalInstance = $uibModal.open({
      animation: true,
      controller: function ($http, $location, $scope, $timeout, $uibModalInstance, Form, User, Utility) {

        $scope.Form = Form;
        $scope.User = User;
        $scope.Utility = Utility;

        $scope.ok = function () {
          $uibModalInstance.close();
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss("cancel");
        };

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

        $scope.deleteUser = function (password) {
          $scope.User.delete(password, function (message) {
            $scope.showSuccessMessage = true;
            $scope.message = message;
            $timeout(function () {
              $location.url("/");
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

        $scope.updateEmail = function (email) {
          $scope.User.updateEmail(email, function (message) {
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

        $scope.updateImage = function (image) {
          $scope.User.updateImage(image, function (message) {
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

        $scope.updatePassword = function (oldPassword, newPassword) {
          $scope.User.updatePassword(oldPassword, newPassword, function (message) {
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

  $scope.openEvent = function (size, view) {
    var modalInstance = $uibModal.open({
      animation: true,
      controller: function ($http, $scope, $timeout, $uibModalInstance, Events, Existing, Form, User) {

        $scope.Events = Events;
        $scope.Existing = Existing;
        $scope.Form = Form;
        $scope.User = User;

        $scope.ok = function () {
          $uibModalInstance.close();
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss("cancel");
        };
      },
      size: size,
      templateUrl: view
    });
  };
});
