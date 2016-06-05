angular.module("Factories").factory("User", function ($http, $location, Existing) {

  var user = null;

  $http.get("/DigiDay/php/routes/user.php/me")
  .success(function (data, status, headers, config) {
    if (data.logged) {
      user = data.user;
    }
  })
  .error(function (data, status, headers, config) {
  });

  return {
    create: function (newUser, successCallback, errorCallback) {
      $http.post("/DigiDay/php/routes/user.php/create", {user: newUser})
      .success(function (data, status, headers, config) {
        if (data.created) {
          user = data.user;
          Existing.addFresher(user.fresher);
          Existing.addEmail(user.email);
          successCallback(data.message);
        } else {
          errorCallback(data.message);
        }
      })
      .error(function (data, status, headers, config) {
        errorCallback(data.message);
      });
    },

    updateEmail: function (email, successCallback, errorCallback) {
      $http.post("/DigiDay/php/routes/user.php/email", {email: email})
      .success(function (data, status, headers, config) {
        if (data.changed) {
          Existing.removeEmail(user.email);
          user.email = email;
          Existing.addEmail(user.email);
          successCallback(data.message);
        } else {
          errorCallback(data.message);
        }
      })
      .error(function (data, status, headers, config) {
        errorCallback(data.message);
      });
    },

    updateImage: function (image, successCallback, errorCallback) {
      $http.post("/DigiDay/php/routes/user.php/image", {image: image})
      .success(function (data, status, headers, config) {
        if (data.changed) {
          user.image = image;
          successCallback(data.message);
        } else {
          errorCallback(data.message);
        }
      })
      .error(function (data, status, headers, config) {
        errorCallback(data.message);
      });
    },

    updatePassword: function (oldPassword, newPassword, successCallback, errorCallback) {
      $http.post("/DigiDay/php/routes/user.php/password", {oldPassword: oldPassword, newPassword: newPassword})
      .success(function (data, status, headers, config) {
        if (data.changed) {
          successCallback(data.message);
        } else {
          errorCallback(data.message);
        }
      })
      .error(function (data, status, headers, config) {
        errorCallback(data.message);
      });
    },

    delete: function (password, successCallback, errorCallback) {
      $http.post("/DigiDay/php/routes/user.php/delete", {password: password})
      .success(function (data, status, headers, config) {
        if (data.deleted) {
          Existing.removeFresher(user.fresher);
          Existing.removeEmail(user.email);
          user = null;
          $location.path("/");
          successCallback(data.message);
        } else {
          errorCallback(data.message);
        }
      })
      .error(function (data, status, headers, config) {
        errorCallback(data.message);
      });
    },

    login: function (fresher, password, successCallback, errorCallback) {
      $http.post("/DigiDay/php/routes/user.php/login", {fresher: fresher, password: password})
      .success(function (data, status, headers, config) {
        if (data.logged) {
          user = data.user;
          successCallback(data.message);
        } else {
          errorCallback(data.message);
        }
      })
      .error(function (data, status, headers, config) {
        errorCallback(data.message);
      });
    },

    logout: function () {
      $http.get("/DigiDay/php/routes/user.php/logout")
      .success(function (data, status, headers, config) {
        user = null;
        $location.path("/");
      })
      .error(function (data, status, headers, config) {
      });
    },

    isAdministrator: function () {
      if (user) {
        if (user.administrator == 1) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    isAuthenticated: function () {
      if (user) {
        return true;
      } else {
        return false;
      }
    },

    getUser: function () {
      return user;
    }
  };

});
