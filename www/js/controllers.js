angular.module('gestureApp.controllers', []).controller('MainController', function($scope, $ionicSideMenuDelegate) {
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
            });
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
        var msg = 'You like it! Cool!';
        if (!rate) msg = 'That\'s wierd! I don\t like it!';
        $cordovaToast.show(msg, 'short', 'top');
    }
    $scope.onSwipeUp = function() {
        Photos.rate($scope.photo.image.src, 1).then(throwToast.bind(this, true)).then(setPhotoOnStage);
    };
    $scope.onSwipeDown = function() {
        Photos.rate($scope.photo.image.src, -1).then(throwToast.bind(this, false)).then(setPhotoOnStage);
    };
    setPhotoOnStage();
}).controller('RatedCtrl', function(Photos, $ionicLoading, $scope) {
   console.log('herer')
    $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
    });
    $scope.photos = [];
    Photos.getRated().then(function(images) {
        $scope.photos = images;
        $ionicLoading.hide();
    }).catch(function(e){
        $ionicLoading.hide();
    });
});