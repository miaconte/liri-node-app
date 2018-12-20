require("dotenv").config();
var axios = require ("axios"); 
var moment = require ("moment");
var keys = require("./key.js");
var fs = require ("fs");

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var param = process.argv[3];

if (command === "concert-this") {
  let artist = process.argv[3];
  axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=6c8bdd346ff8270ddcb47d075b6a088e").then(function(response){
      console.log(response.data[0].venue.name);
      console.log(response.data[0].venue.city);
      console.log(moment(response.data[0].datetime).format("MM/DD/YYYY"));
   });
  }

  if (command === "movie-this"){
    let movie = process.argv[2];
    axios.get("http://www.omdbapi.com/?t="+ name +"&y=&plot=short&apikey="+this.key)
  }

  var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});


function spotifyThis(songName) {

    spotify.search({
        type: 'track',
        query: songName,
        limit: 10
    }, 
    function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("artist name  :", data.tracks.items[0].album.artists[0].name);
        console.log("song name: ", data.tracks.items[0].name);
        console.log("preview url: ", data.tracks.items[0].href);
        console.log("Album name", data.tracks.items[0].album.name);
        var songResult = [];
        data.tracks.items.forEach(e => {
            var song = {
                'Artist_name': e.album.artists[0].name,
                'Song_Name': e.name,
                'Preview_Url': e.href,
                'Album_Name': e.name
            }
            songResult.push(song);
        });

        const table = cTable.getTable(songResult);

        console.log(table);


        fs.appendFile("log.txt", "\n" + table, function (err) {
            if (err) {
                return console.log(err);
            } else {
                console.log("log.txt was updated");
            }
        });
    });
}