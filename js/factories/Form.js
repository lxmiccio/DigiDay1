angular.module("Factories").factory("Form", function (Existing) {

  return {
    isExistingEmail: function (email) {
      var bool = false;
      if (email) {
        if(angular.isArray(Existing.existing.emails)) {
          Existing.existing.emails.forEach(function (entry) {
            if (entry.toUpperCase() == email.toUpperCase()) {
              bool = true;
            }
          });
        }
      }
      return bool;
    },

    isInvalidEmail: function (email) {
      var bool = true;
      if (email) {
        if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
          bool = false;
        }
      }
      return bool;
    },

    isExistingFresher: function (fresher) {
      var bool = false;
      if (fresher) {
        if(angular.isArray(Existing.existing.freshers)) {
          Existing.existing.freshers.forEach(function (entry) {
            if (entry.toUpperCase() == fresher.toUpperCase()) {
              bool = true;
            }
          });
        }
      }
      return bool;
    },

    isNewFresher: function (fresher) {
      var bool = true;
      if (fresher) {
          if(angular.isArray(Existing.existing.freshers)) {
          Existing.existing.freshers.forEach(function (entry) {
            if (entry.toUpperCase() === fresher.toUpperCase()) {
              bool = false;
            }
          });
        }
      }
      return bool;
    },

    isExistingClassroom: function (classroom) {
      var bool = false;
      if (classroom && classroom.name) {
        if(angular.isArray(Existing.existing.classrooms))
        Existing.existing.classrooms.forEach(function (entry) {
          if (entry.id.toUpperCase() == classroom.id.toUpperCase()) {
            bool = true;
          }
        });
      }
      return bool;
    },

    isInvalidCapacity: function (classroom) {
      var bool = true;
      if (classroom && classroom.capacity) {
        if (classroom.capacity.match(/^[0-9]+$/)) {
          if (classroom.capacity >= 10 && classroom.capacity <= 50) {
            bool = false;
          }
        }
      }
      return bool;
    },

    isInvalidNumber: function (max, number) {
      var bool = true;
      if (max) {
        if (number) {
          if (number > 0) {
            if (number.toString().match(/^[0-9]+$/)) {
              if (parseInt(number) <= parseInt(max)) {
                bool = false;
              }
            }
          }
        }
      }
      return bool;
    },
  };

});
