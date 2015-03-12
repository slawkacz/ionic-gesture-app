angular.module('gestureApp.controllers',[]).controller('PhotosCtrl',function(Photos,$scope){
	$scope.photos = [];
	Photos.getPhotos().then(function(images){
		$scope.photos = images;
	});
});