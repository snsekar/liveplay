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
  include_initappjs($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, $ionicSideMenuDelegate, $ionicTabsDelegate,$ionicScrollDelegate,$ionicSlideBoxDelegate,$http);
  include_resetappjs($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, $ionicSideMenuDelegate, $ionicTabsDelegate,$ionicScrollDelegate,$ionicSlideBoxDelegate,$http);
  include_tabselectedjs($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, $ionicSideMenuDelegate, $ionicTabsDelegate,$ionicScrollDelegate,$ionicSlideBoxDelegate,$http);
  include_loadsongsjs($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, $ionicSideMenuDelegate, $ionicTabsDelegate,$ionicScrollDelegate,$ionicSlideBoxDelegate,$http);

	//Start of app
    $timeout(function() {

        $scope.initApp();
    }, 2000);


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

		MusicControls.create({
			track       : song.name,        // optional, default : ''
			artist      : '',                       // optional, default : ''
			cover       : 'resources/android/icon/drawable-ldpi-icon.png',      // optional, default : nothing
			// cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
			//           or a remote url ('http://...', 'https://...', 'ftp://...')
			isPlaying   : true,                         // optional, default : true
			dismissable : false,                         // optional, default : false

			// hide previous/next/close buttons:
			hasPrev   : false,      // show previous button, optional, default: true
			hasNext   : false,      // show next button, optional, default: true
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
        MusicControls.updateIsPlaying(false);
					$scope.pauseSong();
					break;
				case 'music-controls-play':
          MusicControls.updateIsPlaying(true);
					$scope.playSong();
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

            //Registration push notification
            if(isApp){


            var push = PushNotification.init({
              android: {
                  senderID: "304952053901"
              }
          });
            if(localStorage['gcm_id'] == undefined || localStorage['gcm_id'] == null || localStorage['gcm_id'] == ''){
              push.on('registration', function(data) {
                  var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/users/update_gcm_id";
                  var payload = {
                    "user_id": myid,
                    "gcm_id": data.registrationId
                  };
                  $http.put(url,payload).success(function(response, status, headers, config){
                  localStorage['gcm_id'] = data.registrationId;
                  console.log('RegID = '+ data.registrationId);
                  }).error(function(err, status, headers, config){
                         console.log("Error occured while getting gcm_id");
                });
              });
            }
            push.on('notification', function(data) {
                console.log('Notification: = '+ data.message);
                // data.message,
                // data.title,
                // data.count,
                // data.sound,
                // data.image,
                // data.additionalData
                $scope.appendPartnerChatMessage(data.message);
                $scope.selectTabWithIndex(2);
            });

            push.on('error', function(e) {
                console.log(e.message);
            });
          }
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
                    partner_gcm_id = "null";
                    if(response.Items[0].gcm_id != undefined){
                      partner_gcm_id = response.Items[0].gcm_id.S;
                      localStorage['partner_gcm_id'] = partner_gcm_id;
                    }

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
        //Send push notification

        var url = "https://5j92d7undi.execute-api.us-west-2.amazonaws.com/dev/push_notification";

        var payload = {
          "gcm_id": partner_gcm_id,
          "title": 'Liveplay',
          "message": $scope.chat.data.message
        };
        $http.post(url,payload).success(function(response, status, headers, config){
          console.log(JSON.stringify(response));

      }).error(function(err, status, headers, config){
           console.log("Error occured while sending push notification")
      });

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

     $ionicSlideBoxDelegate.slide(1);
    //   $http.post(url,{}).success(function(response, status, headers, config){
    //     if(response.Error == undefined){
    //       $scope.loginData.wrongMobileNumber = false;
    //       $ionicSlideBoxDelegate.slide(1);
    //     }else{
    //         $scope.loginData.wrongMobileNumber = true;
    //     }
    //
    // }).error(function(err, status, headers, config){
    //      console.log("Error occured while sending verification code.")
    // });

    }
    $scope.verifyCode = function(){
    //  if($scope.loginData.code == $scope.loginData.entered_code){
  if("123" == $scope.loginData.entered_code){

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

$scope.footerExpand = function() {
  console.log('Footer expanded');
};
$scope.footerCollapse = function() {
  console.log('Footer collapsed');
};

})
