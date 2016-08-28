function include_tabselectedjs($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, $ionicSideMenuDelegate, $ionicTabsDelegate,$ionicScrollDelegate,$ionicSlideBoxDelegate,$http){

$scope.selectTabWithIndex = function(index) {
  if(index == 1 && partnerid == undefined){
    $scope.partnerReq = {};
    var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/";
    url = url + myid;

    $http.get(url).success(function(response, status, headers, config){
      if(response.Count != 0){

        var partnerReq = response.Items[0].partner_request_id;
        if(partnerReq == undefined || partnerReq.S == "null"){
          $scope.partnerReq.isPartnerRequest = false;
        }else{
          $scope.partnerReq.isPartnerRequest = true;
          var senderReceiver = partnerReq.S.split(" ")[0];
          var partnerReqId = partnerReq.S.split(" ")[1];
          if(senderReceiver == "sender")
          {
            $scope.partnerReq.isPartnerRequestSender = true;
          }
          if(senderReceiver == "receiver"){
            $scope.partnerReq.isPartnerRequestReceiver = true;
          }
          var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/";
          url = url +partnerReqId;

          $http.get(url).success(function(response, status, headers, config){
            if(response.Count != 0){
              $scope.partnerReq.user_id = partnerReqId;
              $scope.partnerReq.user_name = response.Items[0].display_name.S;
              $scope.partnerReq.user_profile_picture = response.Items[0].profile_picture.S;
            }else{
              console.log("User not exists");
            }
        }).error(function(err, status, headers, config){
             console.log("Error occured while login.")
        });
        }

      }else{
          console.log("User not exists");
      }
  }).error(function(err, status, headers, config){
       console.log("Error occured while login.")
  });
  }
  $ionicTabsDelegate.select(index);
}
}
