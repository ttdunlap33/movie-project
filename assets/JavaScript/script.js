const apiKeyTaste = "406643-ThomasTD-KL55K15Z";
const apiKeyPoster = "5cecfea7";

var pastSearches = [];

var searchHistoryDiv = document.querySelector("#searchHistory")

var cardCont = $('.cardContainer');
$('#movieInput').keypress(function (event) {
	if (event.which == 13) {
		var movieName = $(this).val();
		getDataTaste(movieName);
	}
});

function capitalizeName(movieName) {
	// the avengers
	var nameList = movieName.split(" ")
	// [the, avengers]

	var capitalizedList = []

	for (i = 0; i < nameList.length; i++) {
		// i = 0 -> the
		// i = 1 -> avengers
		var current = nameList[i]
		// i = 0 -> T + he
		// i = 1 -> A + vengers
		var capitalized = current[0].toUpperCase() + current.slice(1)
		// Add capitalized term to array
		capitalizedList[i] = capitalized
	}

	//[The, Avengers] -> The Avengers
	return capitalizedList.join(" ")
}

function getMovieName() {
	var movieName = $('#movieInput').val();
	getDataTaste(movieName);
}

function addButton(movieName) {
	prevSearchEl = document.createElement("button");
	prevSearchEl.textContent = movieName;
	// Define classes of the added buttons
	prevSearchEl.classList = "is-rounded button is-small is-outlined"
	prevSearchEl.setAttribute("movie", movieName)
	prevSearchEl.setAttribute("type", "submit");
	
	searchHistoryDiv.prepend(prevSearchEl)
}


// loading search history - populate buttons
function loadSearchHistory() {
	pastSearches = JSON.parse(localStorage.getItem("movies"))
	if (pastSearches) {
		for (i = 0; i < pastSearches.length; i++) { 
			addButton(pastSearches[i])
		}
	}
	else {
		pastSearches = [];
	}
}

function saveSearch(movieName) {
	var oldLength = pastSearches.length

	// saving searches to movie var

	// 300, american hustle

	// Trying to add gravity

	// Set = 300, american hustle
	var tempSet = new Set(pastSearches)
	// Add gravity -> set = 300, american hustle
	tempSet.add(movieName)
	// Set -> Array = 300, american hustle, gravity
	pastSearches = Array.from(tempSet)

	var newLength = pastSearches.length

	localStorage.setItem("movies", JSON.stringify(pastSearches))
//showing buttons
	if (oldLength != newLength) {
		addButton(movieName)
	}
}

function getDataTaste (movieName) {
	cardCont.empty();

	movieName = capitalizeName(movieName)
	console.log(movieName)

	var getTasteUrl = `https://tastedive.com/api/similar`;
	// var getTasteUrl = `https://tastedive.com/api/similar?info=1&limit=5&q=${movieName}&k=${apiKeyTaste}`;

	// https://github.com/HoodiesUnited/music-app/blob/master/taste-dive-examples.html

	$.ajax({
		url: getTasteUrl,
		type: 'GET', 
		data: {
			k: apiKeyTaste,
			q: movieName,
			type: "movie",
			info: 1,
			limit: 3,
		},
		dataType: "jsonp"
	}).then (function (response) {

		console.log(response)
		
		var similar = response.Similar
		var results = similar.Results
		if (results.length !== 0) {

			saveSearch(movieName);

			// var name = info.Name
			// var wTeaser = info.wTeaser
			// var wUrl = info.wUrl
			// var yID = info.yID
			// var yUrl = info.yUrl

			for (i = 0; i < results.length; i++) {
				var currentResult = results[i];

				var currentName = currentResult.Name
				var currentWTeaser = currentResult.wTeaser
				var currentWUrl = currentResult.wUrl
				var currentYID = currentResult.yID
				var currentYUrl = currentResult.yUrl

				// Code to display related movies here
				var divCardEl = $('<div>');
				divCardEl.attr('class', 'card');
				cardCont.append(divCardEl);

				var divCardContent = $('<div>');
				divCardContent.attr('class', 'card-content');
				divCardEl.append(divCardContent);

				var divName = $('<div>');
				divName.attr('class', 'card-header');
				divName.text(currentName);
				divCardContent.append(divName)

				var divImgCont = $('<div>');
				divImgCont.attr('class', 'card-image');
				divCardContent.append(divImgCont);

				var divFigure = $('<figure>');
				divFigure.attr('class', 'image is-3by4 poster');
				divCardContent.append(divFigure);


				var divImg = document.createElement("img")
				divImg.setAttribute("class", "posterSrc")

				// var divImg = $('<img>');
				// divImg.attr('class', 'posterSrc');
				// divImg.data('movieName', currentName );
				// divImg.data('index', i );
				// console.log(divImg.data('index'));

				getNewDataPoster(currentName, divImg)
				divFigure.append(divImg);

				var pTeaser = $('<p>');
				pTeaser.text(currentWTeaser);
				divCardContent.append(pTeaser)
				
				var aWikiUrl = $('<a>');
				aWikiUrl.text(`${currentName} Wikipedia Article`)
				aWikiUrl.attr('href', currentWUrl);
				divCardContent.append(aWikiUrl);
				
				var relatedClip = document.createElement("iframe")
				relatedClip.setAttribute("width", "500")
				relatedClip.setAttribute("height", "300")
				relatedClip.setAttribute("frameborder", "0")
				relatedClip.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
				relatedClip.setAttribute("allowfullscreen", "")
				relatedClip.setAttribute("src", currentYUrl)
				divCardContent.append(relatedClip);
				console.log(currentName);
			}
			// getDataPoster();
		}
	} )
};

function getNewDataPoster(movieName, imgElement) {
	var getPosterUrl = `https://www.omdbapi.com/?t=${movieName}&apikey=${apiKeyPoster}`;
	$.ajax({
		url: getPosterUrl,
		method: 'GET'
	}).then (function(resPoster) {
		imgElement.src = resPoster.Poster
	})
}

// var postArray = [];
// function getDataPoster () {
// 	postArray = [];
// 	// console.log(posterArray);
// 	$('.posterSrc').each(function(){
// 		var movieHolder = $(this).data('movieName');
// 		// console.log(movieHolder);

// 		var getPosterUrl = `https://www.omdbapi.com/?t=${movieHolder}&apikey=${apiKeyPoster}`;
		
// 		$.ajax({
// 			url: getPosterUrl,
// 			method: 'GET'
// 		}).then (function(resPoster) {
// 			console.log($('.posterSrc').data('movieName'));

// 			if ($('.posterSrc').data('movieName') == resPoster.Title) {

// 				$(this).attr('src', resPoster.Poster);
// 			}
// 		})
// 	})//end of .each
// 	};

// pulls but it pulls random order------------------------------------------- 
// var postArray = [];
// function getDataPoster () {
// 	postArray = [];
// 	// console.log(posterArray);
// 	$('.posterSrc').each(function(){
// 		var movieHolder = $(this).data('movieName');
// 		// console.log(movieHolder);

// 		var getPosterUrl = `https://www.omdbapi.com/?t=${movieHolder}&apikey=${apiKeyPoster}`;
		
// 		$.ajax({
// 			url: getPosterUrl,
// 			method: 'GET'
// 		}).then (function(resPoster) {
// 			// console.log(resPoster);
// 			postObj = {
// 				title: resPoster.Title,
// 				rated: resPoster.Rated,
// 				poster: resPoster.Poster,
// 				percent: resPoster.Ratings[1].Value
// 			};
// 			postArray.push(postObj);
// 		})
// 	})//end of .each

// 	setTimeout(function(){
// 		console.log(postArray);
// 		$('img').each(function(index){
// 			if (index == $(this).data('index')) {
// 				// console.log(index + " " +$(this).data('movieName'));
// 				$(this).attr('src', postArray[index].poster);
// 			}
// 		})
// 	},1000);
// 	};

// tried with for loop above----------------------------------------------
// var postArray = [];
// function stashArray(currentName) {
// 	var getPosterUrl = `https://www.omdbapi.com/?t=${currentName}&apikey=${apiKeyPoster}`;
// 	$.ajax({
// 		url: getPosterUrl,
// 		method: 'GET'
// 	}).then (function(resPoster) {
// 		var title = resPoster.Title
// 		var	rated = resPoster.Rated
// 		var	poster = resPoster.Poster
// 		var	percent = resPoster.Ratings[1].Value
// 		postObj = {
// 			title: title,
// 			rated: rated,
// 			poster: poster,
// 			percent: percent
// 		};
// 		postArray.push(postObj);
// 		console.log(postArray);
// 	})
// };


// when then fail --------------------------------------------------------

// var postArray = [];
// function getDataPoster () {
// 	postArray = [];
// 	// console.log(posterArray);
// 	$('.posterSrc').each(function(){
// 		var movieHolder = $(this).data('movieName');
// 		// console.log(movieHolder);

// 		var getPosterUrl = `https://www.omdbapi.com/?t=${movieHolder}&apikey=${apiKeyPoster}`;
		
// 		$.ajax({
// 			url: getPosterUrl,
// 			method: 'GET'
// 		}).then (function(resPoster) {
// 			console.log(resPoster);
// 			postObj = {
// 				title: resPoster.Title,
// 				rated: resPoster.Rated,
// 				poster: resPoster.Poster,
// 				percent: resPoster.Ratings[1].Value
// 			};
// 			postArray.push(postObj);
// 		})
// 	})//end of .each

// 	setTimeout(function(){
// 		console.log(postArray);
// 		$('img').each(function(index){
// 			if (index == $(this).data('index')) {
// 				// && $(this).data('movieName') === $(this)
// 				// console.log(index + " " +$(this).data('movieName'));
// 				$(this).attr('src', postArray[index].poster);
// 			}
// 		})
// 	},2000);
// 	};

// Called when clicking search button
var prevSearchHandler = function(event){
    var movie = event.target.getAttribute("movie")
    if (movie){
		// Set the movie input to be our movie
		$('#movieInput').val(movie)
        getDataTaste(movie);
    }
}

// original ------------------------------------------------------------------
	// var posterArray = [];
	// posterArray.push(responsePoster.Poster);
	// console.log(posterArray);
	// console.log($('.card-header').siblings('.posterSrc').data());
	// $('.card-header').siblings('.posterSrc').attr('src', responsePoster.Poster);
	// $(this).siblings('.posterSrc').attr('src', responsePoster.Poster);



//https://tastedive.com/api/similar?{query string}
//# Example query - recommendations of movie Guardians Of The Galaxy Vol. 2.
//https://tastedive.com/api/similar?q=Guardians Of The Galaxy Vol. 2

//API KEY
// https://tastedive.com/api/similar?{query}={value}&k=406643-ThomasTD-0P36EQQY 

// # Example query
// https://tastedive.com/api/similar?info=1&q=Thor: Ragnarok&k=YOUR API-KEY


// Items ---Information
// wTeaser---item description
// wUrl	item--- Wikipedia URL
// yUrl	item--- Youtube clip URL
// yID	item--- Youtube clip ID

// {
// "Similar": {
//     "Info": [
//         {
//             "Name": "Thor: Ragnarok",
//             "Type": "movie",
//             "wTeaser": "\n\n\nThor: Ragnarok is a 2017 American superhero film based on the Marvel Comics character Thor, produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures. It is the sequel to 2011's Thor and 2013's Thor: The Dark World, and the seventeenth film in the Marvel Cinematic Universe (MCU). The film is directed by Taika Waititi from a screenplay by Eric Pearson and the writing team of Craig Kyle and Christopher Yost, and stars Chris Hemsworth as Thor alongside Tom Hiddleston, Cate Blanchett, Idris Elba, Jeff Goldblum, Tessa Thompson, Karl Urban, Mark Ruffalo, and Anthony Hopkins. In Thor: Ragnarok, Thor must escape the alien planet Sakaar in time to save Asgard from Hela and the impending Ragnarök.\n",
//             "wUrl": "https://en.wikipedia.org/wiki/Thor:_Ragnarok",
//             "yUrl": "https://www.youtube-nocookie.com/embed/ue80QwXMRHg",
//             "yID": "ue80QwXMRHg"
//         }
//     ],
//     "Results": [
//         {
//             "Name": "Avengers: Infinity War",
//             "Type": "movie",
//             "wTeaser": "\n\n\n\nAvengers: Infinity War is a 2018 American superhero film based on the Marvel Comics superhero team the Avengers, produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures. It is the sequel to 2012's The Avengers and 2015's Avengers: Age of Ultron, and the nineteenth film in the Marvel Cinematic Universe (MCU). It was directed by Anthony and Joe Russo, written by Christopher Markus and Stephen McFeely, and features an ensemble cast including Robert Downey Jr., Chris Hemsworth, Mark Ruffalo, Chris Evans, Scarlett Johansson, Benedict Cumberbatch, Don Cheadle, Tom Holland, Chadwick Boseman, Paul Bettany, Elizabeth Olsen, Anthony Mackie, Sebastian Stan, Danai Gurira, Letitia Wright, Dave Bautista, Zoe Saldana, Josh Brolin, and Chris Pratt. In the film, the Avengers and the Guardians of the Galaxy attempt to stop Thanos from collecting the all-powerful Infinity Stones.\n",
//             "wUrl": "https://en.wikipedia.org/wiki/Avengers:_Infinity_War",
//             "yUrl": "https://www.youtube-nocookie.com/embed/QwievZ1Tx-8",
//             "yID": "QwievZ1Tx-8"
//         }
//     ]
// }
searchHistoryDiv.addEventListener("click", prevSearchHandler)

loadSearchHistory();
