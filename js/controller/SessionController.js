angular.module("SessionMdl", [])

        .controller("SessionCtrl", function ($http, $scope, $uibModal, Form, User) {

            var vm = this;

            vm.Form = Form;
            vm.User = User;

            $scope.openSession = function (view) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    controller: function ($http, $scope, $timeout, $uibModalInstance, $window, Form, User, classrooms, items, topics) {

                        $scope.ok = function () {
                            $uibModalInstance.close();
                        };

                        $scope.cancel = function () {
                            $uibModalInstance.dismiss("cancel");
                        };

                        $scope.Form = Form;
                        $scope.User = User;
                    },
                    resolve: {
                        classrooms: function () {
                            return vm.classrooms;
                        },
                        items: function () {
                            return vm.items;
                        },
                        topics: function () {
                            return vm.topics;
                        },
                        create: function () {
                            return vm.create();
                        }
                    },
                    size: "lg",
                    templateUrl: view
                });
            };

            vm.classrooms = [];

            vm.getClassrooms = function () {
                $http.get("/DigiDay/php/router.php/classrooms")
                        .success(function (data, status, headers, config) {
                            if (Array.isArray(data.classrooms)) {
                                data.classrooms.forEach(function (entry) {
                                    vm.classrooms.push(entry);
                                });
                            }
                        })
                        .error(function (data, status, headers, config) {
                            console.log(data);
                        });
            };

            vm.getClassrooms();

            vm.items = [];

            vm.getItems = function () {
                $http.get("/DigiDay/php/router.php/items")
                        .success(function (data, status, headers, config) {
                            if (Array.isArray(data.items)) {
                                data.items.forEach(function (entry) {
                                    vm.items.push(entry);
                                });
                            }
                        })
                        .error(function (data, status, headers, config) {
                            console.log(data);
                        });
            };

            vm.getItems();

            vm.topics = [];

            vm.getTopics = function () {
                $http.get("/DigiDay/php/router.php/topics")
                        .success(function (data, status, headers, config) {
                            if (Array.isArray(data.topics)) {
                                data.topics.forEach(function (entry) {
                                    vm.topics.push(entry);
                                });
                            }
                        })
                        .error(function (data, status, headers, config) {
                            console.log(data);
                        });
            };

            vm.getTopics();

            vm.create = function (session) {
                console.log(session);
                $http.post("/DigiDay/php/router.php/session/create", {session: session})
                        .success(function (data, status, headers, config) {
                            if (data.error) {
                                console.log(data);
                            } else {
                                console.log(data);
                            }
                        })
                        .error(function (data, status, headers, config) {
                            console.log(data);
                        });
            };
        })

        .filter("availableClassrooms", function () {
            return function (classrooms, startingDate, endingDate) {
                if (angular.isArray(classrooms)) {
                    var array = [];
                    classrooms.forEach(function (entry) {
                        if (entry.sessions === null) {
                            array.push(entry);
                        } else {
                            var free = true;
                            entry.sessions.forEach(function (session) {
                                if ((!(startingDate < session.startingDate)) && (!(startingDate > session.endingDate))
                                        || (!(session.startingDate < startingDate)) && (!(session.startingDate > endingDate))
                                        || (!(endingDate < session.startingDate)) && (!(endingDate > session.endingDate))
                                        || (!(session.endingDate < startingDate)) && (!(session.endingDate > endingDate))) {
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
                    return classrooms;
                }
            };
        })

        .filter("availableItems", function () {
            return function (items, startingDate, endingDate) {
                if (angular.isArray(items)) {
                    var array = [];
                    items.forEach(function (entry) {
                        if (entry.sessions === null) {
                            array.push(entry);
                        } else {
                            var free = true;
                            entry.sessions.forEach(function (session) {
                                if ((!(startingDate < session.startingDate)) && (!(startingDate > session.endingDate))
                                        || (!(session.startingDate < startingDate)) && (!(session.startingDate > endingDate))
                                        || (!(endingDate < session.startingDate)) && (!(endingDate > session.endingDate))
                                        || (!(session.endingDate < startingDate)) && (!(session.endingDate > endingDate))) {
                                    free = false;
                                }
                            });
                            if (free) {
                                array.push(entry);
                            }
                        }
                    });
                    console.log(array)
                    return array;
                } else {
                    return items;
                }
            };
        });