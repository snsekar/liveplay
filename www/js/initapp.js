function include_initappjs($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, $ionicSideMenuDelegate, $ionicTabsDelegate,$ionicScrollDelegate,$ionicSlideBoxDelegate,$http){
$scope.initApp = function() {

        $scope.youOnline = false;
        $scope.partnerOnline = false;
        $scope.showHideYou = true;
        $scope.showHidePartner = false;
        $scope.showHideChat = false;

        $scope.youCount = 0;
        $scope.partnerCount = 0;


        $scope.tog = 1;
        $scope.songs = [];
        $scope.partnersongs = [];
        $scope.selectedSong = 'Please select song';
        $scope.selectedSongPath = ' ';
        $scope.duplicateID = false;

        $scope.chat = {};
        $scope.chat.data = {};
        $scope.chat.myId = $scope.you;
        $scope.chat.messages = [];

        $scope.isBuffering = false;
        $scope.partnerReq = {};
        $scope.partnerReq.search = {};
        $scope.isCallInprogress = false;

        // alert();
        if (localStorage['myid']) {
            myid = localStorage['myid'];
            chatmessages = localStorage['chatmessages'];
            console.log("chatmessages = "+JSON.stringify(chatmessages));

            if(chatmessages != undefined && chatmessages != null){
              $scope.chat.messages = JSON.parse(chatmessages);
            }
            $scope.loginData.user_id = myid;
            $scope.doLogin();

        } else {
            $scope.login();
        }
        $scope.$digest();
    }
}
