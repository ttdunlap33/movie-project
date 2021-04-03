const apiKeyTaste = "406643-ThomasTD-KL55K15Z";
const apiKeyPoster = "5cecfea7";

var pastSearches = [];

var searchHistoryDiv = document.querySelector("#searchHistory")

//-----Allows the 'switch' to happen once the main card has been clicked-----
$('.contBtn').on('click', function() {
	$('.landingCard').attr('style', 'display: none' );
	$('.searchBar').attr('style', 'display: block' );
	$('.searchHistory').attr('style', 'display: block' );
	$('.footer').attr('style', 'display: block');
});

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

	var getTasteUrl = `https://tastedive.com/api/similar`;

	$.ajax({
		url: getTasteUrl,
		type: 'GET', 
		data: {
			k: apiKeyTaste,
			q: movieName,
			type: "movie",
			info: 1,
			limit: 6,
		},
		dataType: "jsonp"
	}).then (function (response) {

		var similar = response.Similar
		var results = similar.Results
		if (results.length !== 0) {

			saveSearch(movieName);

			for (i = 0; i < results.length; i++) {
				var currentResult = results[i];

				var currentName = currentResult.Name
				var currentWTeaser = currentResult.wTeaser
				var currentWUrl = currentResult.wUrl
				// var currentYID = currentResult.yID
				var currentYUrl = currentResult.yUrl

				//The main Card container
				var divCardEl = $('<div>');
				divCardEl.attr('class', 'card mainCardCont');
				cardCont.append(divCardEl);

				//All things that live in the card Bulma brings padding
				var divCardContent = $('<div>');
				divCardContent.attr('class', 'card-content');
				divCardEl.append(divCardContent);

				//The title of the movie - attr sets bulma
				var divName = $('<div>');
				divName.attr('class', 'card-header is-size-5-mobile is-size-2 has-text-centered');
				divName.text(currentName);
				divCardContent.append(divName)

				//Add column container
				var divColumnsMain = $('<div>');
				divColumnsMain.attr('class', 'columns is-desktop')
				divCardContent.append(divColumnsMain);
				//Add column one
				var divColumnOne = $('<div>');
				divColumnOne.attr('class', 'column')
				divColumnsMain.append(divColumnOne);

				//Container of figure
				var divImgCont = $('<div>');
				divImgCont.attr('class', 'card-image is-flex');
				divColumnOne.append(divImgCont);

				//Container of Img
				var divFigure = $('<figure>');
				divFigure.attr('class', 'poster');
				divFigure.attr("class", "toolTip");
				divImgCont.append(divFigure);
				
				//Tool tip text container for rating
				var spanToolTip = $('<span>');
				spanToolTip.attr('class', 'toolTipText');
				getRotten(currentName, spanToolTip);
				// spanToolTip.text('Hello');
				divFigure.append(spanToolTip);

				//Img el that pulls poster 
				var divImg = document.createElement("img")
				divImg.setAttribute("class", "posterSrc")
				getNewDataPoster(currentName, divImg)
				divFigure.append(divImg);

				//Add column two
				var divColumnTwo = $('<div>');
				divColumnTwo.attr('class', 'column')
				divColumnsMain.append(divColumnTwo);

				//Level container from Bulma
				var divLevel = $('<div>');
				divLevel.attr('class', 'level')
				divColumnTwo.append(divLevel)

				//The link to the wiki for the movie
				var aWikiUrl = $('<a>');
				aWikiUrl.text(`${currentName} Wikipedia Article`)
				aWikiUrl.attr('href', currentWUrl);
				aWikiUrl.attr('class', 'wikiLink  is-size-7 has-text-centered');
				divLevel.append(aWikiUrl);

				//The movie rating ex. PG-13 
				var divMovieRating = $('<div>');
				divMovieRating.attr('class', 'movieRating');
				getMovieRating(currentName, divMovieRating);
				divLevel.append(divMovieRating);

				//The text explaining plot
				var pTeaser = $('<p>');
				pTeaser.attr('class', 'movieText');
				pTeaser.text(currentWTeaser);
				divColumnTwo.append(pTeaser)

				//YT div for responsive
				var divYtCont = $('<div>');
				divYtCont.attr('class', 'video-container');
				divColumnTwo.append(divYtCont);

				//YT embed
				var relatedClip = document.createElement("iframe")
				relatedClip.setAttribute("width", "auto")
				relatedClip.setAttribute("height", "auto")
				relatedClip.setAttribute("frameborder", "0")
				relatedClip.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
				relatedClip.setAttribute("allowfullscreen", "")
				relatedClip.setAttribute("src", currentYUrl)
				divYtCont.append(relatedClip);
			}
		}
	} )
};

//-----Will grab the poster for the movie when hit in for loop-----
// posterArray = [];
function getNewDataPoster(movieName, imgElement) {
	var getPosterUrl = `https://www.omdbapi.com/?t=${movieName}&apikey=${apiKeyPoster}`;
	$.ajax({
		url: getPosterUrl,
		method: 'GET'
	}).then (function(resPoster) {
		//Works every time same exact order
		imgElement.src = resPoster.Poster
		// //Same idea yet random
		// console.log(resPoster.Poster); 
		// //lines 240-246 will be random every time
		// console.log(resPoster.Poster);
		// testObj = {
		// 		title: resPoster.Title
		// 	};
		// 	posterArray.push(testObj);

		// 	console.log(posterArray);
		});
	};
	//Pulls the score for the movie
	function getRotten(movieName, spanElement) {
		var getPosterUrl = `https://www.omdbapi.com/?t=${movieName}&apikey=${apiKeyPoster}`;
		$.ajax({
			url: getPosterUrl,
			method: 'GET'
		}).then (function(resPoster) {
			$(spanElement).text(`Score: ${resPoster.Ratings[1].Value}`);
			});
	}
	//Pulls the movies rating
	function getMovieRating(movieName, divElement) {
		var getPosterUrl = `https://www.omdbapi.com/?t=${movieName}&apikey=${apiKeyPoster}`;
		$.ajax({
			url: getPosterUrl,
			method: 'GET'
		}).then (function(resPoster) {
			$(divElement).text(`Rated: ${resPoster.Rated}`);
			});
	}

	//-----Called when history button is clicked for a movie-----
	var prevSearchHandler = function(event){
			var movie = event.target.getAttribute("movie")
			if (movie){
			// Set the movie input to be our movie
			$('#movieInput').val(movie)
					getDataTaste(movie);
			}
	}

searchHistoryDiv.addEventListener("click", prevSearchHandler)

loadSearchHistory();


//-----Notes and Other code fails-----

// this was for the score to follow the mouse cursor
// 	var tooltipEl = $('.toolTipText');

// 	window.onmousemove = function (e) {
//     var x = e.clientX,
//         y = e.clientY;
// 				tooltipEl.style.top = (y + 20) + 'px';
// 				tooltipEl.style.left = (x + 20) + 'px';
// };


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

