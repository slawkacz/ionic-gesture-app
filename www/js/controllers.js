angular.module('gestureApp.controllers', []).controller('PhotosCtrl', function(Photos, $scope) {
    $scope.photos = [];
    $scope.photo;
    Photos.getPhotos().then(function(images) {
        $scope.photos = images;
        $scope.photo = $scope.photos[0];
    });
    $scope.onSwipeLeft = function(){
    	console.log('left')
    };
    $scope.onSwipeRight = function(){
    	console.log('right')
    };
});