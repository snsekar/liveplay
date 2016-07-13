
var resetPlayBack = function() {

	bufferBlob =  new Uint8Array(0);
    offset = 0;
    endOfFile = false;
    currentBufferFile = 0;
    isStartPlay = true;
	$scope.isBuffering = false;
	if (audio_player != 0) {
		if(isApp){
			audio_player.stop();
		}else{
			audio_player.pause();
			audio_player.currentTime = 0; 
		}
    }

    audio_player = 0;
	prev_audio_player = 0;

    previousChunkDuration = 0;
    elapsedTime = 0;
	$scope.$digest();
}
var playSuccess = function() {
	previousChunkDuration = (context.currentTime * 1000) - previousChunkDuration;
	elapsedTime = elapsedTime + previousChunkDuration;
	//	console.log("playAudio():Audio Success"); 
	audio_player = 0;
	//console.log('recursive Playsong');
	if (isStartPlay) {
		elapsedTime = 0;
		previousChunkDuration = 0; 
	} else {
		playSong();
	}
}
var playError = function(err) {
	console.log("playAudio():Audio Error: " + JSON.stringify(err));
}

var playStopped = function() {
	//console.log('play stopped');
}
var playSong = function() {
	/*if(isApp){
		if (audio_player == 0 && !isStartPlay) {
			//console.log('now = '+(context.currentTime * 1000 * 1000)/1000);

			
			audio_player = new Media(currentBufferFile.localURL, playStopped, playError); 
			
			if(prev_audio_player != 0){
			prev_audio_player.getCurrentPosition(
				// success callback
				function (position) {
					if (position > -1) {
						console.log((position) + " sec"); 
						audio_player.play();
						audio_player.seekTo(position * 1000);
						prev_audio_player.stop();
							prev_audio_player = audio_player;
					}
				},
				// error callback
				function (e) { 
					console.log("Error getting pos=" + e); 
				}
			);
		}else{
		audio_player.play();			
			prev_audio_player = audio_player; 
		}
		
			//console.log('now = '+(context.currentTime * 1000 * 1000)/1000);


			//console.log(myid+' : elapsedTime = ' + elapsedTime);
			//audio_player.play();
			//audio_player.seekTo(elapsedTime);
			//console.log('now = '+(context.currentTime * 1000 * 1000)/1000);
			
			setTimeout(function () { 
				var duration = audio_player.getDuration() * 1000 ; 
				if (elapsedTime == duration) {
					return;
					console.log('playback stopped');  
				}
				elapsedTime = duration;
					//console.log('duration = '+ duration);
					setTimeout(function () { 
						audio_player = 0;
						playSong();				
					},  duration - 1000 - 2000); 

			}, 1000);
			

		}
	//}else{ 
		
		if (audio_player == 0 && !isStartPlay) {
		console.log(myid+' : startplaying');
			audio_player = document.getElementById('audio_player');
			var dataView = new Uint8Array(bufferBlob);
			var dataBlob = new Blob([dataView]);
			var bloburl = window.URL.createObjectURL(dataBlob);
			console.log(myid+' : bloburl = '+ bloburl);

			 var xhr = new XMLHttpRequest();
			  xhr.open('GET', 'http://upload.wikimedia.org/wikipedia/commons/a/aa/White_noise.ogg', true);//bloburl,true);//
			  xhr.responseType = 'blob';

			  xhr.onreadystatechange = function() {
				if (xhr.readyState === 4 && xhr.status == 200) {
					var url = window.URL.createObjectURL( xhr.response )
					console.log(myid+' : audiourl = '+ url);
					audio_player.src = 'http://upload.wikimedia.org/wikipedia/commons/a/aa/White_noise.ogg',//url;
					audio_player.onended = playSuccess;
					audio_player.onerror = playError;
					if (previousChunkDuration > 0 && previousChunkDuration < 1000) {
						return;
					}

					previousChunkDuration = context.currentTime * 1000;
					console.log(myid+' : elapsedTime = ' + elapsedTime);
					audio_player.play();
					audio_player.currentTime = (elapsedTime/1000);
				  }
				};
				xhr.send();
			

			
		}
		
		window.MediaSource = window.MediaSource || window.WebKitMediaSource;
		ms = new MediaSource();
		ms.addEventListener('webkitsourceopen', onSourceOpen.bind(ms), false);
		function onSourceOpen(e) {
		// this.readyState === 'open'. Add source buffer that expects webm chunks.
		sourceBuffer = ms.addSourceBuffer('audio/mpeg');
		}

				var audio = document.getElementById('audio_player');
				audio.src = window.URL.createObjectURL(ms); // blob URL pointing to the MediaSource.
				audio.webkitSourceAppend(bufferBlob);
				//sourceBuffer.appendBuffer(bufferBlob);

*/




	//}
	
	$ionicLoading.hide();

	
	
}