angular.module("Filters").filter("partecipants", function () {
    return function (partecipants) {
        if (angular.isArray(partecipants)) {
            var array = [];
            partecipants.forEach(function (entry, index) {
                entry.lowerFirstName = entry.firstName.toLowerCase();
                array.push(entry);
            });
            return array;
        } else {
            return partecipants;
        }
    };
});
