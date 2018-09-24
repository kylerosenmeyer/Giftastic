//API Information for project:

//GIPHY API Key: y6FqsGJKmXIeJk0UzATA8566ltUPQsSU

//Sample Code from GIPHY:
//javascript, jQuery
// var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5");
// xhr.done(function(data) { console.log("success got data", data); });

//When the enter button is pushed, run the function that generates the gifWall.
//Define a variable to count the number of searches, and an empty array to save favorites.
var searchCounter = 0,
    favoriteGifs = [];

//hide all the descriptor/download fields
$(".gif-desc, .download, .saveGif, .favorites, .favSection").fadeOut(0)

$("#search").keyup( function(event) {

    //Store the value of the search term as the variable "searchTerm"
    var searchTerm = $("#search").val()
    

     //Check to see if the user typed anything, if not, bring back a "blank" gifWall
     if ( searchTerm === "" ) {
        searchTerm = "blank"
    } 

    //Build the api url inserting the user's search term
    searchURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&rating=pg&api_key=y6FqsGJKmXIeJk0UzATA8566ltUPQsSU&limit=500";

   
    // console.log("this is the searchTerm: " + searchTerm)
    event.preventDefault();

    //Check to see if the event key is the enter key, and go get the gifs!
    if ( event.keyCode === 13 ) {
    
        searchCounter++
        console.log("this is the searchCounter: " + searchCounter)

        $(".gif-desc, .download, .saveGif").fadeOut(1000)

        //AJAX request to the API
        $.ajax({
            url: searchURL,
            method: "GET"

        //After AJAX gets the data, proceed with building and displaying the gifs.
        }).then( function(response) {
            
            //Set a new variable to the base level of the JSON Array.
            var gifBank = response.data

            //Conosle log the JSON object and the search URL for reference.
            console.log("this is the JSON: ");
            console.log(response)
            console.log("this is the searchURL: " + searchURL)

            //Run a loop that generates a randome number between 1 and 500, gets the gif at that positiion, builds the image tag, and fade in the gif.

            for ( let i=1; i<17; i++ ) {
                //Get the random number
                var randGif = Math.floor(Math.random()*500+1)
                //build the image tag with the class "gifWall, a source url, two other urls set to video-state and image-state, and a toggle attribute, and add the rating and title as attributes
                var gifDiv = $("<img>").addClass("gifWall").attr({
                        "src": gifBank[randGif].images.downsized.url,
                        "video-state": gifBank[randGif].images.downsized.url,
                        "image-state": gifBank[randGif].images.original_still.url,
                        "toggle": "video",
                        "rating": gifBank[randGif].rating,
                        "title": gifBank[randGif].title,
                        "id": i,
                    });
                    //declare a variable to target each box.
                    targetDiv = "#box" + i
                //Put the image tag into the targeted box
                $(targetDiv).html(gifDiv)
                // Fade in the gif at a slightly different time for each gif.
                $("img").hide().delay("1"+i+"0").fadeIn(5000)
            }

            //As the gifs are displaying, collapse the entry box down to just the search bar.
            $("#instruction, #mini").slideUp(2000)
            //and change the margins on the slim box.
            $(".entry").animate( {
                margin: "-5% 0% 0% -15%",
            },2000)

            //Finally, clear the search bar and store the search in a new button below to recall later.
            $("#search").val("");
            var oldButton = $("<button>").addClass("oldButton").attr({
                "search-URL": searchURL,
                "id": "button-"+searchCounter
            }).text(searchTerm);

            $("#past").prepend(oldButton);
            $("#button-"+searchCounter).hide(0).fadeIn(1000);
    })
    } 
});

//After the gifWall is live, listen for a click on any of the gifs, and then toggle the toggle attribute between video and still, changing the gif url on toggle between a moving gif and a still image.
$("body").on("click", ".gifWall", function() {

    // console.log("This is the initial setting: " + $(this).attr("toggle"))
    // console.log("This is the initial url: " + $(this).attr("src"))

    //This code snippet stores the attributes of the clicked gif into variables, and toggles the condition to pause or play the video. On pause, the user sees the title and rating, and gets to choose whether to download or favorite the file.
    var image = $(this).attr("image-state"),
        video = $(this).attr("video-state"),
        action = "still",
        title = $(this).attr("title"),
        rating = $(this).attr("rating")
        id = $(this).attr("id")

    if ( $(this).attr("toggle") === "video" ) {
        $(this).attr("toggle", action).attr("src", image)

        $(this).css({
            "background-image": $(this).attr("src"),
            "opacity": 0.6,
            "position": "relative" 
        })

        $("#desc"+id).html("Title: " + title + "<br>Rating: " + rating).fadeIn(1000)
        $("#download"+id).attr("href", video).fadeIn(1000)
        $("#save"+id).fadeIn(1000)
        

        console.log("This is the title value: " + $(this).attr("title"))
        console.log("This is the rating value: " + $(this).attr("rating"))
    } else if ( $(this).attr("toggle") === "still" ) {
        action = "video"
        $(this).attr("toggle", action).attr("src", video)
        $("#desc"+id).fadeOut(1000)
        $("#download"+id).fadeOut(1000)
        $("#save"+id).fadeOut(1000)
    }
    // console.log("This is the final setting: " + $(this).attr("toggle"))
    // console.log("This is the final url: " + $(this).attr("src"))

    $(".saveGif").click( function() {

        $(".favorites").fadeIn(2000)
        
        favBuilder = [
            image,
            video,
            action,
            title,
            rating,
            id
        ]
    
        favoriteGifs.push(favBuilder)
        sessionStorage.setItem("favorite"+id,JSON.stringify(favoriteGifs))
    })
}) 

//If an old search is clicked, bring up that gifWall instead.

$("body").on("click", ".oldButton", function() {
    searchURL = $(this).attr("search-URL")
    console.log("this is the revived search URL: " + searchURL)

    $.ajax({ 
        url: searchURL,
        method: "GET"
    }).then( function(response) {
        //Set a new variable to the base level of the JSON Array.
        var gifBank = response.data

        //Conosle log the JSON object and the search URL for reference.
        console.log("this is the JSON: ");
        console.log(response)
        console.log("this is the searchURL: " + searchURL)

        //Run a loop that generates a randome number between 1 and 500, gets the gif at that positiion, builds the image tag, and fade in the gif.

        for ( let i=1; i<17; i++ ) {
            //Get the random number
            var randGif = Math.floor(Math.random()*500+1)
            //build the image tag with the class "gifWall, a source url, two other urls set to video-state and image-state, and a toggle attribute
            var gifDiv = $("<img>").addClass("gifWall").attr({
                "src": gifBank[randGif].images.downsized.url,
                "video-state": gifBank[randGif].images.downsized.url,
                "image-state": gifBank[randGif].images.original_still.url,
                "toggle": "video",
                "rating": gifBank[randGif].rating,
                "title": gifBank[randGif].title,
                "id": i,
            });                
            //declare a variable to target each box.
            targetDiv = "#box" + i
            //Put the image tag into the targeted box
            $(targetDiv).html(gifDiv)
            // Fade in the gif at a slightly different time for each gif.
            $("img").hide().delay("1"+i+"0").fadeIn(5000)
        }
    })
})



$(".favorites").click( function() {
    $(".main").fadeOut(2000)
    $(".favSection").delay(2000).fadeIn(2000)

    var gifStorage = sessionStorage.getItem(JSON.parse(favoriteGifs))
    console.log("this is the parsed object: " + gifStorage)
    for ( let j=0; j<16; j++ ) {
        var favGif = gifStorage.j
        $("#fave"+j).append(favGif)
    }
})

$(".return").click( function() {
    $(".favSection").fadeOut(2000)
    $(".main").delay(2000).fadeIn(2000)
})
