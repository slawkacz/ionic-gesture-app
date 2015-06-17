angular.module('gestureApp.controllers', []).controller('MainController', function ($scope, $ionicSideMenuDelegate) {
    $scope.showMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    }
    $scope.hideMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    }
}).controller('PhotosCtrl', function(Photos, $scope, $ionicLoading, $cordovaToast, $cordovaVibration, $q, $ionicSideMenuDelegate) {
    $scope.photos = [];
    $scope.photo;
    var setPhotoOnStage = function() {
        var defer = $q.defer();
        Photos.getPhotos().then(function(images) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>'
            })
            var img = new Image();
            img.onload = function() {
                $ionicLoading.hide();
                $scope.photos = images;
                $scope.photo = $scope.photos[0];
                defer.resolve();
                $scope.$digest();
            }
            img.src = images[0].image.src;
        });
        return defer.promise;
    };
    var throwToast = function(rate) {
        $cordovaVibration.vibrate(100);
        $cordovaToast.show('You added ' + rate, 'short', 'top').then(function(success) {
            // console.log('success')
            // success
        }, function(error) {
            // console.log('error')
            // error
        });
    }
    $scope.onSwipeUp = function() {
        Photos.rate($scope.photo.image.src, 1).then(throwToast.bind(this, "plus")).then(setPhotoOnStage).then(setPhotoOnStage);
    };
    $scope.onSwipeDown = function() {
        Photos.rate($scope.photo.image.src, -1).then(throwToast.bind(this, "minus")).then(setPhotoOnStage);
    };
    setPhotoOnStage();
}).controller('RatedCtrl',function(Photos,$scope){
    $scope.test = "dasdas";
});