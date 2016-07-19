var PeerStream = function (selfId) {
  this.selfId = selfId;
  this.peerId;
  this.peerConnection;
  this.onConnectedHandler;
  this.onPeerConnectedHandler;
  this.peer = new Peer(selfId, {
      key: 'iulf39j4p5w2ke29'
  });
  this.peer.on('open', function() {
    this.onConnectedHandler.call();
  });
  this.peer.on('connection', function(connection) {
    this.peerConnection = connection
    this.onPeerConnectedHandler.call();
  });
};

PeerStream.prototype.onConnected = function(eventHandler) {
  this.onConnectedHandler = eventHandler;
};

PeerStream.prototype.connectToPeer = function(peerId) {
  this.peerId = peerId;
  this.peerConnection = this.peer.connect(peerId, {
      label: "file",
      reliable: true
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

};

PeerStream.prototype.signal = function(message) {
  //connect to peer
};

PeerStream.prototype.error = function(message) {
  //connect to peer
};
