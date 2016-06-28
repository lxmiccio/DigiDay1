angular.module("Factories").factory("Existing", function ($http) {

  var existing = {
    emails: [],
    freshers: [],
    classrooms: [],
    items: [],
    topics: [],
    allTopics: []
  };

  var refreshEmails = function() {
    $http.get("/DigiDay/php/routes/get.php/emails")
    .success(function (data, status, headers, config) {
      if (data.successful) {
        existing.emails.length = 0;
        if (angular.isArray(data.emails)) {
          data.emails.forEach(function (entry) {
            existing.emails.push(entry);
          });
        }
      } else {
        console.log(data);
      }
    })
    .error(function (data, status, headers, config) {
      console.log(data);
    });
  };

  var refreshFreshers = function() {
    $http.get("/DigiDay/php/routes/get.php/freshers")
    .success(function (data, status, headers, config) {
      if (data.successful) {
        existing.freshers.length = 0;
        if (angular.isArray(data.freshers)) {
          data.freshers.forEach(function (entry) {
            existing.freshers.push(entry);
          });
        }
      } else {
        console.log(data);
      }
    })
    .error(function (data, status, headers, config) {
      console.log(data);
    });
  };

  var refreshClassrooms = function () {
    $http.get("/DigiDay/php/routes/get.php/classrooms")
    .success(function (data, status, headers, config) {
      if (data.successful) {
        existing.classrooms.length = 0;
        if (angular.isArray(data.classrooms)) {
          data.classrooms.forEach(function (entry) {
            existing.classrooms.push(entry);
          });
        }
      } else {
        console.log(data);
      }
    })
    .error(function (data, status, headers, config) {
      console.log(data);
    });
  }

  var refreshItems = function () {
    $http.get("/DigiDay/php/routes/get.php/items")
    .success(function (data, status, headers, config) {
      if (data.successful) {
        existing.items.length = 0;
        if (angular.isArray(data.items)) {
          data.items.forEach(function (entry) {
            entry.available = entry.amount;
            if (angular.isArray(entry.events)) {
              entry.events.forEach(function(entry1) {
                entry.available -= entry1.requiredAmount;
              });
            }
            existing.items.push(entry);
          });
        }
      } else {
        console.log(data)
      }
    })
    .error(function (data, status, headers, config) {
      console.log(data);
    });
  };

  var refreshTopics = function () {
    $http.get("/DigiDay/php/routes/get.php/topics")
    .success(function (data, status, headers, config) {
      if (data.successful) {
        existing.topics.length = 0;
        if (angular.isArray(data.topics)) {
          data.topics.forEach(function (entry) {
            existing.topics.push(entry);
          });
        }
      } else {
        console.log(data);
      }
    })
    .error(function (data, status, headers, config) {
      console.log(data);
    });
  };

  var refreshAllTopics = function () {
    $http.get("/DigiDay/php/routes/get.php/topics")
    .success(function (data, status, headers, config) {
      if (data.successful) {
        existing.allTopics.length = 0;
        existing.allTopics.push({
          id: 0,
          scope: "Tutti"
        });
        if (angular.isArray(data.topics)) {
          data.topics.forEach(function (entry) {
            existing.allTopics.push(entry);
          });
        }
      } else {
        console.log(data);
      }
    })
    .error(function (data, status, headers, config) {
      console.log(data);
    });
  };

  refreshEmails();
  refreshFreshers();
  refreshClassrooms();
  refreshItems();
  refreshTopics();
  refreshAllTopics();

  return {
    existing: existing,

    addEmail: function (email) {
      existing.emails.push(email);
    },

    removeEmail: function (email) {
      var splice;
      if (angular.isArray(existing.emails)) {
        existing.emails.forEach(function (entry, index) {
          if (entry.toString().toUpperCase() == email.toString().toUpperCase()) {
            splice = index;
          }
        });
      }
      existing.emails.splice(splice, 1);
    },

    refreshEmails: refreshEmails,


    addFresher: function (fresher) {
      existing.freshers.push(fresher);
    },

    removeFresher: function (fresher) {
      var splice;
      if (angular.isArray(existing.freshers)) {
        existing.freshers.forEach(function (entry, index) {
          if (entry.toString().toUpperCase() == fresher.toString().toUpperCase()) {
            splice = index;
          }
        });
      }
      existing.freshers.splice(splice, 1);
    },

    refreshFreshers: refreshFreshers,


    addClassroom: function (classroom) {
      existing.classrooms.push(classrooms);
    },

    removeClassroom: function (id) {
      var splice;
      if (angular.isArray(existing.classrooms)) {
        existing.classrooms.forEach(function (entry, index) {
          if (entry.id.toString().toUpperCase() == id.toString().toUpperCase()) {
            splice = index;
          }
        });
      }
      existing.emails.splice(splice, 1);
    },

    refreshClassrooms: refreshClassrooms,


    addItem: function (item) {
      existing.items.push(items);
    },

    removeItem: function (id) {
      var splice;
      if (angular.isArray(existing.items)) {
        existing.items.forEach(function (entry, index) {
          if (entry.id.toString().toUpperCase() == id.toString().toUpperCase()) {
            splice = index;
          }
        });
      }
      existing.items.splice(splice, 1);
    },

    refreshItems: refreshItems,


    addTopic: function (topic) {
      existing.topic.push(topic);
    },

    removeTopic: function (id) {
      var splice;
      if (angular.isArray(existing.topics)) {
        existing.topics.forEach(function (entry, index) {
          if (entry.id.toString().toUpperCase() == id.toString().toUpperCase()) {
            splice = index;
          }
        });
      }
      existing.topics.splice(splice, 1);
    },

    refreshTopics: refreshTopics
  };

});
