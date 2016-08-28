function include_resetappjs($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, $ionicSideMenuDelegate, $ionicTabsDelegate,$ionicScrollDelegate,$ionicSlideBoxDelegate,$http){

$scope.resetUserData = function() {
    localStorage.removeItem('myid');
    localStorage.removeItem('partnerid');
    localStorage.removeItem('songs');
    localStorage.removeItem('partnersongs');
    localStorage.removeItem('chatmessages');
    localStorage.removeItem('gcm_id');



    $scope.you = "";
    $scope.partner = "";
    $scope.youCount = 0;
    $scope.partnerCount = 0;
    $scope.songs = [];
    $scope.partnersongs = [];
    $scope.loginData = {};

  }
}
