angular.module('gestureApp.services', []).factory('Photos', function($http, API_URL, $q) {
    return {
        getPhotos: function() {
            var deffered = $q.defer();
            $http.get(API_URL + '&kimlimit=100&kimoffset=0').then(function(res) {
                deffered.resolve(res.data.results.Images);
            }, deffered.reject);
            return deffered.promise;
        }
    }
});