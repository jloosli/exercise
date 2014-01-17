'use strict';

/* Controllers */

angular.module('exercise.controllers', []).
    controller('listCtrl', ['$scope','Restangular', function ($scope, Restangular) {
        $scope.addAccount = function () {
            var newAccount = {
                name: "New Employee",
                score: 0,
                edit: true
            }
            console.log('adding',newAccount);
            $scope.accountHolders.$object.push(newAccount);
        }
        $scope.$watch('$scope.accountHolders.$object', function() {
            $scope.raw = JSON.stringify(Restangular.stripRestangular($scope.accountHolders.$object), null, "\t");
        });
        $scope.accountHolders.then(function () {
            $scope.raw = JSON.stringify(Restangular.stripRestangular($scope.accountHolders.$object), null, "\t");
        });


    }])
    .controller('userCtrl', ['$scope', '$routeParams', 'Restangular','apiKey',
        function ($scope, $routeParams, Restangular, apiKey) {
            $scope.accountHolders.then(function () {
                $scope.user = $scope.getUser($routeParams.userId);
            });

            $scope.getPoints = function (exercise) {
                var points = 0;
                if (exercise.type && typeof exercise.type != 'undefined') {
                    if (exercise.type == 'weights') {
                        points = (exercise.weight || 0) * (exercise.reps || 0) / 100;
                    } else {
                        points = exercise.duration || 0;
                    }
                }
                return points;
            }

            $scope.$watchCollection('exercise', function (oldVal, newVal, scope) {
                if (newVal && newVal.type) {
                    var newPoints = scope.getPoints(newVal);
                    if (newVal.points != newPoints) {
                        scope.exercise.points = newPoints;
                    }
                }
            });

            $scope.submitExercise = function () {
                var ex = $scope.exercise;
                if (!ex.type) {
                    $scope.addAlert({
                        msg: "Exercise type needs to be selected",
                        type: 'danger'
                    });
                    return
                }
                var toSave = $scope.exercise;
                if (ex.type == 'weights') {
                    delete toSave['duration'];
                } else if (ex.type == 'cardio') {
                    delete toSave['weight'];
                    delete toSave['reps'];
                }
                var theData = JSON.stringify({
                    $push:{exercises: toSave},
                    $inc:{points: toSave.points}
                });
                Restangular.all('employees').one($scope.user._id.$oid).customPUT(theData ,null, {apiKey: apiKey}).then(function (results) {
                    $scope.user.exercises = results.exercises;
                    $scope.user.points = results.points;
                    resetForm();
                });
            }
            function resetForm() {
                var today = new Date();
                $scope.exercise = {
                    date: today.toISOString().split("T")[0]
                }
            }
            resetForm();

        }])
    .controller('menuCtrl', ['$scope', '$location', function ($scope, $location) {
    }])
    .controller('mainCtrl', ['$scope', '$filter', '$timeout', 'Restangular', function ($scope, $filter, $timeout, Restangular) {
        $scope.accountHolders = Restangular.all('employees').getList();
        $scope.getUser = function (id) {
            return _.find($scope.accountHolders.$object, {'_id': {'$oid': id}});
        }
        $scope.otherUsers = function (id) {
            return _.find($scope.accountHolders.$object, function (user) {
                return user._id.$oid != id;
            });
        }

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
        $scope.clearAlerts = function () {
            $scope.alerts = [];
        }
        $scope.alerts = [];

        $scope.addAlert = function (settings) {
            // Add an alert with an automatic close delay. Format:
            // {msg: theMessage, type: bootstrapcssType (warning|info|etc.), delay: (optional) delay to close in ms}
            settings.guid = $scope.guid();
            if (settings.delay && settings.delay > 0) {
                $timeout(function () {
                    $scope.removeAlert(settings.guid);
                }, settings.delay);
            }
            $scope.alerts.push(settings);
            return settings.guid;
        }

        $scope.removeAlert = function (guid) {
            var alerts = [];
            angular.forEach($scope.alerts, function (alert, index) {
                if (alert.guid && alert.guid == guid) {
                    $scope.alerts.splice(index, 1);
                } else {
                    alerts.push(alert);
                }
            }, alerts);
            $scope.alerts = alerts;
        }

        $scope.guid = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

    }])
;