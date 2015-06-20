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
            var lastOffset = parseInt($localstorage.get('lastOffset', 0));
            $localstorage.set('lastOffset', lastOffset + offset);
        },
        getUnrated: function() {
            return $localstorage.getObject('unratedPhotos');
        },
        getRated: function() {
            return $localstorage.getObject('ratedPhotos');
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
            Storage.setUnrated(res.data.results.collection1, res.data.results.collection1.length);
            return deffered.resolve(res.data.results.collection1);
        }, deffered.reject);
        return deffered.promise;
    };
    var getRated = function(){
        var deffered = $q.defer();
        var ratedPhotos = Storage.getRated();
        if (ratedPhotos.length) {
            deffered.resolve(ratedPhotos)
        } else {
            deffered.reject('No photos')
        }
        return deffered.promise;
    };
    return {
        getPhotos: function() {
            var deffered = $q.defer();
            getFromStorage().then(deffered.resolve, fetchFromServer).then(deffered.resolve);
            return deffered.promise;
        },
        getRated: getRated,
        rate: function(imgSrc, vote) {
            var deffered = $q.defer();
            deffered.resolve(Storage.rateImage(imgSrc, vote));
            return deffered.promise;
        },
    }
});