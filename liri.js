require("dotenv").config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var Request = require('request');
var keys = require('./keys.js');


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

function twitterSearch(){

	console.log('Checking tweets');
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

function spotifyRequest(query){
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

function spotifySearch(){

	var query = '';
	if(process.argv[3] == undefined){
		query = 'The Sign';
		}
	else{
		query = process.argv[3];
	}

	spotifyRequest(query);

}


switch(process.argv[2]){

	case 'my-tweets':

		console.log('Checking tweets');
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
		break;

	case 'spotify-this-song':

		spotifySearch();
		console.log('Checking spotify');
		break;

	case 'movie-this':
		console.log('Checking OMDB');
		break;
	case 'do-what-it-says':
		console.log('Doing');
		break; 
}

