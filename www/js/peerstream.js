var PeerStream = {};
PeerStream.selfId = "";
PeerStream.peerId = "";
PeerStream.peer = "";
PeerStream.peerConnection = "";

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
PeerStream.connect = function(selfId, peerId) {
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

PeerStream.attachMedia = function(sourceObject) {
  //connect to peer
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
  //connect to peer
};

PeerStream.stopCall = function() {
  //connect to peer
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

PeerStream._sendData(event,data){
  var _data = {
    //id : 'some unique id for PeerStream message',
    type : "_data",
    event: event,
    payload : data
  };
  PeerStream.peerConnection.send(_data);
}

PeerStream._onData = function(data) {
 if(data.event == 'audio-chunk'){
   //append to audio buffer
   if(data.data != ""){
    PeerStream._sendData('audio-chunk-ack',"");
   }
 }

 if(data.event == 'audio-chunk-ack'){
   //fetch next audio-chunk from source
   //append to audio buffer
   var audioChunk = "";
   PeerStream._sendData('audio-chunk',audioChunk);
 }
};
