angular.module("Filters").filter("available", function () {
  return function (objects, startingDate, endingDate) {
    if (angular.isArray(objects)) {
      var array = [];
      objects.forEach(function (entry) {
        if (entry.events == null) {
          array.push(entry);
        } else {
          var free = true;
          entry.events.forEach(function (event) {
            if ((!(startingDate < event.startingDate)) && (!(startingDate > event.endingDate))
            || (!(event.startingDate < startingDate)) && (!(event.startingDate > endingDate))
            || (!(endingDate < event.startingDate)) && (!(endingDate > event.endingDate))
            || (!(event.endingDate < startingDate)) && (!(event.endingDate > endingDate))) {
              free = false;
            }
          });
          if (free) {
            array.push(entry);
          }
        }
      });
      return array;
    } else {
      return objects;
    }
  };
});
