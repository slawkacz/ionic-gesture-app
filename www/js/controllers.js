angular.module('gestureApp.controllers', []).controller('PhotosCtrl', function(Photos, $scope) {
    $scope.photos = [];
    $scope.photo;
    Photos.getPhotos().then(function(images) {
        $scope.photos = images;
        $scope.photo = $scope.photos[0];
    });
    $scope.onSwipeUp = function() {
        Photos.rate($scope.photo.image.src, 1);
    };
    $scope.onSwipeDown = function() {
        Photos.rate($scope.photo.image.src, -1);
    };
});