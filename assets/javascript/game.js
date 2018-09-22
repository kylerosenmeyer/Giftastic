//API Information for project:

//GIPHY API Key: y6FqsGJKmXIeJk0UzATA8566ltUPQsSU

//Sample Code from GIPHY:
//javascript, jQuery
// var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5");
// xhr.done(function(data) { console.log("success got data", data); });

//When the enter button is pushed, run the function that generates the gifWall.

$("#search").keyup( function(event) {

    //Store the value of the search term as the variable "searchTerm"
    var searchTerm = $("#search").val()

     //Check to see if the user typed anything, if not, bring back a "blank" gifWall
     if ( searchTerm === "" ) {
        searchTerm = "blank"
    } 

    //Build the api url inserting the user's search term
    searchURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&rating=g&api_key=y6FqsGJKmXIeJk0UzATA8566ltUPQsSU&limit=500";

   
    // console.log("this is the searchTerm: " + searchTerm)
    event.preventDefault();

    //Check to see if the event key is the enter key, and go get the gifs!
    if ( event.keyCode === 13 ) {
    
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
            //build the image tag with the class "gifWall, a source url, two other urls set to video-state and image-state, and a toggle attribute
            var gifDiv = $("<img>").addClass("gifWall").attr("src", gifBank[randGif].images.downsized.url).attr("video-state", gifBank[randGif].images.downsized.url).attr("image-state", gifBank[randGif].images.original_still.url).attr("toggle", "video");
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
            margin: "-2.5% 0% 0% -15%",
        },2000)
    })
    } 
});

//After the gifWall is live, listen for a click on any of the gifs, and then toggle the toggle attribute between video and still, chaning the gif url on toggle between a moving gif and a still image.
$("body").on("click", ".gifWall", function() {
    // console.log("This is the initial setting: " + $(this).attr("toggle"))
    // console.log("This is the initial url: " + $(this).attr("src"))
    var image = $(this).attr("image-state"),
        video = $(this).attr("video-state"),
        action = "still";
    if ( $(this).attr("toggle") === "video" ) {
        $(this).attr("toggle", action).attr("src", image)
    } else if ( $(this).attr("toggle") === "still" ) {
        action = "video"
        $(this).attr("toggle", action).attr("src", video)
    }
    // console.log("This is the final setting: " + $(this).attr("toggle"))
    // console.log("This is the final url: " + $(this).attr("src"))
}) 