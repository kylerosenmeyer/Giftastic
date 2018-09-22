//API Information for project:

//GIPHY API Key: y6FqsGJKmXIeJk0UzATA8566ltUPQsSU

//Sample Code from GIPHY:
//javascript, jQuery
// var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5");
// xhr.done(function(data) { console.log("success got data", data); });

//First, bring in the search box

$(document).ready( function() {
    $(".entry").fadeIn(2000)
})




//Add Ajax to connect to the api using the key and sample code above on the push of "enter"

$("#search").keyup( function(event) {

    var searchTerm = $("#search").val()
    searchURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=y6FqsGJKmXIeJk0UzATA8566ltUPQsSU&limit=17";

    if ( searchTerm === "" ) {
        searchTerm = " "
    }
    console.log("this is the searchTerm: " + searchTerm)
    console.log(event.keyCode)
    event.preventDefault();

    if ( event.keyCode === 13 ) {

    $.ajax({
        url: searchURL,
        method: "GET"
    }).then( function(response) {

        var gifBank = response.data

        console.log("this is the JSON: ");
        console.log(response)
        console.log("this is the searchURL: " + searchURL)

        for ( let i=1; i<17; i++ ) {
            console.log("this is i: " + i)
            var gifDiv = $("<img>").addClass("gifWall").attr("src", gifBank[i].images.original.url)
                targetDiv = "#box" + i
            $(targetDiv).html(gifDiv)
            $("img").hide().delay(i+"00").fadeIn(2500)
        }
    })
    }
});