angular.module('gestureApp.controllers', []).controller('PhotosCtrl', function(Photos, $scope, $cordovaToast,$q) {
    $scope.photos = [];
    $scope.photo;
    var setPhotoOnStage = function() {
        var defer = $q.defer();
        Photos.getPhotos().then(function(images) {
            $scope.photos = images;
            $scope.photo = $scope.photos[0];
            defer.resolve();
        });
        return defer.promise;
    };
    var throwToast = function(rate) {
        $cordovaToast.show('You added '+rate, 'short', 'center').then(function(success) {
            console.log('success')
            // success
        }, function(error) {
            console.log('success')
            // error
        });
    }
    $scope.onSwipeUp = function() {
        Photos.rate($scope.photo.image.src, 1).then(setPhotoOnStage).then(throwToast.bind(this,"plus"));
    };
    $scope.onSwipeDown = function() {
        Photos.rate($scope.photo.image.src, -1).then(setPhotoOnStage).then(throwToast.bind(this,"minus"));
    };
    setPhotoOnStage();

});