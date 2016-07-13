function startBuffering() {
//console.log('start buffering');
	

	if(isApp){
		window.resolveLocalFileSystemURL("file://" + song.filePath, gotFileEntry, addError);
		//console.log('fileurl resolved');
	}else{
		gotFile(selectedFileWeb);
	}
}
 
function addError(error) {
    console.log("Filesystem  error: " + error.code + ", " + error.message);
}

function gotFileEntry(fileEntry) {
    // console.log('file entry success ' );
    fileEntry.file(gotFile, addError);

}

function gotFile(file) { 
	resetPlayBack();
    currentFile = file;
	$scope.isBuffering = true;
    fetchNextFileChunk(writeToPlayBuffer);  

}

function appendBuffer( buffer1, buffer2 ) {
  var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength );
  tmp.set( new Uint8Array( buffer1 ), 0 );
  tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength );
  return tmp.buffer;
}

function fetchNextFileChunk(writeToPlayBuffer) {
    var fileSize = currentFile.size;
    var self = this; // we need a reference to the current object
    var block = null;

    var foo = function(evt) {
        if (evt.target.error == null) {
            //console.log("chunk fetched");
            //fullFileBuffer = appendBuffer(fullFileBuffer,evt.target.result);

            writeToPlayBuffer(evt.target.result,true); // callback for handling read chunk
        } else {
            console.log("Read error: " + evt.target.error);
            return;
        }
        if (offset >= fileSize) { 
            console.log(" *** Done reading file *** ");
            endOfFile = true;
            nextChunkBuffer = 0;
            return;
        }

        //block(offset, chunkSize, currentFile);
    }

    block = function(_offset, length, _file) {
        //console.log("offset = "+_offset+" length = "+length);
        var r = new FileReader();
        var blob = _file.slice(_offset, length + _offset);
        r.onload = foo;
        r.readAsArrayBuffer(blob);
    }

    block(offset, chunkSize, currentFile);
}

var writeToPlayBuffer = function(fileChunk,send) {
/*
	if(isApp){ 
		function win(writer) {
			writer.onwrite = function(evt) {
				//console.log("chunk write success");
				if(send && !isStartPlay){
				if(fileChunk.byteLength != 0){
				console.log('sending file chunk : offset = '+offset+' length = '+fileChunk.byteLength);
					sendToPeer({
						action: 'file-chunk',
						data: fileChunk
					});
					}else{
						console.log('Empty file chunk. Not sent');
						sendToPeer({
							action: 'buffering-done'
						});
						$scope.isBuffering = false;
						$scope.$digest();
					}
				}
					if(!send)
					{
					playSong();
					sendToPeer({
						 action: 'send-next-file-chunk'
					 });
					}
				
			};
			if (isStartPlay) {
				isStartPlay = false;
			} else {
				writer.seek(writer.length);
			}
			writer.write(fileChunk);
		};

		var fail = function(evt) {
			console.log('error ' + JSON.stringify(evt));
		};

		function songFileEntry(entry) {
			//console.log('start create song file');
			entry.file(gotBufferFile, fail);
			entry.createWriter(win, fail);

		}

		function gotBufferFile(bfile) {
			//console.log('got buffer file');
			currentBufferFile = bfile;
		}

		function gotDir(dirEntry) {
			//console.log('got dir');
			dirEntry.getFile("song.mp3", {
				create: true
			}, songFileEntry, fail);
		}
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory, gotDir, fail);
		}else{
		*/
			//bufferBlob = appendBuffer(bufferBlob,fileChunk);
			if (isStartPlay) {
				isStartPlay = false;
				var audio = document.getElementById('audio_player');
				audio.src = window.URL.createObjectURL(ms);
				ms.addEventListener('sourceopen', function(e) {
				  sourceBuffer = ms.addSourceBuffer('audio/mpeg');
				  sourceBuffer.appendBuffer(new Uint8Array(fileChunk));
				  console.log(myid+' : fileChunk appended');
				  audio.play();
				  console.log(myid+' : playing');

				}, false);
			}else{
				sourceBuffer.appendBuffer(new Uint8Array(fileChunk));
   			  console.log(myid+' : fileChunk appended');

			}			
			if(!send)
			{
			playSong();			
			sendToPeer({
				 action: 'send-next-file-chunk'
			 });
			}
				if(send && !isStartPlay){
				//console.log(fileChunk.byteLength);
				if(fileChunk.byteLength != 0){
				//console.log('sending file chunk : offset = '+offset+' length = '+fileChunk.byteLength);
					sendToPeer({
						action: 'file-chunk',
						data: fileChunk
					});
					}else{
						console.log('Empty file chunk. Not sent');
						sendToPeer({
							action: 'buffering-done'
						});
						$scope.isBuffering = false;
						$scope.$digest();
						
						}
				}
			
			/*
			playSong();
			if(!endOfFile && !isStartPlay){ 
				offset += chunkSize;
				fetchNextFileChunk(writeToPlayBuffer);
			}
*/
		
	//	}

  

}