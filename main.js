console.log("TEST");
init();

// Main logic

var pmsServer;
var pmsPort;
var pmsAddress;
var pmsToken;

var movie;
var letterboxdLink;

function init() {

	// Init the server data
	assignServer();
	assignPort();
	assignToken();
	pmsAddress = pmsServer + ":" + pmsPort;
	console.log("[Letterplex] Server data OK");

	// Init the movie data
	movie = getMovie();
	var req = new XMLHttpRequest();
	req.open('GET', 'http://' + pmsAddress + "/library/metadata/" + movie.ID + "?X-Plex-Token=" + pmsToken, false); 
	req.send(null);
	if (req.status == 200) {
  		var xmlResponse = parseXml(req.responseText);
  		var jsonResponse = xmlToJson(xmlResponse);
  		var movieGuid = jsonResponse.MediaContainer.Video["@attributes"].guid;

  		// Check if IMDB data...
  		if(movieGuid.indexOf('imdb') > 0){
  			movie.metadata.type = 'imdb';
  			var tempGuid = movieGuid.split('imdb://');
  			tempGuid = tempGuid[1];
  			var auxGuid = tempGuid.split('?');
  			tempGuid = auxGuid[0];
  			movie.metadata.ID = tempGuid;
  		}

  		// @TODO - Check other sources...

  		constructLink();
	}
}

function assignServer() {
	var server = window.location.host;
	server = server.split(":");
	pmsServer = server[0];
}

function assignPort() {
	var server = window.location.host;
	server = server.split(":");
	pmsPort = server[1];
}

function assignToken() {
	pmsToken = JSON.parse(localStorage.getItem("users")).users[0].authToken;
}

function getMovie(){
	var url = document.URL;
	var movie_id = url.split('%2Flibrary%2Fmetadata%2F');
	movie_id = parseInt(movie_id[1]);
	return new Movie(movie_id);
}

function constructLink() {
	letterboxdLink = 'https://letterboxd.com/search/' + movie.metadata.ID + "/";
}

function getServer(){

}