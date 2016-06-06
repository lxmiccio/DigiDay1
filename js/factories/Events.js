angular.module("Factories").factory("Events", function ($http, User) {

  var calendar = {
    events: [],
    filteredEvents: []
  };

  var refresh = function() {
    $http.get("/DigiDay/php/routes/event.php/events")
    .success(function (data, status, headers, config) {
      calendar.events.length = 0;
      calendar.filteredEvents.length = 0;
      if (angular.isArray(data.events)) {
        data.events.forEach(function (entry) {
          entry.startsAt = new Date(entry.startsAt);
          entry.endsAt = new Date(entry.endsAt);
          entry.type = "info";
          if(User.getUser() && User.getUser().fresher) {
            if(entry.creator.fresher == User.getUser().fresher) {
              entry.type = "important";
            } else if(angular.isArray(entry.partecipants)) {
              entry.partecipants.forEach(function(partecipant) {
                if(partecipant.id == User.getUser().fresher) {
                  entry.type = "warning";
                }
              });
            }
          }
          calendar.events.push(entry);
          calendar.filteredEvents.push(entry);
        });
      }
    })
    .error(function (data, status, headers, config) {
      console.log(data);
    });
  }

  return {
    calendar: calendar,

    create: function (event, successCallback, errorCallback) {
      $http.post("/DigiDay/php/routes/event.php/create", {event: event})
      .success(function (data, status, headers, config) {
        if (data.created) {
          refresh();
          successCallback(data.message);
        } else {
          errorCallback(data.message);
        }
      })
      .error(function (data, status, headers, config) {
        errorCallback(data.message);
      });
    },

    delete: function (id) {
      $http.post("/DigiDay/php/routes/event.php/delete", {id: id})
      .success(function (data, status, headers, config) {
        if (data.deleted) {
          refresh();
        } else {
          console.log(data);
        }
      })
      .error(function (data, status, headers, config) {
        console.log(data);
      });
    },

    refresh: refresh,

    filter: function (id) {
      calendar.filteredEvents.length = 0;
      if (angular.isArray(calendar.events)) {
        calendar.events.forEach(function (entry) {
          if (id == 0 || entry.topic.id == id) {
            calendar.filteredEvents.push(entry);
          }
        });
      }
    }
  }

});
