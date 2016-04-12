 function peerConnected() {
     console.log('connection open');
     $scope.partnerOnline = true;
     sendToPeer({
         action: 'get-songlist'
     });
     $scope.$digest();
 }

 function peerdisConnected() {
     console.log('connection closed');
     $scope.partnerOnline = false;
     $scope.$digest();
 }

 function receivedFromPeer(data) {
     //console.log('Received from peer : ', JSON.stringify(data));
     // console.log('Received from peer : ', data);
     // console.log(peerConnection);
     if (data.action == "get-songlist") {
        // console.log('songs' + JSON.stringify($scope.songs));
         sendToPeer({
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

		resetPlayBack();
		$scope.isBuffering = true;

     }
     if (data.action == "nextChunk") {
         console.log(peerConnection);
     }
     if (data.action == 'file-chunk') {
		//console.log('file chunk received');
        writeToPlayBuffer(data.data,false);
        
     }
     if (data.action == 'send-next-file-chunk') {
		//console.log('start play');
         playSong();
         if (!endOfFile && !isStartPlay) {
             offset += chunkSize;
             fetchNextFileChunk(writeToPlayBuffer);
         }
     }
	 				
	if (data.action == 'buffering-done') {
		$scope.isBuffering = false;
	}
	
     $scope.$digest();

 }

 function sendToPeer(data) {
     if (peerConnection) {
        //  console.log('Sent to peer : ', JSON.stringify(data));
         peerConnection.send(data);
     } else {
         console.log('peer not connected');
     }
 }

 function initPeerConnection() {
     peerConnection.on('open', peerConnected);
     peerConnection.on('close', peerdisConnected);
     peerConnection.on('data', receivedFromPeer);
     $scope.sendToPeer = sendToPeer;

 }

 function connectToPeer() {
     peerConnection = peer.connect(partnerid, {
         label: "file",
         reliable: true
     });
     initPeerConnection();
 }

 function createConnection() {

     peer = new Peer(myid, {
         key: 'iulf39j4p5w2ke29'
     });

     connectToPeer();

     peer.on('open', function() {
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

     });



     peer.on('call', function(call) {
         $ionicLoading.hide();
         call.answer();
         call.on('stream', function(stream) {


             var audio_player = document.getElementById('audioIframe').contentWindow.document.getElementById('audio_player');
             audio_player.src = URL.createObjectURL(stream);
             audio_player.play();
         });

         $scope.$digest();
     });

     peer.on('connection', function(conn) {
         peerConnection = conn;
         initPeerConnection();

     });

     peer.on('error', function(err) {
         console.log(err.type);
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

     peer.on('disconnected', function() {

         $scope.youOnline = false;
         $scope.partnerOnline = false;
         $scope.$digest();
     });

 }