angular.module("Factories").factory("Utility", function () {

  return {
    stringToDate: function (string) {
      var date = new Date(string);
      date.setDate(date.getDate());
      return date;
    }
  };

});
