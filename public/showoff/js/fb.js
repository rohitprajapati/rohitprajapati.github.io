var albumID = null;
var nextProfilePhotosLink = null;
var selectedPhotoId = null;
var nextCommentsLink = null;


function ensureLoggedIn(cb) {
    FB.getLoginStatus(function (response) {
        if (response && response.status === 'connected') {
            console.log('Already logged in');
            return cb();
        }
        else {
            FB.login(function (response) {
                if (response && response.status === 'connected') {
                    console.log('Now logged in');
                    return cb();
                }
                else {
                    return cb(new Error('Login failed'));
                }
            }, {scope: 'user_photos'});
        }
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '1662816643936100',
        cookie: true,  // enable cookies to allow the server to access
                       // the session
        xfbml: true,  // parse social plugins on this page
        version: 'v2.5' // use version 2.5
    });
    readyToGo();
};

// Load the SDK asynchronously
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function errorHandler(err) {
    console.log(err);
}

function readyToGo() {
    eventHandlers();
    renderProfilePics();
}

function eventHandlers() {
    $('#photos').on('click', '.photo-thrumbnail', function () {
        var photoId = $(this).data('photo-id');
        selectedPhotoId = photoId;
        getPhotoUrl(photoId, function (err, photoUrl) {
            if (err) {
                return errorHandler(err);
            }
            var selectedPhoto = '<img id="selected-pic" src="' + photoUrl + '"/>';
            $('#selected-photo').html(selectedPhoto);
        });
    });
}

function getPhotoUrl(photoId, cb) {
    ensureLoggedIn(function (err) {
        if (err) {
            return errorHandler(err);
        }
        FB.api('' + photoId, {
            fields: ['source']
        }, function (response) {
            if (!response || response.error) {
                return cb(new Error('Facing issues while fetching photo: ' + response && response.error));
            }
            var photoUrl = response.source;
            return cb(null, photoUrl);
        });
    });
}

function renderProfilePics() {
    ensureLoggedIn(function (err) {
        if (err) {
            return errorHandler(err);
        }
        getProfileAlbumId('/me/albums?fields=type,name', function (err, profileAlbumId) {
            if (err) {
                return errorHandler(err);
            }
            if (!profileAlbumId) {
                return errorHandler(new Error('Profile album not found'));
            }
            albumID = profileAlbumId;
            nextProfilePhotosLink = '' + albumID + '/photos?fields=picture,source';
            renderProfilePhotos(function (err) {
                if (err) {
                    return errorHandler(err);
                }
            });
        });
    });
}

function getProfileAlbumId(path, cb) {
    FB.api(path, function (response) {
        if (!response || response.error) {
            return cb(new Error('Facing issues while fetching albums: ' + response && response.error));
        }
        var albums = response.data || [];
        var profileAlbumId = 0;
        albums.some(function (album) {
            if (album.type === 'profile' && album.name === 'Profile Pictures') {
                profileAlbumId = album.id;
                return true;
            }
        });
        if (profileAlbumId) {
            return cb(null, profileAlbumId);
        }
        if (response.paging && response.paging.next) {
            return getProfileAlbumId(response.paging.next, cb);
        }
        return cb(null, profileAlbumId);
    });
}

function renderProfilePhotos(cb) {
    if (!nextProfilePhotosLink) {
        return cb();
    }
    ensureLoggedIn(function (err) {
        if (err) {
            return errorHandler(err);
        }
        FB.api(nextProfilePhotosLink, function (response) {
            if (!response || response.error) {
                return cb(new Error('Facing issues while fetching photos: ' + response && response.error));
            }
            nextProfilePhotosLink = response.paging && response.paging.next;
            var photos = response.data || [];
            photos.forEach(function(photo) {
                var photoId = photo.id;
                var thrumbnailUrl = photo.picture;
                var thrubnailElm = '<div class="photo-thrumbnail" data-photo-id="'+ photoId + '"><img class="profile-pic-thrumbnail" src="' + thrumbnailUrl + '"/></div>';
                $('#photos').append(thrubnailElm);
            });
            return cb();
        });
    });
}

function renderAllComments() {


}

function getComments() {

}
