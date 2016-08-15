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
    currentFile = file;
	$scope.isBuffering = true;
PeerStream.attachSource("file",currentFile);
}
