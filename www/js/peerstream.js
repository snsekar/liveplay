var PeerStream = {};
PeerStream.selfId = "";
PeerStream.peerId = "";
PeerStream.peer = "";
PeerStream.peerConnection = "";

PeerStream._audioElement = "";
PeerStream._mediaSource =  "";
PeerStream._mediaSourceBuffer = "";

PeerStream._fileSourceObject = {
  file : {},
  fileCursor : 0,
  fileChunkSize : 256 * 1024
};



PeerStream.onConnectedHandler = "";
PeerStream.onDisconnectedHandler = "";
PeerStream.onPeerConnectedHandler = "";
PeerStream.onPeerDisconnectedHandler = "";
PeerStream.onChatHandler = "";
PeerStream.onErrorHandler = "";
PeerStream._onData = "";

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
PeerStream.connect = function(selfId, peerId, mediaElementId) {
  PeerStream.selfId = selfId;
  PeerStream.peerId = peerId;

 PeerStream.peer = new Peer(selfId, {
      key: 'iulf39j4p5w2ke29'
  });
 PeerStream.peer.on('open', function(id) {
    PeerStream.onConnectedHandler.call();
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
   console.log('call received');
    PeerStream.callConnection = call;
    navigator.webkitGetUserMedia({video: false, audio: true}, function(stream) {
      call.answer(stream); // Answer the call with an A/V stream.
      console.log('call answered');
      call.on('stream', function(remoteStream) {
        console.log('call connected');
       var audio_element_call = document.getElementById('audio_call');
       audio_element_call.src = URL.createObjectURL(remoteStream);
       audio_element_call.play();
      });
    }, function(err) {
      console.log('Failed to get receiver local stream' ,err);
    });
  });
  PeerStream.peer.on('disconnected', function() {
       PeerStream.onDisconnectedHandler.call();
   });
  PeerStream.peer.on('close', function() {
      PeerStream.onDisconnectedHandler.call();
   });
 PeerStream.peer.on('error', function(err) {
   var data = {
     type : 'error',
     payload : err.type
   };
    PeerStream.onErrorHandler.call(this,data);
  });

  PeerStream._audioElement = document.getElementById(mediaElementId);
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

PeerStream.disConnect = function(peerId) {
  //disConnect from peer
};
PeerStream.resetPlayBack = function(mediaMIMEType) {
  //stop playback
  PeerStream.stop();
  //clear buffer
  PeerStream._mediaSource =  new MediaSource();
  PeerStream._mediaSourceBuffer ="";
  PeerStream._audioElement.src = window.URL.createObjectURL(PeerStream._mediaSource);
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
  }
};

PeerStream.play = function() {
  //connect to peer
};

PeerStream.pause = function() {
  //connect to peer
};

PeerStream.seek = function(seekedTime) {
  //connect to peer
};

PeerStream.stop = function() {
  //connect to peer
};

PeerStream.startCall = function() {
  navigator.webkitGetUserMedia({video: false, audio: true}, function(stream) {
        var call = PeerStream.peer.call(PeerStream.peerId, stream);
        PeerStream.callConnection = call;
        console.log('call initiated');
        call.on('stream', function(remoteStream) {
          // Show stream in some video/canvas element.
          console.log('call connected');
          var audio_element_call = document.getElementById('audio_call');
         audio_element_call.src = URL.createObjectURL(remoteStream);
         audio_element_call.play();
        });
      }, function(err) {
        console.log('Failed to get caller local stream' ,JSON.stringify(err));
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

PeerStream.onChat = function(eventHandler) {
  PeerStream.onChatHandler = eventHandler;
};

PeerStream.signal = function(message) {
  //connect to peer
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
   //append to audio buffer
   if(data.payload != ""){
     if(PeerStream._mediaSourceBuffer == ""){
       PeerStream._mediaSourceBuffer = PeerStream._mediaSource.addSourceBuffer('audio/mpeg');
     }
    PeerStream._mediaSourceBuffer.appendBuffer(new Uint8Array(data.payload));
    console.log('media-chunk-appended');
    PeerStream._sendData('media-chunk-ack',"");
  }else{
    console.log(" *** Done receiving file *** ");
    PeerStream._mediaSource.endOfStream();
  }
 }

 if(data.event == 'media-chunk-ack'){
   PeerStream._fetchNextFileChunk();
 }

 if(data.event == 'source-attached'){
   //get metadata about source and display. Title,Duration,Album art
   PeerStream.resetPlayBack(data.payload.mimeType);

 }
};

PeerStream._fetchNextFileChunk = function () {
  var r = new FileReader();
  var cursor = PeerStream._fileSourceObject.fileCursor;
  var chunkSize = PeerStream._fileSourceObject.fileChunkSize;
  var fileSize = PeerStream._fileSourceObject.file.size;
  if (cursor > fileSize) {
      console.log(" *** Done reading file *** ");
      PeerStream._mediaSource.endOfStream();
      PeerStream._sendData("media-chunk", "");
      return;
  }
  var blob = PeerStream._fileSourceObject.file.slice(cursor, cursor + chunkSize);
  r.onload = function(evt) {
      if (evt.target.error == null) {
        if(PeerStream._mediaSourceBuffer == ""){
          PeerStream._mediaSourceBuffer = PeerStream._mediaSource.addSourceBuffer('audio/mpeg');
        }

          PeerStream._mediaSourceBuffer.appendBuffer(new Uint8Array(evt.target.result));
          console.log('media-chunk-appended');
          PeerStream._sendData("media-chunk", evt.target.result);
      } else {
          console.log("Read error: " + evt.target.error);
          //stop playback
          return;
      }

       PeerStream._fileSourceObject.fileCursor = cursor + chunkSize;
  };
  r.readAsArrayBuffer(blob);
}
