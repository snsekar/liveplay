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
		musicmetadata(file, function (err, result) {
		    if (err){
		      console.log("error id3");
		      throw err;
		    }
		    if (result.picture.length > 0) {
		      console.log("title = " + result.title + " ; pic len = "+result.picture.length + " ; pic data type = "+ (typeof result.picture[0].data));

		      var picture = result.picture[0];
		      var url = URL.createObjectURL(new Blob([picture.data], {'type': 'image/' + picture.format}));
		    //  var image = document.getElementById('myimg');
		    //  image.src = url;
		    album_art_picture = url;//new Blob([picture.data], {'type': 'image/' + picture.format});
				song.album_art_picture = album_art_picture
				angular.forEach($scope.songs, function(value, key){
				     //console.log(key + ': ' + value);
						 if(value.filePath == song.filePath){
							$scope.songs[key].album_art_picture = album_art_picture;
							$("#footerImg").attr("src",album_art_picture);
						 }
				});
		    }
		  });
	$scope.isBuffering = true;
PeerStream.attachSource("file",currentFile);
}
