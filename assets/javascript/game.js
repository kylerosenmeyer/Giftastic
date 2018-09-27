//API Information for project:

//GIPHY API Key: y6FqsGJKmXIeJk0UzATA8566ltUPQsSU

//Sample Code from GIPHY:
//javascript, jQuery
// var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5");
// xhr.done(function(data) { console.log("success got data", data); });

//When the enter button is pushed, run the function that generates the gifWall.

//Before that, hide some stuff
$(".gif-desc, .download, .saveGif").fadeOut(0)
$(".favorites, .favSection, .clear").fadeOut(0)

//And after that, before pushing a button, define some stuff. Namely,
//Define variables to be used throughout functions in the app. searchCounter is used to store the ID of the past search buttons. favBuilder is used to store the image attributes
//into an object when it moves to storage. favCounter is used to keep track of the savedGifs comeing out of storage back onto the page. image, video, action, title, rating, and id are 
//all variables to store a different attribute of the gif that comes from the api. 
//If there are favorites stored in sessionStorage, note that by setting the value of favCounter to the value in storage.



var searchCounter = 0,
    favBuilder = 0,
    image = "",
    video = "",
    action = "",
    title = "",
    rating = "",
    id = "",
    favLive = false,
    favCounter = JSON.parse(sessionStorage.getItem("favCounter"));

//if no favorites are in storage, the value from storage will be null. In that case, set the counter to zero.
if ( favCounter === "null" ) {
    favCounter = 0
}

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
        // console.log("this is the searchCounter: " + searchCounter)

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
            // console.log("this is the JSON: ");
            // console.log(response)
            // console.log("this is the searchURL: " + searchURL)

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
            if ( window.innerHeight < window.innerWidth ) {
                $(".entry").animate( {
                    margin: "-3% 0% 5% -15%",
                },2000)
            }

            //Finally, clear the search bar and store the search in a new button below to recall later.
            $("#search").val("");
            var oldButton = $("<button>").addClass("oldButton").attr({
                "search-URL": searchURL,
                "id": "button-"+searchCounter
            }).text(searchTerm);

            $("#past").prepend(oldButton).fadeIn(1000);
            $("#button-"+searchCounter).hide(0).fadeIn(1000);
    })
    } 
});

//If a save button gets click, grab all the attributes of that gif's image tag and store it to the session Storage.

$(".saveGif").click( function() {
    // console.log("save clicked!")
    favCounter++

    $(".favorites, .clear").fadeIn(2000)


    //These are the attributes going into storage.
    favBuilder = {
        "image": image,
        "video": video,
        "toggle": action,
        "title": title,
        "rating": rating,
        "id": favCounter,
    }
    
    console.log("Number of favs saved: " + favCounter)
    //Put the faveCounter in storage to remember for the session.
    sessionStorage.setItem("favCounter", JSON.stringify(favCounter))

    //Put the stringified object into storage.
    sessionStorage.setItem("favGif"+favCounter,JSON.stringify(favBuilder))
    
})

//If an old search is clicked, bring up that gifWall instead. This re-runs the api to bring up fresh images of the old search term. If the user wants to recall a particalur one, save it! 

$("body").on("click", ".oldButton", function() {
    searchURL = $(this).attr("search-URL")
    // console.log("this is the revived search URL: " + searchURL)

    $.ajax({ 
        url: searchURL,
        method: "GET"
    }).then( function(response) {
        //Set a new variable to the base level of the JSON Array.
        var gifBank = response.data

        //Conosle log the JSON object and the search URL for reference.
        // console.log("this is the JSON: ");
        // console.log(response)
        // console.log("this is the searchURL: " + searchURL)

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

//When the favorites button is clicked, fade out the main app screen and bring up the favorites grid. This is where we will show the saved gifs.

$(".favorites").click( function() {
    favLive = true;
    // console.log("this is the favLive value: " + favLive)
    $(".main").fadeOut(1000)
    $(".favSection").delay(1000).fadeIn(1000)
    $(".gif-desc, .download").fadeOut(0)

    //This condition checks to see if anything has been saved yet.
    if ( favCounter !== 0 ) {

        var favCap = favCounter + 1
        //When true, the app will run a for loop to pull all of the saved gifs out of storage.
        for ( let j=1; j<favCap; j++ ) {
            //These two variables store the position of the gif to pull, and extracts and parses it from storage.
            var favPosition = "favGif"+j,
                gifStorage = JSON.parse(sessionStorage.getItem(favPosition)),

                //Then the loop puts the properties from the object back into the attribute positions of an image tag
                faveGif = $("<img>").addClass("gifWall").attr({
                    "src": gifStorage.video,
                    "video-state": gifStorage.video,
                    "image-state": gifStorage.image,
                    "toggle": "video",
                    "rating": gifStorage.rating,
                    "title": gifStorage.title,
                    "id": gifStorage.id,
                }); 

            // console.log("this is the position its pulling from storage: " + favPosition)
            // console.log("This is it's title: " + gifStorage.title)
            
            //And appends them to favorite grid.
            $("#fave"+j).append(faveGif)
            
        }
    }
})

//On the click of the clear button, clear the session storage for the user.

$(".clear").click( function() {

    $(".clear, .favorites, #past").fadeOut(2000)
    setTimeout( function() {
        $("#past").empty()
    }, 4000)
    sessionStorage.clear()
    favCounter = 0;
})

//On the click of the return button, the favorites screen is faded out and the user is brought back to the main app screen.
$(".return").click( function() {
    favLive = false;
    $(".favSection").fadeOut(2000)
    $(".main").delay(2000).fadeIn(2000)
})

//After the gifWall is live, listen for a click on any of the gifs, and then toggle the toggle attribute between video and still, changing the gif url on toggle between a moving gif and a still image.
$("body").on("click", ".gifWall", function() {

    // console.log("This is the initial setting: " + $(this).attr("toggle"))
    // console.log("This is the initial url: " + $(this).attr("src"))

    //Check to see which screen the user is on. The id targets are slightly different for the favorite section vs. the main section.

    if ( favLive == false ) {
        //This code snippet stores the attributes of the clicked gif into variables, and toggles the condition to pause or play the video. 
        image = $(this).attr("image-state"),
        video = $(this).attr("video-state"),
        action = "still",
        title = $(this).attr("title"),
        rating = $(this).attr("rating")
        id = $(this).attr("id")

        //This condition checks the toggle value of the gif. On pause, the user sees the title and rating, and gets to choose whether to download or favorite the file.
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

            // console.log("This is the title value: " + $(this).attr("title"))
            // console.log("This is the rating value: " + $(this).attr("rating"))
        } else if ( $(this).attr("toggle") === "still" ) {
            action = "video"
            $(this).attr("toggle", action).attr("src", video)
            $("#desc"+id).fadeOut(1000)
            $("#download"+id).fadeOut(1000)
            $("#save"+id).fadeOut(1000)
        }
        // console.log("This is the final setting: " + $(this).attr("toggle"))
        // console.log("This is the final url: " + $(this).attr("src"))
    } else if ( favLive == true ) {

        // console.log("this is the favGifs toggle: " + $(this).attr("toggle"))

        //This code snippet stores the attributes of the clicked gif into variables, and toggles the condition to pause or play the video. 
        image = $(this).attr("image-state"),
        video = $(this).attr("video-state"),
        action = "still",
        title = $(this).attr("title"),
        rating = $(this).attr("rating")
        id = $(this).attr("id")
        // console.log("this is the id in favLive=true: " + id)

        //This condition checks the toggle value of the gif. On pause, the user sees the title and rating, and gets to choose whether to download or favorite the file.
        if ( $(this).attr("toggle") === "video" ) {
            $(this).attr("toggle", action).attr("src", image)

            $(this).css({
                "background-image": $(this).attr("src"),
                "opacity": 0.6,
                "position": "relative" 
            })

            $("#fdesc"+id).html("Title: " + title + "<br>Rating: " + rating).fadeIn(1000)
            $("#fdownload"+id).attr("href", video).fadeIn(1000)        

            // console.log("This is the title value: " + $(this).attr("title"))
            // console.log("This is the rating value: " + $(this).attr("rating"))
        } else if ( $(this).attr("toggle") === "still" ) {
            action = "video"
            $(this).attr("toggle", action).attr("src", video)
            $("#fdesc"+id).fadeOut(1000)
            $("#fdownload"+id).fadeOut(1000)
        }
        // console.log("This is the final setting: " + $(this).attr("toggle"))
        // console.log("This is the final url: " + $(this).attr("src"))

    }
}) 

//This section handles the event that the user wants to click and drag the entry box around.

if ( window.innerWidth > window.innerHeight ) {
    
    //When the mouse is pressed down on the class "entry", free the top and left css attributes for the class 
    //and change them to the location of the mouse.
    $(".entry").mousedown( function() {
        // console.log("mouse is down")
            

        $("body").mousemove( function() {
                // console.log("mouse is on the move")
            $(".entry").css({
                top: event.pageY,
                left: event.pageX
            })
        })

        //When the mouse is released, note the last position of the mouse and unbind the mousemove.
        $(".entry").mouseup( function() {
            // console.log("mouse is up")
            $(this).css({
                top: event.pageY,
                left: event.pageX
            })
            $("body").off("mousemove")
            
        })

    })
}
        

