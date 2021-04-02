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
			limit: 6,
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
				divFigure.attr('class', 'image is-3by2 poster');
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
				relatedClip.setAttribute("width", "auto")
				relatedClip.setAttribute("height", "auto")
				relatedClip.setAttribute("frameborder", "0")
				relatedClip.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
				relatedClip.setAttribute("allowfullscreen", "")
				relatedClip.setAttribute("src", currentYUrl)
				divCardContent.append(relatedClip);
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

searchHistoryDiv.addEventListener("click", prevSearchHandler)

loadSearchHistory();