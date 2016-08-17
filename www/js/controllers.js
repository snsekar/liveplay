angular.module('starter.controllers', [])// All this does is allow the message
// to be sent when you tap return
.directive('input', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: function(scope, element, attr) {
      element.bind('focus', function(e) {
        if (scope.onFocus) {
          $timeout(function() {
            scope.onFocus();
          });
        }
      });
      element.bind('blur', function(e) {
        if (scope.onBlur) {
          $timeout(function() {
            scope.onBlur();
          });
        }
      });
      element.bind('keydown', function(e) {
        if (e.which == 13) {
          if (scope.returnClose) element[0].blur();
          if (scope.onReturn) {
            $timeout(function() {
              scope.onReturn();
            });
          }
        }
      });
    }
  }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, $ionicSideMenuDelegate, $ionicTabsDelegate,$ionicScrollDelegate,$ionicSlideBoxDelegate,$http) {

	initIonicVars($scope,$ionicLoading,$ionicSideMenuDelegate,$http);
	//Start of app
    $timeout(function() {

        $scope.initApp();

    }, 2000);

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

    $scope.resetUserData = function() {
        localStorage.removeItem('myid');
        localStorage.removeItem('partnerid');
        localStorage.removeItem('songs');
        localStorage.removeItem('partnersongs');
        localStorage.removeItem('chatmessages');


        $scope.you = "";
        $scope.partner = "";
        $scope.youCount = 0;
        $scope.partnerCount = 0;
        $scope.songs = [];
        $scope.partnersongs = [];
        $scope.loginData = {};

        $scope.$digest();
    }
    $scope.partnerSongSelected = function(song) {
        $scope.selectedSong = song.name;
        $ionicLoading.show({
            template: 'Loading... ' + song.name
        });
        $scope.sendToPeer({
            action: 'play-song',
            song: song
        });

    }
    $scope.songSelected = function(songObj) {
        song = songObj;
        $scope.selectedSong = song.name;

		// music control begin
		function onMSuccess(){
			//alert('Music control success');
		}
		function onMError(){
			//alert('Music control error');
		}
		/*
		MusicControls.create({
			track       : song.name,        // optional, default : ''
			artist      : '',                       // optional, default : ''
			cover       : 'resources/android/icon/drawable-ldpi-icon.jpg',      // optional, default : nothing
			// cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
			//           or a remote url ('http://...', 'https://...', 'ftp://...')
			isPlaying   : true,                         // optional, default : true
			dismissable : false,                         // optional, default : false

			// hide previous/next/close buttons:
			hasPrev   : true,      // show previous button, optional, default: true
			hasNext   : true,      // show next button, optional, default: true
			hasClose  : true,       // show close button, optional, default: false

			// Android only, optional
			// text displayed in the status bar when the notification (and the ticker) are updated
			ticker    : song.name
		}, onMSuccess, onMError);

		function events(action) {
			switch(action) {
				case 'music-controls-next':
					// Do something
					break;
				case 'music-controls-previous':
					// Do something
					break;
				case 'music-controls-pause':
					// Do something
					break;
				case 'music-controls-play':
					// Do something
					break;
				case 'music-controls-destroy':
					// Do something
					break;

				// Headset events (Android only)
				case 'music-controls-media-button' :
					// Do something
					break;
				case 'music-controls-headset-unplugged':
					// Do something
					break;
				case 'music-controls-headset-plugged':
					// Do something
					break;
				default:
					break;
			}
		}
		// Register callback
		MusicControls.subscribe(events);

		// Start listening for events
		// The plugin will run the events function each time an event is fired
		MusicControls.listen();

		MusicControls.updateIsPlaying(true); // toggle the play/pause notification button
		//music control end
		*/
        $ionicLoading.show({
            template: 'Loading...' + song.name
        });
        $scope.sendToPeer({
            action: 'new-song',
            song: song
        });
        $scope.selectedSongPath = song.filePath;
        console.log(song.filePath);
        startBuffering();

    }
	    $scope.makeCall = function() {

		//var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		//alert(navigator.userAgent);
		navigator.webkitGetUserMedia({video: false, audio: true}, function(stream) {
			  var call = peer.call(partnerid, stream);
			  console.log('call initiated');
			  call.on('stream', function(remoteStream) {
				// Show stream in some video/canvas element.
				console.log('call connected');
							  var audio_player = document.getElementById('audio_player');
             audio_player.src = URL.createObjectURL(remoteStream);
             audio_player.play();
			  });
			}, function(err) {
			  console.log('Failed to get caller local stream' ,JSON.stringify(err));
			});
		}
    $scope.loadSongs = function() {
        $timeout(function() {
            //	alert($scope.showHideYou);
            // if($scope.showHideYou){
            if (isApp) {
                if (window.localStorage['songs']) {
                    //console.log(localStorage['songs']);
                    $scope.songs = JSON.parse(localStorage['songs']);
                    $scope.youCount = $scope.songs.length;
                    $ionicLoading.hide();
                } else {
                    var localURLs = [
                        "file:///storage/"

                    ];
                    var index = 0;
                    var i;
                    var statusStr = "";
                    var endOfRecursive = "";
                    function addFileEntry(entry) {
                      $ionicLoading.show({
                          template: 'Loading songs from device...'
                      });
                        var dirReader = entry.createReader();
                        dirReader.readEntries(
                            function(entries) {
                                var fileStr = "";
                                var i;
                                if(endOfRecursive == ""){
                                  endOfRecursive = entries[entries.length-1].fullPath;
                                }
                                for (i = 0; i < entries.length; i++) {
                                    if (entries[i].isDirectory === true) {
                                        // Recursive -- call back into this subdirectory
                                        addFileEntry(entries[i]);
                                    } else {

                                        if (entries[i].name.indexOf(".mp3") != -1) {
                                            //	console.log(entries[i].filesystem);
                                            //	var filePath = entries[i].fullPath	;
                                            //	entries[i].file(function(file){
                                            $scope.songs.push({
                                                name: entries[i].name, //+ " ("+Math.round( (file.size/1000000 ) * 10 ) / 10+" mb)",
                                                filePath: entries[i].fullPath
                                            });

                                            $scope.youCount = $scope.songs.length;
                                            localStorage['songs'] = JSON.stringify($scope.songs);
                                            console.log($scope.songs.length + ' ' + entries[i].name);
                                            //console.log(JSON.stringify(file));
                                            //	   });

                                        }
                                    }
                                    $ionicLoading.hide();
                                }

                            },
                            function(error) {
                                console.log("readEntries error : " + error.code);
                            }
                        );
                    };

                    function addFileEntryWrapper(entry) {
                        addFileEntry(entry);

                    };

                    var addError = function(error) {
                        console.log("Filesystem error : " + error.code + ", " + error.message);
                    };
                    for (i = 0; i < localURLs.length; i++) {
                        if (localURLs[i] === null || localURLs[i].length === 0) {
                            continue; // skip blank / non-existent paths for this platform
                        }
                        window.resolveLocalFileSystemURL(localURLs[i], addFileEntryWrapper, addError);
                    }

                }
            }

            if (window.localStorage['partnersongs']) {
                //console.log(localStorage['songs']);
                $scope.partnersongs = JSON.parse(localStorage['partnersongs']);
                $scope.partnerCount = $scope.partnersongs.length;


                return;
            } else {
                $scope.sendToPeer({
                    action: 'get-songlist'
                });
            }



        }, 1000);
    }




    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };


    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {

        console.log('Doing login', $scope.loginData);

        var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/";
        url = url +$scope.loginData.user_id;

        $http.get(url).success(function(response, status, headers, config){
          if(response.Count != 0){
            myid = response.Items[0].user_id.S;
            my_name = response.Items[0].display_name.S;
            my_profile_picture = response.Items[0].profile_picture.S;
            localStorage['myid'] = myid;
            localStorage['my_name'] = my_name;
            localStorage['my_profile_picture'] = my_profile_picture;
            $scope.you = myid;
            $scope.my_name = my_name;
            $scope.my_profile_picture = my_profile_picture;

            if(response.Items[0].partner_id != undefined){
                partnerid = response.Items[0].partner_id.S;
                localStorage['partnerid'] = partnerid;
                  $scope.partner = partnerid;
                var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/";
                url = url + partnerid;
                $http.get(url).success(function(response, status, headers, config){
                  if(response.Count != 0){
                    partner_name = response.Items[0].display_name.S;
                    partner_profile_picture = response.Items[0].profile_picture.S;
                    localStorage['partner_name'] = partner_name;
                    localStorage['partner_profile_picture'] = partner_profile_picture;
                    $scope.partner_name = partner_name;
                    $scope.partner_profile_picture = partner_profile_picture;
                  }else{
                    console.log('User not exists');
                  }
              }).error(function(err, status, headers, config){
                   console.log("Error occured while login.");
              });
          }else{
            $scope.partner_name = 'partner';
          }
          createConnection();
          $scope.closeLogin();
          $scope.loadSongs();
          }else{
            console.log('User not exists');
          }
      }).error(function(err, status, headers, config){
           console.log("Error occured while login.");
      });
    };

		//Chat code
    $scope.sendChatMessage = function () {
        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
        $scope.chat.messages.push({
            userId: $scope.you,
            text: $scope.chat.data.message,
            time: d
        });
        localStorage['chatmessages'] = JSON.stringify($scope.chat.messages);
        $ionicScrollDelegate.scrollBottom(true);
        PeerStream.chat($scope.chat.data.message);
        delete $scope.chat.data.message;
    };
    $scope.appendPartnerChatMessage = function (msg) {
        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
        $scope.chat.messages.push({
            userId: $scope.partner,
            text: msg,
            time: d
        });
            localStorage['chatmessages'] = JSON.stringify($scope.chat.messages);
          $scope.$digest();
        $ionicScrollDelegate.scrollBottom(true);
    };

    //login screens
    $scope.disableLoginSwipe = function() {
      $ionicSlideBoxDelegate.enableSlide(false);
    };
    $scope.loginSlideTo = function(index) {
      $ionicSlideBoxDelegate.slide(index);
    };
    $scope.sendVerificationCode = function(){
      $scope.loginData.code = Math.floor(1000 + Math.random() * 9000);
      var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/sms?";
      url = url +"PhoneNumber="+$scope.loginData.user_id;
      url = url +"&Message="+$scope.loginData.code +" is your verification code for Liveplay";

      $http.post(url,{}).success(function(response, status, headers, config){
        if(response.Error == undefined){
          $scope.loginData.wrongMobileNumber = false;
          $ionicSlideBoxDelegate.slide(1);
        }else{
            $scope.loginData.wrongMobileNumber = true;
        }

    }).error(function(err, status, headers, config){
         console.log("Error occured while sending verification code.")
    });

    }
    $scope.verifyCode = function(){
      if($scope.loginData.code == $scope.loginData.entered_code){
//  if("123" == $scope.loginData.entered_code){

        $scope.loginData.wrongcode = false;
        var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/";
        url = url +$scope.loginData.user_id;

        $http.get(url).success(function(response, status, headers, config){
          if(response.Count == 0){
            //new user signup
            $ionicSlideBoxDelegate.slide(2);

          }else{
              $scope.doLogin();
          }
      }).error(function(err, status, headers, config){
           console.log("Error occured while login.")
      });
      }else{
        $scope.loginData.wrongcode = true;
      }

    }
    $scope.signUp = function(){
        var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/signup";
        var payload = {
          "user_id": $scope.loginData.user_id,
          "display_name": $scope.loginData.user_name,
          "gender": "null",
          "profile_picture": "null",
          "mobile": $scope.loginData.user_id,
          "email": "null"
        };

        $http.post(url,payload).success(function(response, status, headers, config){
          if(JSON.stringify(response) === JSON.stringify({})){
            $scope.doLogin();
          }else{
            console.log("Error occured while signup.");
          }
      }).error(function(err, status, headers, config){
           console.log("Error occured while signup.");
      });


    }

    $scope.searchUser = function(){
        var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/";
        url = url + $scope.partnerReq.search.user_id;
        $scope.partnerReq.searchRes = undefined;

        $http.get(url).success(function(response, status, headers, config){
          if(response.Count != 0){
            $scope.partnerReq.searchRes = {};
            $scope.partnerReq.searchRes.user_id = response.Items[0].user_id.S;
            $scope.partnerReq.searchRes.user_name = response.Items[0].display_name.S;
            $scope.partnerReq.searchRes.user_profile_picture = response.Items[0].profile_picture.S;
          }else{
            $scope.partnerReq.searchRes = 'no-result';
          }
      }).error(function(err, status, headers, config){
           console.log("Error occured while login.")
      });
  }

  $scope.addPartner = function(){
    var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/update_partner_request_id";
    var payload = {
      "user_id": myid,
      "partner_request_id": "sender "+$scope.partnerReq.searchRes.user_id
    };
    $http.put(url,payload).success(function(response, status, headers, config){
        var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/update_partner_request_id";
        var payload = {
          "user_id": $scope.partnerReq.searchRes.user_id,
          "partner_request_id": "receiver "+myid
        };
        $http.put(url,payload).success(function(response, status, headers, config){
          $scope.selectTabWithIndex(1);
        }).error(function(err, status, headers, config){
               console.log("Error occured while updating peerjs_id.");
      });
    }).error(function(err, status, headers, config){
           console.log("Error occured while updating peerjs_id.");
  });

}
$scope.acceptPartnerRequest = function(){
  var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/update_partner_id";
  var payload = {
    "user_id": myid,
    "partner_id": $scope.partnerReq.user_id
  };
  $http.put(url,payload).success(function(response, status, headers, config){
      var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/update_partner_request_id";
      var payload = {
        "user_id": myid,
        "partner_request_id": "null"
      };
      $http.put(url,payload).success(function(response, status, headers, config){
        var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/update_partner_id";
        var payload = {
          "user_id": $scope.partnerReq.user_id,
          "partner_id": myid
        };
        $http.put(url,payload).success(function(response, status, headers, config){
            var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/update_partner_request_id";
            var payload = {
              "user_id": $scope.partnerReq.user_id,
              "partner_request_id": "null"
            };
            $http.put(url,payload).success(function(response, status, headers, config){
              $scope.doLogin();
            }).error(function(err, status, headers, config){
                   console.log("Error occured while updating peerjs_id.");
          });
        }).error(function(err, status, headers, config){
               console.log("Error occured while updating peerjs_id.");
      });

      }).error(function(err, status, headers, config){
             console.log("Error occured while updating peerjs_id.");
    });
  }).error(function(err, status, headers, config){
         console.log("Error occured while updating peerjs_id.");
});

}
$scope.rejectPartnerRequest = function(){
  var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/update_partner_request_id";
  var payload = {
    "user_id": myid,
    "partner_request_id": "null"
  };
  $http.put(url,payload).success(function(response, status, headers, config){
    var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/update_partner_request_id";
    var payload = {
      "user_id": $scope.partnerReq.user_id,
      "partner_request_id": "null"
    };
    $http.put(url,payload).success(function(response, status, headers, config){
      $scope.doLogin();
    }).error(function(err, status, headers, config){
           console.log("Error occured while updating peerjs_id.");
  });
  }).error(function(err, status, headers, config){
         console.log("Error occured while updating peerjs_id.");
});

}
$scope.playSong = function(){
  PeerStream.play();
}
$scope.pauseSong = function(){
  PeerStream.pause();
}
$scope.startCall = function(){
PeerStream.startCall();
}
$scope.stopCall = function(){
  $scope.isCallInprogress=false;
  PeerStream.stopCall();
}

})
