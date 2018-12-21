require("dotenv").config();
var keys = require("./key.js");
var input = require("inquirer");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

input.prompt([{
  type: "list",
  message: "Pick one of the following to find something cool",
  choices: ["Spotify", "Movie", "Concert", "Stuff to Do"],
  name: "selection"
}]).then(function (selectResponse) {
  var choice = selectResponse.selection;
  if (choice === "Spotify") {
    spotifyThis();
  } else if (choice === "Concert") {
    concertThis();
  } else if (choice === "Movie") {
    movieThis();
  } else if (choice === "StuffToDo") {
    doThis();
  }
});

function movieThis() {
  input.prompt([{
    type: "input",
    message: "What movie would you like to find?",
    name: "movie"
  }]).then(function (Response) {
    if (Response.movie === '') {
      axios.get("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=f96eaf82")
        .then(Response => {

          if (Response.data.Response === "False") {
            console.log(Response.data.erroror);
            return;
          }
          console.log("------------------")
          console.log("Title: " + Response.data.Title);
          console.log("Year: " + Response.data.Year);
          console.log("Rated: " + Response.data.Rated);
          console.log("IMDB Rating: " + Response.data.Ratings.Value[1]);
          console.log("Country " + Response.data.Country);
          console.log("Language: " + Response.data.Language);
          console.log("Plot: " + Response.data.Plot);
          console.log("Actor: " + Response.data.Actors);
          console.log("------------------")
        });
    } else {
      axios.get("http://www.omdbapi.com/?t=" + Response.movie + "&y=&plot=short&apikey=f96eaf82")
        .then(Response => {

          if (Response.data.Response === "False") {
            console.log(Response.data.erroror);
            return;
          }
          console.log("---------------------");
          console.log("Title: " + Response.data.Title);
          console.log("Year: " + Response.data.Year);
          console.log("IMDB Rating: " + Response.data.imdbRating);
          console.log("Rotten Tomatoes Rating: " + Response.data.Ratings[2].Value);
          console.log("Country: " + Response.data.Country);
          console.log("Language " + Response.data.Language);
          console.log("Plot: " + Response.data.Plot);
          console.log("Actors: " + Response.data.Actors);
          console.log("---------------------");
        });
    }
  });
}

function spotifyThis() {
  input.prompt([{
    type: "input",
    message: "What song would you like to play on Spotify?",
    name: "song"
  }]).then(function (Response) {
    if (Response.song === '') {
      spotify.search({
        type: "track",
        query: "The Sign, Ace of Base",
        limit: 1
      }, (error, Response) => {
        console.log("------------------")
        console.log("Artist Name: " + Response.tracks.items[0].artists[0].name);
        console.log("Name: " + Response.tracks.items[0].name);
        console.log("Album Name: " + Response.tracks.items[0].album.name);
        console.log("URL: " + Response.tracks.items[0].external_urls.spotify);
        console.log("------------------")
      });
    } else {
      spotify.search({
        type: "track",
        query: Response.song,
        limit: 1
      }, (error, Response) => {
        if (Response.tracks.items.length === 0) {
          spotify.search({
            type: "track",
            query: "The Sign, Ace of Base",
            limit: 1
          }, (error, Response) => {
            console.log("------------------")
            console.log("Artist Name: " + Response.tracks.items[0].artists[0].name);
            console.log("Name: " + Response.tracks.items[0].name);
            console.log("Album Name: " + Response.tracks.items[0].album.name);
            console.log("URL: " + Response.tracks.items[0].external_urls.spotify);
            console.log("------------------")
          });
        } else {
          console.log("Artist Name: " + Response.tracks.items[0].artists[0].name);
          console.log("Name: " + Response.tracks.items[0].name);
          console.log("Album Name: " + Response.tracks.items[0].album.name);
          console.log("URL: " + Response.tracks.items[0].external_urls.spotify);
        }
      });
    }
  });
}

function doThis() {
  fs.readFile("./random.txt", (error, data) => {
    spotify.search({
      type: "track",
      query: data,
      limit: 1
    }, (error, Response) => {
      console.log(Response.tracks.items[0].artists[0].name);
      console.log(Response.tracks.items[0].name);
      console.log(Response.tracks.items[0].album.name);
      console.log(Response.tracks.items[0].external_urls.spotify);
    });
  });
}