require("dotenv").config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var Request = require('request');
var keys = require('./keys.js');


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

function twitterSearch(){

	var params = {screen_name: 'matva55'};

	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if(!error){
			console.log(tweets.length);
			var tweet_count = 0
			while(tweet_count < tweets.length){
				console.log('Tweet Number ' + (tweet_count+1) + ': ' + tweets[tweet_count].text);
				console.log('Tweet Number ' + (tweet_count+1) + ' was created at: ' + tweets[tweet_count].created_at + '\n'); 
				tweet_count++;
			}
		}
		else{
			console.log("Error code: " + error[0].code + '. ' + error[0].message);
			return;
		}
	});
}

function spotifySearch(){

	var query = '';

	if(process.argv[3] == undefined){

		query = 'The Sign';

		}
	else{

		query = process.argv[3];

	}

    spotify
	.search({type: 'track', query: query})
	.then(function(response){

		var search_results = response.tracks.items;
		for(var i = 0; i < search_results.length; i++){
			if(search_results[i].name.toUpperCase() != query.toUpperCase()){
				continue;
			}

			console.log('Song name: ' + search_results[i].name);
			console.log('---------------');
			console.log('Album Name: ' + search_results[i].album.name);
			console.log('---------------');
			var artists = search_results[i].artists;
			for(var j = 0; j < artists.length; j++){

				console.log('Artist ' + (j+1) + ': ' + artists[j].name);

					
			}
			console.log('---------------');
			console.log('Preview Link: ' + search_results[i].preview_url);
			console.log('\n');
		}

	}).catch(function(error){

		console.log(error);

	});

}

function omdbSearch(){

	var query = '';
	if(process.argv[3] == undefined){

		query = 'Mr. Nobody';

	}
	else{

		query = process.argv[3];
	}

	Request({
		method: 'GET',
		uri: "http://www.omdbapi.com/?apikey=5dd51277&t=" + query + "&y=&plot=short",
		gzip: true
	}, function(error, response, body){

		console.log(body);
		console.log('Movie Title: ' + body.Title);
		console.log('-----------');
		console.log('Year: '+ body.Year);
		console.log('-----------');
		console.log('IMDB Rating: ' + body.Ratings[0].value);
		console.log('-----------');
		console.log('Rotten Tomatoes Rating' + body.Ratings[1].value);
		console.log('-----------');
		console.log('Country: ' + body.Country);
		console.log('-----------');
		console.log('Language: ' + body.Language);
		console.log('-----------');
		console.log('Plot: ' + body.Plot);
		console.log('-----------');
		console.log('Starring: ' + body.Actors);

	});
}


switch(process.argv[2]){

	case 'my-tweets':

		console.log('Accessing Twitter...\n');
		twitterSearch();
		break;

	case 'spotify-this-song':

		console.log('Accessing Spotify...\n');
		spotifySearch();
		break;

	case 'movie-this':
		console.log('Accessing OMDB...\n');
		omdbSearch();
		break;
	case 'do-what-it-says':
		console.log('Doing');
		break; 
}

