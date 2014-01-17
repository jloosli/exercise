'use strict';

/* Filters */

angular.module('exercise.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
    .filter('getById', function() {
        return function(input, id) {
            var i= 0, len=input.length;
            for(;i<len;i++) {
                if(input[i].id==id) {
                    return input[i];
                }
            }
            return null;
        }
    })
    .filter('toJSDate', function () {
        return function(theDate) {
            if(typeof theDate === 'string')
            {
                var t = theDate.split(/[- :]/);

                //when t[3], t[4] and t[5] are missing they defaults to zero
                return new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
            }
            return null;
        }
    })
    .filter('getNonZero',function() {
        return function (items) {
            var newItems = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].balance != 0) {
                    newItems.push(items[i]);
                }
            };

            return newItems;
        }
    })
    .filter('notId', function() {
        return function (items, id) {
            var newItems = [];
            angular.forEach(items, function(item) {
                if(item.id != id) {
                    newItems.push(item);
                }
            }, newItems);
            return newItems;
        }
    })
;
