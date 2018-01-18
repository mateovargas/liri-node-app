
//Initializes necessary Node packages.
require("dotenv").config();
var Twitter = require('twitter'); 
var Spotify = require('node-spotify-api');
var Request = require('request');
var keys = require('./keys.js');
var file_system = require('fs');

//Initializes Spotify and twitter objects with information from Keys.js
var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

var line_break = '---------------';

//Function that prints out the last twenty tweets from the specified account for this application.
//It then writes those tweets to the log.txt file. At the moment, linked to my personal acct.
function twitterSearch(){

	//Provides screen name for twitter usage.
	var params = {screen_name: 'matva55'};

	//built in function that gets the last 20 tweets from the specified user's timeline.
	twitter.get('statuses/user_timeline', params, function(error, tweets, response){
		
		//Checks if there is an error and if not, proceeds to print out the tweets.
		if(!error){

			var tweet_count = 0
			while(tweet_count < tweets.length){

				var tweet_string = 'Tweet Number ' + (tweet_count+1) + ': ' + tweets[tweet_count].text;
				var tweet_date = 'Tweet Number ' + (tweet_count+1) + ' was created at: ' + tweets[tweet_count].created_at;

				console.log(tweet_string);
				writeFile(tweet_string);

				console.log(line_break);
				writeFile(line_break);

				console.log(tweet_date);
				writeFile(tweet_date);

				tweet_count++;

			}
		}
		else{

			console.log("Error code: " + error[0].code + '. ' + error[0].message);
			return;

		}
	});
}

//Function that takes in a string for the song name to search and
//then prints out the top hits from Spotify's api 
//for that particular title. Defaults to
//Ace of Base's 'The Sign' if no input from command line.
function spotifySearch(song_to_find){

	var query = '';

	if(song_to_find == undefined){

		query = 'The Sign';

		}
	else{

		query = song_to_find;

	}

	//Searches spotify's database for the specific song title. For each result
	//Prints out the title, album, artists, and preview link. 
    spotify
	.search({type: 'track', query: query})
	.then(function(response){

		var search_results = response.tracks.items;
		for(var i = 0; i < search_results.length; i++){
			if(search_results[i].name.toUpperCase() != query.toUpperCase()){

				continue;

			}
			var song_name_string = 'Song name: ' + search_results[i].name;
			var album_name_string = 'Album Name: ' + search_results[i].album.name;
			var preview_link_string = 'Preview Link: ' + search_results[i].preview_url;

			console.log(song_name_string);
			writeFile(song_name_string);

			console.log(line_break);
			writeFile(line_break);

			console.log(album_name_string);
			writeFile(album_name_string);

			console.log(line_break);
			writeFile(line_break);

			var artists = search_results[i].artists;
			for(var j = 0; j < artists.length; j++){

				var artist_name_string = 'Artist ' + (j+1) + ': ' + artists[j].name;
				console.log(artist_name_string);
				writeFile(artist_name_string);

			}

			console.log(line_break);
			writeFile(line_break);

			console.log(preview_link_string);
			writeFile(preview_link_string);

			console.log(line_break);
			writeFile(line_break);
		}

	}).catch(function(error){

		console.log(error);

	});

}

//Function that searches the OMDB database for a given movie.
//Uses the Node Request to reach OMDB database and prints out the
//title, year, ratings, country, language, plot, and actors.
function omdbSearch(movie_to_find){

	var query = '';
	if(movie_to_find == undefined){

		query = 'Mr. Nobody';

	}
	else{

		query = movie_to_find;
	}

	Request({
		method: 'GET',
		uri: "http://www.omdbapi.com/?apikey=5dd51277&t=" + query + "&y=&plot=short",
		gzip: true
	}, function(error, response, body){

		var movie = JSON.parse(body);
		var title_string = 'Movie Title: ' + movie.Title;
		var year_string = 'Year: ' + movie.Year;
		var imdb_string = 'IMDB Rating: ' + movie.Ratings[0].Value;
		var rt_string = 'Rotten Tomatoes Rating: ' + movie.Ratings[1].Value;
		var country_string = 'Country: ' + movie.Country;
		var language_string = 'Language: ' + movie.Language;
		var plot_string = 'Plot: ' + movie.Plot;
		var actors_string = 'Starring: ' + movie.Actors;

		console.log(title_string);
		writeFile(title_string);

		console.log(line_break);
		writeFile(line_break);

		console.log(year_string);
		writeFile(year_string);

		console.log(line_break);
		writeFile(line_break);

		console.log(imdb_string);
		writeFile(imdb_string);

		console.log(line_break);
		writeFile(line_break);

		console.log(rt_string);
		writeFile(rt_string);

		console.log(line_break);
		writeFile(line_break);

		console.log(country_string);
		writeFile(country_string);

		console.log(line_break);
		writeFile(line_break);

		console.log(language_string);
		writeFile(language_string);

		console.log(line_break);
		writeFile(line_break);

		console.log(plot_string);
		writeFile(plot_string);

		console.log(line_break);
		writeFile(line_break);

		console.log(actors_string);
		writeFile(actors_string);

		console.log(line_break);
		writeFile(line_break);

	});
}

//Function that reads from random.txt and completes the commands
//that are in the file. The commands are the commands possible
//from the command line.
function readFile(){

	file_system.readFile('random.txt', 'utf8', function(err, data){

		if(err){
			console.log(err);
		}

		var command = data.split('\n');
		command.forEach(function(string){

			var order = string.split(',');

			if(order[0] == 'my-tweets' && order[1] == ''){

				twitterSearch();

			}
			else if(order[0] == 'spotify-this-song'){

				spotifySearch(order[1]);

			}
			else if(order[0] == 'movie-this'){

				omdbSearch(order[1]);
			}

		})
	});
}

//Function that continually updates the logfile with a string
function writeFile(string_to_write){

	var logger = file_system.createWriteStream('log.txt', {'flags': 'a'});
	logger.write(string_to_write + '\n');
	logger.end();

}

//Switch case to decide which command to run
switch(process.argv[2]){

	case 'my-tweets':

		console.log('Accessing Twitter...\n');
		twitterSearch();
		break;

	case 'spotify-this-song':

		console.log('Accessing Spotify...\n');
		spotifySearch(process.argv[3]);
		break;

	case 'movie-this':
		console.log('Accessing OMDB...\n');
		omdbSearch(process.argv[3]);
		break;
	case 'do-what-it-says':
		console.log('Your wish is my command, master...');
		readFile();
		break; 
}

