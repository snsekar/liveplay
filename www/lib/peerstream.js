var PeerStream = {};
PeerStream.selfId = "";
PeerStream.peerId = "";
PeerStream.peer = "";
PeerStream.peerConnection = "";

PeerStream._audioElement = "";
PeerStream.__audioCallElement = "";
PeerStream._mediaSource =  "";
PeerStream._mediaSourceBuffer = "";
PeerStream._currentBufferFile = {};
PeerStream.isStartPlay = true;
PeerStream.audio_player = {};
PeerStream.buffer_audio_player = {};


PeerStream._fileSourceObject = {
  file : {},
  fileCursor : 0,
  fileChunkSize : 256 * 1024 * 2
};



PeerStream.onConnectedHandler = "";
PeerStream.onDisconnectedHandler = "";
PeerStream.onCallConnectedHandler = "";
PeerStream.onCallDisconnectedHandler = "";
PeerStream.onPeerConnectedHandler = "";
PeerStream.onPeerDisconnectedHandler = "";
PeerStream.onChatHandler = "";
PeerStream.onSignalHandler = "";
PeerStream.onErrorHandler = "";
PeerStream._onData = "";

PeerStream.onPlayHandler = "";
PeerStream.onPauseHandler = "";
PeerStream.onPeerPlayHandler = "";
PeerStream.onPeerPauseHandler = "";

PeerStream.initPeerConnection = function () {
  PeerStream.peerConnection.on('open', function() {
    PeerStream.onPeerConnectedHandler.call();
  });
  PeerStream.peerConnection.on('data', function(data) {
    if(data.type == 'chat'){
      PeerStream.onChatHandler.call(this,data.payload);
    }
    if(data.type == '_data'){
      PeerStream._onData(data);
    }
    if(data.type == 'signal'){
      PeerStream.onSignalHandler.call(this,data.payload);
    }
  });
  PeerStream.peerConnection.on('close', function() {
    PeerStream.onPeerDisconnectedHandler.call();
  });
  PeerStream.peerConnection.on('error', function(err) {
    console.log(err);
    var data = {
      type : 'error',
      payload : 'data-connection-error'
    };
    PeerStream.onErrorHandler.call(this,data);
  });
}
PeerStream.connect = function(selfId, peerId, mediaElementId,callElementId) {
  PeerStream.selfId = selfId;
  PeerStream.peerId = peerId;
console.log('connect called');
console.log('connect called before');

 PeerStream.peer = new Peer(selfId, {
      key: 'iulf39j4p5w2ke29'
  });
  console.log('connect called after');

 PeerStream.peer.on('open', function(id) {
   console.log('connection open');

    PeerStream.onConnectedHandler.call(this,id);
    PeerStream.peerConnection =PeerStream.peer.connect(peerId, {
        reliable: true
    });
    PeerStream.initPeerConnection();
  });
 PeerStream.peer.on('connection', function(connection) {
    PeerStream.peerConnection = connection;
    PeerStream.initPeerConnection();
  });
  PeerStream.peer.on('call', function(call) {
    PeerStream.callConnection = call;
    navigator.webkitGetUserMedia({video: false, audio: true}, function(stream) {
      call.answer(stream);
      call.on('stream', function(remoteStream) {
       PeerStream._audioCallElement.src = URL.createObjectURL(remoteStream);
       PeerStream._audioCallElement.play();
       PeerStream.onCallConnectedHandler.call();
      });
      call.on('close', function() {
          PeerStream.onCallDisconnectedHandler.call();
       });
    }, function(err) {
      alert('Failed to get receiver local stream' ,JSON.stringify(err));
    });

  });
  PeerStream.peer.on('disconnected', function() {
       PeerStream.onDisconnectedHandler.call();
   });
  PeerStream.peer.on('close', function() {
      PeerStream.onDisconnectedHandler.call();
   });
 PeerStream.peer.on('error', function(err) {
   console.log("err1 "+JSON.stringify(err));
   var data = {
     type : 'error',
     payload : err.type
   };
    PeerStream.onErrorHandler.call(this,data);
  });

  PeerStream._audioElement = document.getElementById(mediaElementId);
  PeerStream._audioCallElement = document.getElementById(callElementId);

};
PeerStream.onConnected = function(eventHandler) {
  PeerStream.onConnectedHandler = eventHandler;
};

PeerStream.onDisconnected = function(eventHandler) {
  PeerStream.onDisconnectedHandler = eventHandler;
};

PeerStream.onPeerConnected = function(eventHandler) {
  PeerStream.onPeerConnectedHandler = eventHandler;
};

PeerStream.onPeerDisconnected = function(eventHandler) {
  PeerStream.onPeerDisconnectedHandler = eventHandler;
};
PeerStream.onChat = function(eventHandler) {
  PeerStream.onChatHandler = eventHandler;
};
PeerStream.onSignal = function(eventHandler) {
  PeerStream.onSignalHandler = eventHandler;
};
PeerStream.onCallConnected = function(eventHandler) {
  PeerStream.onCallConnectedHandler = eventHandler;
};
PeerStream.onCallDisconnected = function(eventHandler) {
  PeerStream.onCallDisconnectedHandler = eventHandler;
};
PeerStream.onPlay = function(eventHandler) {
  PeerStream.onPlayHandler = eventHandler;
};
PeerStream.onPause = function(eventHandler) {
  PeerStream.onPauseHandler = eventHandler;
};
PeerStream.onPeerPlay = function(eventHandler) {
  PeerStream.onPeerPlayHandler = eventHandler;
};
PeerStream.onPeerPause = function(eventHandler) {
  PeerStream.onPeerPauseHandler = eventHandler;
};

PeerStream.disConnect = function(peerId) {
  //disConnect from peer
};
PeerStream.resetPlayBack = function(mediaMIMEType) {
  //stop playback
  PeerStream.stop();
  PeerStream.audio_player = {};
  //clear buffer
  // PeerStream._mediaSource =  new MediaSource();
  // PeerStream._mediaSourceBuffer ="";
  // PeerStream._audioElement.src = window.URL.createObjectURL(PeerStream._mediaSource);
  PeerStream.isStartPlay = true;
}
PeerStream.attachSource = function(mediaType, mediaSourceObject) {

  //get metadata about soucre and display. Title,Duration,Album art,MIME type
  var metadata = {
    mimeType : 'audio/mpeg'
  };
  PeerStream.resetPlayBack(metadata.mimeType);
  PeerStream._sendData("source-attached",metadata);
  if(mediaType == 'file'){
    PeerStream._fileSourceObject.file = mediaSourceObject ;
    PeerStream._fileSourceObject.fileCursor = 0 ;
    PeerStream._fetchNextFileChunk();
    // for(var i=1;i<5;i++){
    //   setTimeout(function() {
    //     console.log("fetching next chunk...");
    //   //  PeerStream._fileSourceObject.fileCursor = cursor + chunkSize;
    //     PeerStream._fetchNextFileChunk();
    //   },i*10000);
    // }

  }
};

PeerStream.play = function() {
  //if(PeerStream._audioElement.played.length == 0){
//    PeerStream._audioElement.play();
  console.log("playing.....!!!");
    PeerStream.audio_player.play();
    PeerStream._sendData("play","");
    PeerStream.onPlayHandler.call();
//  }
};

PeerStream.pause = function() {
  //PeerStream._audioElement.pause();
  PeerStream.audio_player.pause();

  PeerStream._sendData("pause","");
  PeerStream.onPauseHandler.call();

};

PeerStream.seek = function(seekedTime) {
  //connect to peer
};

PeerStream.stop = function() {
  //connect to peer
  if(PeerStream.audio_player instanceof Media){
    PeerStream.audio_player.stop();
  }
};

PeerStream.startCall = function() {
  navigator.webkitGetUserMedia({video: false, audio: true}, function(stream) {
    console.log("call peerId = "+PeerStream.peerId);
        var call = PeerStream.peer.call(PeerStream.peerId, stream);
        PeerStream.callConnection = call;
        call.on('stream', function(remoteStream) {
        PeerStream._audioCallElement.src = URL.createObjectURL(remoteStream);
        PeerStream._audioCallElement.play();
        PeerStream.onCallConnectedHandler.call();
        });
        call.on('close', function() {
            PeerStream.onCallDisconnectedHandler.call();
         });
      }, function(err) {
        alert('Failed to get caller local stream' ,JSON.stringify(err));
      });
};

PeerStream.stopCall = function() {
  //connect to peer
  PeerStream.callConnection.close();
};

PeerStream.chat = function(message) {
  var data = {
    //id : 'some unique id for PeerStream message',
    type : 'chat',
    payload : message
  };
  PeerStream.peerConnection.send(data);
};



PeerStream.signal = function(payload) {
  var data = {
    //id : 'some unique id for PeerStream message',
    type : 'signal',
    payload : payload
  };
  PeerStream.peerConnection.send(data);
};

PeerStream.error = function(message) {
  //connect to peer
};

PeerStream.onError = function(eventHandler) {
  PeerStream.onErrorHandler = eventHandler;
};

PeerStream._sendData = function(event,data){
  var _data = {
    //id : 'some unique id for PeerStream message',
    type : "_data",
    event: event,
    payload : data
  };
  PeerStream.peerConnection.send(_data);
}

PeerStream._onData = function(data) {
 if(data.event == 'media-chunk'){
   console.log("media chunk received");
   //append to audio buffer
   if(data.payload != ""){
    //  if(PeerStream._mediaSourceBuffer == ""){
    //    PeerStream._mediaSourceBuffer = PeerStream._mediaSource.addSourceBuffer('audio/mpeg');
    //  }
    // PeerStream._mediaSourceBuffer.appendBuffer(new Uint8Array(data.payload));
    // console.log('media-chunk-appended');
    // PeerStream._sendData('media-chunk-ack',"");
    var fileChunk = data.payload;
    function win(writer) {
  //    writer.onwrite = function(evt) {
        console.log("writing file chunk");
        console.log("isStartPlay = "+PeerStream.isStartPlay);
        if (PeerStream.isStartPlay) {
           //writer.truncate(0);
        } else {
          writer.seek(writer.length);
        }
        PeerStream._sendData("media-chunk-ack", "");
  //    };
      writer.onwriteend = function(e) {
        console.log('WRITE SUCCESS');
        if (PeerStream.isStartPlay) {
          PeerStream.isStartPlay = false;
          var playError = function(err) {
            console.log("playAudio():Audio Error: " + JSON.stringify(err));
          }
          var playStopped = function() {
            console.log('play stopped');
          }
          console.log("creating player object");
          console.log(Media);
          console.log(cordova.file.dataDirectory);
         PeerStream.audio_player = new Media(cordova.file.dataDirectory+"song.mp3", playStopped, playError);
        // var tmpFilePath = cordova.file.tmpDirectory+"song.mp3";
        // tmpFilePath = tmpFilePath.replace('file://', '');
        // PeerStream.audio_player = new Media(tmpFilePath, playStopped, playError);


          PeerStream.play();
        }
      };
        writer.onerror = function(e) {
          console.log('Error while writing filechunk to bufferFile');

        }
      writer.write(fileChunk);
    };

    var fail = function(evt) {
      console.log('song.mp3 error ' + JSON.stringify(evt));
    };

    function songFileEntry(entry) {
      console.log('start create song file');
      entry.file(gotBufferFile, fail);
      entry.createWriter(win, fail);

    }

    function gotBufferFile(bfile) {
      console.log('got buffer file');
    PeerStream._currentBufferFile = bfile;
    }

    function gotDir(dirEntry) {
      //console.log('got dir');
      console.log("got file dir");
      dirEntry.getFile("song.mp3", {
        create: true
      }, songFileEntry, fail);
    }
    console.log("reading file");
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, gotDir, fail);
  }else{
    console.log(" *** Done receiving file *** ");
    PeerStream._mediaSource.endOfStream();
  }
 }

 if(data.event == 'media-chunk-ack'){
   PeerStream.play();
   PeerStream._fetchNextFileChunk();
 }

 if(data.event == 'source-attached'){
   //get metadata about source and display. Title,Duration,Album art
   PeerStream.resetPlayBack(data.payload.mimeType);

 }
 if(data.event == 'play'){
  // PeerStream._audioElement.play();
  PeerStream.audio_player.play();
   PeerStream.onPeerPlayHandler.call();
 }
 if(data.event == 'pause'){
//   PeerStream._audioElement.pause();
  PeerStream.audio_player.pause();

   PeerStream.onPeerPauseHandler.call();
 }
};

PeerStream._fetchNextFileChunk = function () {
  var r = new FileReader();
  var cursor = PeerStream._fileSourceObject.fileCursor;
  var chunkSize = PeerStream._fileSourceObject.fileChunkSize;
  var fileSize = PeerStream._fileSourceObject.file.size;
  if (cursor > fileSize) {
      console.log(" *** Done reading file *** ");
      //PeerStream._mediaSource.endOfStream();
      PeerStream._sendData("media-chunk", "");
      return;
  }
  var blob = PeerStream._fileSourceObject.file.slice(cursor, cursor + chunkSize);
  r.onload = function(evt) {
      if (evt.target.error == null) {
        // if(PeerStream._mediaSourceBuffer == ""){
        //   setTimeout(function() {
        //     PeerStream._mediaSourceBuffer = PeerStream._mediaSource.addSourceBuffer('audio/mpeg');
        //     PeerStream._mediaSourceBuffer.appendBuffer(new Uint8Array(evt.target.result));
        //     PeerStream.play();
        //     console.log('media-chunk-appended');
        //     PeerStream._sendData("media-chunk", evt.target.result);
        //   }, 1500);
        // }else{
        //   PeerStream._mediaSourceBuffer.appendBuffer(new Uint8Array(evt.target.result));
        //   PeerStream.play();
        //   console.log('media-chunk-appended');
        //   PeerStream._sendData("media-chunk", evt.target.result);
        // }
        console.log("got file chunk");
        var fileChunk = evt.target.result;
        function win(writer) {

            console.log("isStartPlay = "+PeerStream.isStartPlay);
            if (PeerStream.isStartPlay) {
               //writer.truncate(0);
               console.log("writer.position = "+writer.position);
               console.log("writer.length = "+writer.length);

            } else {
              console.log("writer.position = "+writer.position);
              writer.seek(writer.length);
            }
            PeerStream._sendData("media-chunk", fileChunk);
    	//		};
          writer.onwriteend = function(e) {
            console.log('WRITE SUCCESS');
            if (PeerStream.isStartPlay) {
              PeerStream.isStartPlay = false;
              var playError = function(err) {
                console.log("playAudio():Audio Error: " + JSON.stringify(err));
              }
              var playStopped = function() {
                console.log('play stopped');
              }
              console.log("creating player object");
              console.log(Media);
              console.log(cordova.file.dataDirectory);



                PeerStream.audio_player = new Media(cordova.file.dataDirectory+"song.mp3", playStopped, playError);
                PeerStream.play();

            // var tmpFilePath = cordova.file.tmpDirectory+"song.mp3";
            // tmpFilePath = tmpFilePath.replace('file://', '');
            // PeerStream.audio_player = new Media(tmpFilePath, playStopped, playError);

            }else{
              console.log("loading buffer player");
              console.log("a getDuration = "+PeerStream.audio_player.getDuration());
              PeerStream.audio_player.getCurrentPosition(        // success callback
          function (position) {
              if (position > -1) {
                  console.log("a getCurrentPosition = "+(position) + " sec");
                  PeerStream.buffer_audio_player = new Media(cordova.file.dataDirectory+"song.mp3", playStopped, playError);
                  PeerStream.buffer_audio_player.seekTo(position*1000);
                  PeerStream.buffer_audio_player.play();

                  PeerStream.audio_player.stop();
                  PeerStream.audio_player = PeerStream.buffer_audio_player;
              }
          },
          // error callback
          function (e) {
              console.log("Error getting pos=" + e);
          });


              PeerStream.buffer_audio_player = new Media(cordova.file.dataDirectory+"song.mp3", playStopped, playError);

            //  PeerStream.play();

            }

          };
            writer.onerror = function(e) {
              console.log('Error while writing filechunk to bufferFile');

            }
          writer.write(fileChunk);
    		};

    		var fail = function(evt) {
    			console.log('song.mp3 error ' + JSON.stringify(evt));
    		};

    		function songFileEntry(entry) {
    			console.log('start create song file');
    			entry.file(gotBufferFile, fail);
    			entry.createWriter(win, fail);

    		}

    		function gotBufferFile(bfile) {
    			console.log('got buffer file');
    		PeerStream._currentBufferFile = bfile;
    		}

    		function gotDir(dirEntry) {
    			//console.log('got dir');
          console.log("got file dir");
    			dirEntry.getFile("song.mp3", {
    				create: true
    			}, songFileEntry, fail);
    		}
        console.log("reading file");
    		window.resolveLocalFileSystemURL(cordova.file.dataDirectory, gotDir, fail);



      } else {
          console.log("Read error: " + evt.target.error);
          //stop playback
          return;
      }

      PeerStream._fileSourceObject.fileCursor = cursor + chunkSize;


  };
  r.readAsArrayBuffer(blob);

}
