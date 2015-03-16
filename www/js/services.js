angular.module('gestureApp.services', [])
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]).factory('Storage',function($window){
	return {
		
	}
})
.factory('Photos', function($http, API_URL, Storage, $q) {
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