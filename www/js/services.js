angular.module('gestureApp.services', []).factory('$localstorage', ['$window',
    function($window) {
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
                return JSON.parse($window.localStorage[key] || "[]");
            }
        }
    }
]).factory('Storage', function($localstorage) {
    return {
        setUnrated: function(Images, offset) {
            $localstorage.setObject('unratedPhotos', Images);
            $localstorage.set('lastOffset', offset);
        },
        getUnrated: function() {
            return $localstorage.getObject('unratedPhotos');
        },
        getLastOffset: function() {
            return $localstorage.get('lastOffset') || 0
        },
        rateImage: function(imgSrc, vote) {
            unrated = this.getUnrated();
            unrated = unrated.filter(function(el) {
                return el.image.src !== imgSrc;
            });
            $localstorage.setObject('unratedPhotos', unrated);
            var rated = $localstorage.getObject('ratedPhotos');
            rated.push({
                image: imgSrc,
                vote: vote
            });
            $localstorage.setObject('ratedPhotos', rated);
            return true;
        }
    }
}).factory('Photos', function($http, API_URL, Storage, $q) {
    var getFromStorage = function() {
        var deffered = $q.defer();
        var unRatedPhotos = Storage.getUnrated();
        if (unRatedPhotos.length) {
            console.log(unRatedPhotos);
            deffered.resolve(unRatedPhotos)
        } else {
            var lastOffset = Storage.getLastOffset();
            deffered.reject(lastOffset)
        }
        return deffered.promise;
    };
    var fetchFromServer = function(offset) {
        var deffered = $q.defer();
        $http.get(API_URL + '&kimlimit=5&kimoffset=' + offset).then(function(res) {
            Storage.setUnrated(res.data.results.Images, res.data.results.Images.length)
            deffered.resolve(res.data.results.Images);
        }, deffered.reject);
        return deffered.promise;
    };
    return {
        getPhotos: function() {
            var deffered = $q.defer();
            getFromStorage().then(deffered.resolve, fetchFromServer);
            return deffered.promise;
        },
        rate: function(imgSrc, vote) {
           var deffered = $q.defer();
           deffered.resolve(Storage.rateImage(imgSrc, vote));
           return deffered.promise;
        },
    }
});