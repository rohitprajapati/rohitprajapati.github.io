var albumID = null;
var nextProfilePhotosLink = null;
var selectedPhotoId = null;
var nextCommentsLink = null;

$(document).ready(function() {
    window.fbAsyncInit = function () {
        FB.init({
            appId: '1662816643936100',
            cookie: true,  // enable cookies to allow the server to access
                           // the session
            xfbml: true,  // parse social plugins on this page
            version: 'v2.5' // use version 2.5
        });
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    $(document).on('click', '.fb-share', function () {
        postToFeed($(this));
    });
});

function postToFeed($obj){
    var obj = {
        method: 'feed',
        link: $obj.data('link'),
        picture: $obj.data('picture'),
        name: $obj.data('name'),
        description: $obj.data('description')
    };
    FB.ui(obj, errorHandler);
}

function errorHandler(err) {
    console.log(err);
}
