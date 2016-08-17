PeerStream.onError(function(err){
 console.log(JSON.stringify(err.type));
 if (err.type == 'unavailable-id') {
     $scope.duplicateID = true;
     $scope.$digest();
 }
 if (err.type == 'network') {
     $scope.youOnline = false;
     $scope.partnerOnline = false;
     $scope.$digest();
 }
});
function createConnection() {
  var randomId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
    //get partner id
    var c_partner_id = "";
    if(partnerid == undefined || partnerid == null || partnerid == ""){
      c_partner_id = 'nullpartner';
    }else{
      c_partner_id = partnerid;
    }
    var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/";
    url = url +c_partner_id;
    $http.get(url).success(function(response, status, headers, config){
      var partner_peerjs_id = "nullpeerjsid";
      if(response.Count != 0){
         partner_peerjs_id = response.Items[0].peerjs_id.S;
      }else{
        console.log("User not exists");
      }
      PeerStream.connect(randomId, partner_peerjs_id, "audio_player","audio_call");

  }).error(function(err, status, headers, config){
       console.log("Error occured while login.")
  });

}
PeerStream.onConnected(function(id){
  //update peerjsid
  var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/update_peerjsid";
  var payload = {
    "user_id": myid,
    "peerjs_id": id
  };
  $http.put(url,payload).success(function(response, status, headers, config){
      console.log('connected');
      $scope.you = myid;
      $scope.partner = partnerid;
      $scope.duplicateID = false;
      $scope.youOnline = true;
      if ($ionicSideMenuDelegate.isOpen()) {
          $ionicSideMenuDelegate.toggleLeft();
      }
      $scope.$digest();
      if ($scope.duplicateID == false) {
          $scope.closeLogin();
          $scope.loadSongs();
      }
  }).error(function(err, status, headers, config){
         console.log("Error occured while updating peerjs_id.");
});


})
PeerStream.onDisconnected(function(){
    $scope.youOnline = false;
    $scope.partnerOnline = false;
    $scope.$digest();
});

PeerStream.onPeerConnected(function(){
  if($scope.partner_name == 'partner'){
    $scope.doLogin();
  }else{
    console.log('connection open');
    $scope.partnerOnline = true;
     PeerStream.signal({
        action: 'get-songlist'
    });
    $scope.$digest();
  }

});

PeerStream.onPeerDisconnected(function(){
 console.log('connection closed');
 $scope.partnerOnline = false;
 $scope.$digest();
});

PeerStream.onSignal(function(data){
  //console.log('Received from peer : ', JSON.stringify(data));
  // console.log('Received from peer : ', data);
  // console.log(peerConnection);
  if (data.action == "get-songlist") {
     // console.log('songs' + JSON.stringify($scope.songs));
      PeerStream.signal({
          action: 'result-songlist',
          songs: $scope.songs
      });
  }
  if (data.action == "result-songlist") {
      $scope.partnersongs = data.songs;
      $scope.partnerCount = $scope.partnersongs.length;
  }
  if (data.action == "play-song") {
      $scope.songSelected(data.song);
  }
  if (data.action == "new-song") {
      $scope.selectedSong = data.song.name;
      $ionicLoading.show({
          template: 'Loading... ' + data.song.name
      });
  }
  $scope.$digest();
});

PeerStream.onPlay(function(){
 console.log('play');
 $scope.playpause = true;
 	$ionicLoading.hide();
  $scope.$digest();

});
PeerStream.onPause(function(){
  $scope.playpause = false;
 console.log('pause');
 $ionicLoading.hide();
 $scope.$digest();

});
PeerStream.onPeerPlay(function(){
 console.log('peer play');
 $scope.playpause = true;
 	$ionicLoading.hide();
  $scope.$digest();

});
PeerStream.onPeerPause(function(){
 console.log('peer pause');
 $scope.playpause = false;
 $ionicLoading.hide();
 $scope.$digest();


});
PeerStream.onChat(function(chatMessage){
 $scope.appendPartnerChatMessage(chatMessage);
});
PeerStream.onCallConnected(function(){
  $scope.isCallInprogress=true;
  $scope.$digest();

});
PeerStream.onCallDisconnected(function(){
  $scope.isCallInprogress=false;
  $scope.$digest();

});
