const apiKeyTaste = "406643-ThomasTD-KL55K15Z";
const apiKeyPoster = "5cecfea7";

var pastSearches = [];

var prevSearchBtn = document.querySelector("#searchHistory")

var cardCont = $('.cardContainer');
$('#movieInput').keypress(function (event) {
	if (event.which == 13) {
		var movieName = $(this).val();
		getDataTaste(movieName, true);
	}
});

function getMovieName() {
	var movieName = $('#movieInput').val();
	getDataTaste(movieName, true);
}
// loading search history - populate buttons
function loadSearchHistory() {
	pastSearches = JSON.parse(localStorage.getItem("movies"))
	console.log(pastSearches)
	for (i = 0; i < pastSearches.length; i++) {
		saveSearch(pastSearches[i])
	}
}

loadSearchHistory();

function saveSearch(movieName) {
	prevSearchEl = document.createElement("button");
    prevSearchEl.textContent = movieName;
    // prevSearchEl.classList = "d-flex w-100 btn-light border p-3";
    prevSearchEl.setAttribute("movie", movieName)
    prevSearchEl.setAttribute("type", "submit");

	prevSearchBtn.prepend(prevSearchEl)
}

function appendMovie(movieName) {
	// saving searches to movie var
	pastSearches.push(movieName)
    localStorage.setItem("movies", JSON.stringify(pastSearches))
}

function getDataTaste (movieName, saveMovie) {
	cardCont.empty();

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
		
		var similar = response.Similar
		var info = similar.Info[0]
		var type = info.Type
		if (type !== "unknown") {
<<<<<<< HEAD

			if (saveMovie) {
				saveSearch(movieName);
				appendMovie(movieName);
			}

			// var name = info.Name
			// var wTeaser = info.wTeaser
			// var wUrl = info.wUrl
			// var yID = info.yID
			// var yUrl = info.yUrl
=======
>>>>>>> 129587877ab5713c27767cb5b2f2b94f52066fd3

			var results = similar.Results
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

				var divImg = $('<img>');
				divImg.attr('class', 'posterSrc');
				divImg.data('movieName', currentName );
				divImg.data('index', i );
				console.log(divImg.data('index'));
				divFigure.append(divImg);

				var pTeaser = $('<p>');
				pTeaser.text(currentWTeaser);
				divCardContent.append(pTeaser)

				var aWikiUrl = $('<a>');
				aWikiUrl.text(`${currentName} Wikipedia Article`)
				aWikiUrl.attr('src', currentWUrl);
				divCardContent.append(aWikiUrl);

				var relatedClip = document.createElement("iframe")
				relatedClip.setAttribute("width", "500")
				relatedClip.setAttribute("height", "300")
				relatedClip.setAttribute("frameborder", "0")
				relatedClip.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
				relatedClip.setAttribute("allowfullscreen", "")
				relatedClip.setAttribute("src", currentYUrl)
				divCardContent.append(relatedClip);
			}
			getDataPoster();
		}
	} )
};

<<<<<<< HEAD
function getDataPoster (movieName) {
	var getTasteUrl = `https://www.omdbapi.com/?t=${movieName}&apikey=${apiKeyPoster}`;
	
	$.ajax({
		url: getTasteUrl,
		method: 'GET'
	}).then (function (responsePoster) {
		
	} )
};
=======
var postArray = [];
function getDataPoster () {
	postArray = [];
	// console.log(posterArray);
	$('.posterSrc').each(function(){
		var movieHolder = $(this).data('movieName');
		// console.log(movieHolder);
>>>>>>> 129587877ab5713c27767cb5b2f2b94f52066fd3

		var getPosterUrl = `https://www.omdbapi.com/?t=${movieHolder}&apikey=${apiKeyPoster}`;
		
		$.ajax({
			url: getPosterUrl,
			method: 'GET'
		}).then (function(resPoster) {
			console.log(resPoster);
			postObj = {
				title: resPoster.Title,
				rated: resPoster.Rated,
				poster: resPoster.Poster,
				percent: resPoster.Ratings[1].Value
			};
			postArray.push(postObj);
		})
	})//end of .each

	setTimeout(function(){
		console.log(postArray);
		$('img').each(function(index){
			if (index == $(this).data('index')) {
				// && $(this).data('movieName') === $(this)
				// console.log(index + " " +$(this).data('movieName'));
				$(this).attr('src', postArray[index].poster);
			}
		})
	},2000);
	};

// function getDataPoster () {
// 	$('.posterSrc').each(function(){
// 		var movieHolder = $(this).data('movieName');
// 		console.log(movieHolder);
// 		var getPosterUrl = `https://www.omdbapi.com/?t=${movieHolder}&apikey=${apiKeyPoster}`;

// 		$.when(
// 			$.ajax({
// 			url: getPosterUrl,
// 			method: 'GET'
// 		}).then (function(resPoster) {
// 			console.log(resPoster);
// 			}))


// 			})
// 	};

//This one pulls but wrong poster---------------------------------------------
// function getDataPoster () {
// 	$('.posterSrc').each(function(){
// 		var movieHolder = $(this).data('movieName');
// 		console.log(movieHolder);
// 		var getPosterUrl = `https://www.omdbapi.com/?t=${movieHolder}&apikey=${apiKeyPoster}`;
// 			$.ajax({
// 				url: getPosterUrl,
// 				method: 'GET'
// 			}).then (function(resPoster) {
// 				console.log(resPoster);
// 				if($('.posterSrc').data('movieName') == resPoster.Title) {
// 					console.log(resPoster.Title);
// 					console.log($('.posterSrc').data('movieName'));
// 					$('.posterSrc').attr('src', resPoster.Poster)
// 				}
// 				})
// 			})
// 	};



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

// var saveSearch = function(){
//     localStorage.setItem("movieName", JSON.stringify(movieName));
// };


// var prevSearchHandler = function(event){
//     var movieName = event.target.getAttribute("data-movieName")
//     if(movieName){
//         getDataTaste(movieName);
//     }
// }


// function updateCard() {
//     $('.time-block').each(function () {
//         var hour = $(this).attr('id');
//         var currentHour = moment().hour()
//         console.log(currentHour)
//         console.log(hour)
//         if (+hour < currentHour) {
//             $(this).addClass('past');

//         } else if (+hour === currentHour) {
//             $(this).addClass('present');
//         } else {
//             $(this).removeClass('present');
//             $(this).addClass('future');
//         }
//     }
//     )
// }
// updateHours();

// var prevSearch = function(prevSearch){
 
//     prevSearchEl = document.createElement("button");
//     prevSearchEl.textContent = prevSearch;
//     prevSearchEl.classList = "d-flex w-100 btn-light border p-3";
//     prevSearchEl.setAttribute("data-city",prevSearch)
//     prevSearchEl.setAttribute("type", "submit");

//     prevSearchBtn.prepend(prevSearchEl);
// }


var prevSearchHandler = function(event){
    var movie = event.target.getAttribute("movie")
    if (movie){
        getDataTaste(movie, false);
    }
}

prevSearchBtn.addEventListener("click", prevSearchHandler)