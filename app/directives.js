'use strict';

/* Directives */

angular.module('exercise.directives', []).
    directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])
    .directive('exerciseList', [function () {
        function link(scope, element, attrs) {
//            console.log(scope, element, attrs);
            scope.getJsDate = function (theDate) {
                if (typeof theDate === 'string') {
                    var t = theDate.split(/[- :TZ]/);
                    //when t[3], t[4] and t[5] are missing they defaults to zero
                    return new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
                }
            }

            scope.showDetails = false;
        }

        return {
            restrict: "E",
            link: link,
            scope: {
                exercise: '='
            },
            templateUrl: '/views/directive-exercise-list.html',
            replace: true
        }
    }])
    .directive('accountHolders', ['$location', function ($location) {
        function link(scope, element, attrs) {
            scope.go = function (id) {
                var thePath = '/users/' + id;
                $location.path(thePath);
            }
        }

        return {
            restrict: "E",
            link: link,
            scope: {
                account: '='
            },
            templateUrl: '/views/directive-accountHolders.html',
            replace: true
        }

    }])
    .directive('menuActive', function ($location) {
        function link(scope, element, attrs) {
//            console.log(scope,element,attrs);
            var checkActive = function () {
                var anchor = element.find('a')[0];
                element.removeClass('active');
                if (anchor.href == $location.absUrl()) {
                    element.addClass('active');
                }
            }
            checkActive();
            scope.$on('$locationChangeSuccess', function () {
                checkActive();
            })
        }

        return {
            restrict: "A",
            link: link,
            scope: true
        }
    })
;
