angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, $ionicSideMenuDelegate, $ionicTabsDelegate) {

	initIonicVars($scope,$ionicLoading,$ionicSideMenuDelegate);
	//Start of app 
    $timeout(function() {

        $scope.initApp();

    }, 2000);
	
    $scope.selectTabWithIndex = function(index) {
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
            $scope.selectedSong = 'Choose song';
            $scope.selectedSongPath = ' ';
            $scope.duplicateID = false;
			
			$scope.isBuffering = false;
			
            // alert();
            if (localStorage['myid'] && localStorage['partnerid']) {
                myid = localStorage['myid'];
                partnerid = localStorage['partnerid'];
                $scope.you = myid;
                $scope.partner = partnerid;
                $scope.loginData.youname = myid;
                $scope.loginData.partnername = partnerid;
                $scope.doLogin();
                $scope.loadSongs();
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
        sendToPeer({
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
			artist      : 'Muse',                       // optional, default : ''
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
			ticker    : 'Now playing "Time is Running Out"'
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
        $ionicLoading.show({
            template: 'Loading...' + song.name
        });
        sendToPeer({
            action: 'new-song',
            song: song
        });
        $scope.selectedSongPath = song.filePath;
        console.log(song.filePath);
        startBuffering();

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

                    function addFileEntry(entry) {
                        var dirReader = entry.createReader();
                        dirReader.readEntries(
                            function(entries) {
                                var fileStr = "";
                                var i;
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
                                }

                            },
                            function(error) {
                                console.log("readEntries error : " + error.code);
                            }
                        );
                    };

                    function addFileEntryWrapper(entry) {
                        $ionicLoading.show({
                            template: 'Loading...'
                        });
                        addFileEntry(entry);
                        $ionicLoading.hide();
                        $scope.$digest();

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
                sendToPeer({
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
        console.log('songs', $scope.songs);
        myid = $scope.loginData.youname;
        partnerid = $scope.loginData.partnername;
        localStorage['myid'] = myid;
        localStorage['partnerid'] = partnerid;



        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        createConnection();


    };
})

.controller('PlaylistsCtrl', function($scope) {
    $scope.playlists = [{
        title: 'Reggae',
        id: 1
    }, {
        title: 'Chill',
        id: 2
    }, {
        title: 'Dubstep',
        id: 3
    }, {
        title: 'Indie',
        id: 4
    }, {
        title: 'Rap',
        id: 5
    }, {
        title: 'Cowbell',
        id: 6
    }];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {});