angular.module('gestureApp.services', []).factory('Photos', function($http, API_URL) {
    return {
        getPhotos: function() {
            return $http.get(API_URL + '&kimlimit=:limit&kimoffset=:offset');
        }
    }
});