'use strict';

// Declare app level module which depends on filters, and services
var exerciseApp = angular.module('exercise', [
        'ngRoute',
        'ngSanitize',
        'ui.bootstrap',
        'exercise.filters',
        'exercise.services',
        'exercise.directives',
        'exercise.controllers',
        'restangular'
    ])
    .constant('apiKey', 'e9NXK383eWO0u5FL47qWMa6x4MYqMhJ-')
    .config(function(RestangularProvider, apiKey) {
        RestangularProvider.setBaseUrl(
            'https://api.mongolab.com/api/1/databases/exercise/collections');
        RestangularProvider.setDefaultRequestParams({
            apiKey: apiKey
        });
        RestangularProvider.setRestangularFields({
            id: "_id.$oids"
        });
        RestangularProvider.setRequestInterceptor(
            function(elem, operation, what) {
                if (operation === 'put') {
                    elem._id = undefined;
                    return elem;
                }
                return elem;
            });
    })
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/users', {
            templateUrl: 'views/list.html',
            controller: 'listCtrl'
        });
        $routeProvider.when('/users/:userId', {
            templateUrl: 'views/user.html',
            controller: 'userCtrl'
        });
        $routeProvider.otherwise({redirectTo: '/users'});
    }]);
