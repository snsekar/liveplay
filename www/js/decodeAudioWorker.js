
function sendMessage(msg){
	self.postMessage(msg);
}
self.addEventListener('message', function(e) {
		var fileChunk = e.data.fileChunk;
		self.postMessage(fileChunk.byteLength);
		var msg = "";
		var context = e.data.audioContext;
		if(context){
			self.postMessage("yes");
		}else{
		self.postMessage("no");
		}
		context.decodeAudioData(fileChunk, function(buffer) {
		sendMessage('chunk decoded ');
		self.postMessage(buffer);
		});
 
}, false);