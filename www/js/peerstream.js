var _peer;
var PeerStream = function () {
  this.selfId;
  this.peerId;
  this.peerConnection;

  this.onConnectedHandler;
  this.onPeerConnectedHandler;
  this.onChatHandler;


  // this.peer.on('connection', function(connection) {
  //   this.peerConnection = connection;
  //   this.peerConnection.on('data', function(data) {
  //     if(data.type == 'chat'){
  //       this.onChatHandler.call(data.payload);
  //     }
  //   });
  //   this.onPeerConnectedHandler.call();
  // });

};
PeerStream.prototype.connect = function(selfId) {
  this.selfId = selfId;
  _peer = new Peer(selfId, {
      key: 'iulf39j4p5w2ke29'
  });
  _peer.on('open', function(id) {
    console.log('self connected id = '+id);
    this.onConnectedHandler.call();
  });
};
PeerStream.prototype.onConnected = function(eventHandler) {
  this.onConnectedHandler = eventHandler;
};

PeerStream.prototype.connectToPeer = function(peerId) {
  this.peerId = peerId;
  this.peerConnection = _peer.connect(peerId, {
      label: "file",
      reliable: true
  });
  this.peerConnection.on('open', function() {
  // Receive messages
    this.peerConnection.on('data', function(data) {
      console.log('Received', data);
        this.onOnChatHandler.call();
    });
  });
  this.onPeerConnectedHandler.call();
};

PeerStream.prototype.onPeerConnected = function(eventHandler) {
  this.onPeerConnectedHandler = eventHandler;
};


PeerStream.prototype.disConnect = function(peerId) {
  //disConnect from peer
};

PeerStream.prototype.attachSource = function(sourceObject) {
  //connect to peer
};

PeerStream.prototype.play = function() {
  //connect to peer
};

PeerStream.prototype.pause = function() {
  //connect to peer
};

PeerStream.prototype.seek = function(seekedTime) {
  //connect to peer
};

PeerStream.prototype.stop = function() {
  //connect to peer
};

PeerStream.prototype.startCall = function() {
  //connect to peer
};

PeerStream.prototype.stopCall = function() {
  //connect to peer
};

PeerStream.prototype.chat = function(message) {
  var data = {
    //id : 'some unique id for this message',
    type : 'chat',
    payload : message
  };
  this.peerConnection.send(data);
};

PeerStream.prototype.onChat = function(eventHandler) {
  this.onChatHandler = eventHandler;
};

PeerStream.prototype.signal = function(message) {
  //connect to peer
};

PeerStream.prototype.error = function(message) {
  //connect to peer
};
