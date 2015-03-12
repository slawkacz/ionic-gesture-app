angular.module('gestureApp').factory('httpInterceptor', function ($q, $rootScope, $log) {
        var numLoadings = 0;
        return {
            request: function (config) {
                numLoadings++;
                $rootScope.$broadcast('loading:show');
                return config || $q.when(config)
            },
            response: function (response) {
                if ((--numLoadings) === 0) {
                    $rootScope.$broadcast('loading:hide');
                }
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (!(--numLoadings)) {
                    $rootScope.$broadcast('loading:hide');
                }
                return $q.reject(response);
            }
        };
    }).config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    })