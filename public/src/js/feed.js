'use strict';
var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');
var form = document.querySelector('form');
var titleInput = document.querySelector('#title');
var locationInput = document.querySelector('#location');
var videoPlayer = document.querySelector('#player');
var canvasElement = document.querySelector('#canvas');
var imagePicker = document.querySelector('#image-picker');
var imagePickerArea = document.querySelector('#pick-image');
var captureButton = document.querySelector('#capture-btn');
var locationBtn = document.querySelector('#location-btn');
var locationLoader = document.querySelector('#location-loader');
var picture;
var fetchedLocation = {lat: 0, lng: 0};

locationBtn.addEventListener('click', function(event){
    if(!('geolocation' in navigator)){
        return;
    }

    locationBtn.style.display = 'none';
    locationLoader.style.display = 'block';

    var sawAlert = false;

    navigator.geolocation.getCurrentPosition(function(position){
        locationBtn.style.display = 'inline';
        locationLoader.style.display = 'none';
        fetchedLocation = {lat: position.coords.latitude, lng: 0};
        locationInput.value = 'In Munich';
        document.querySelector('#manual-location').classList.add('is-focused');
    }, function(err){
        console.log(err);
        locationBtn.style.display = 'inline';
        locationLoader.style.display = 'none';
        fetchedLocation = {lat: 0, lng: 0};
        if(!sawAlert){
            alert('Couldn\'t fetch location, please enter manually.');
            sawAlert = true;
        }
    }, {timeout: 7000});
});

function initializeLocation(){
    if(!('geolocation' in navigator)){
        locationBtn.style.display = 'none';
    }
}

function initializeMedia() {
    if (!('mediaDevices' in navigator)) {
        navigator.mediaDevices = {};
    }

    if (!('getUserMedia' in navigator.mediaDevices)) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            if (!getUserMedia) {
                return Promise.reject(new Error("getUserMedia is not implemented!"));
            }

            return new Promise(function (resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        }
    }

    navigator.mediaDevices.getUserMedia({
        video: true
    })
        .then(function (stream) {
            videoPlayer.srcObject = stream;
            videoPlayer.style.display = 'block';
            imagePickerArea.style.display = 'none';
        })
        .catch(function (err) {
            imagePickerArea.style.display = 'block';
        });
}

captureButton.addEventListener('click', function(event) {
  canvasElement.style.display = 'block';
  videoPlayer.style.display = 'none';
  captureButton.style.display = 'none';
  var context = canvasElement.getContext('2d');
  context.drawImage(videoPlayer, 0, 0, canvasElement.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvasElement.width));
  videoPlayer.srcObject.getVideoTracks().forEach(function(track) {
    track.stop();
  });
  picture = dataURItoBlob(canvasElement.toDataURL());
});

imagePicker.addEventListener('change', function (event) {
    picture = event.target.files[0];
});

function openCreatePostModal() {
    // createPostArea.style.display = 'block';
    // setTimeout(function () {
    setTimeout(function(){
        createPostArea.style.transform = 'translateY(0)';
    }, 1);
    initializeMedia();
    initializeLocation();
    // }, 1);
    if (deferredPrompt) {
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then(function (choiceResult) {
            // console.log(choiceResult.outcome);

            if (choiceResult.outcome === 'dismissed') {
                console.log('user cancelled installation');
            } else {
                console.log('added to home screen');
            }
        });

        deferredPrompt = null;
    }

    // if('serviceWorker' in navigator){
    // 	navigator.serviceWorker.getRegistrations()
    // 	.then(function(registrations){
    // 		for(var i = 0; i < registrations.length; i++){
    // 			registrations[i].unregister();
    // 		}
    // 	});
    // }

}

function closeCreatePostModal() {
    imagePickerArea.style.display = 'none';
    videoPlayer.style.display = 'none';
    canvasElement.style.display = 'none';
    locationBtn.style.display = 'inline';
    locationLoader.style.display = 'none';
    captureButton.style.display = 'inline';
    if(videoPlayer.srcObject){
        videoPlayer.srcObject.getVideoTracks().forEach(function(track){
            track.stop();
        });
    }
    setTimeout(function(){
        createPostArea.style.transform = 'translateY(100vh)';
    }, 1);
    // createPostArea.style.display = 'none'; 
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// enable cache on demand
function onSaveButtonClicked(event) {
    // console.log('clicked!');
    if ('caches' in window) {
        caches.open('user-requested')
            .then(function (cache) {
                cache.add('https://httpbin.org/get');
                cache.add('/src/images/sf-boat.jpg');
            });
    }
}

function clearCards() {
    while (sharedMomentsArea.hasChildNodes()) {
        sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
    }
}

function updateUI(dataArray) {
    clearCards();
    for (var i = 0; i < dataArray.length; i++) {
        createCard(dataArray[i]);
    }
}

// path in api code pwa-api
// var imagePath = '/mnt/f/PROGRAMMING/Progressive web apps/WORK/pwa-guide/public/upload/photos/';

function createCard(data) {
    var cardWrapper = document.createElement('div');
    cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
    var cardTitle = document.createElement('div');
    cardTitle.className = 'mdl-card__title';
    cardTitle.style.backgroundImage = 'url("' + data.image + '")';
    cardTitle.style.backgroundSize = 'cover';
    cardTitle.style.height = '180px';
    cardWrapper.appendChild(cardTitle);
    var cardTitleTextElement = document.createElement('h2');
    cardTitleTextElement.className = 'mdl-card__title-text';
    cardTitleTextElement.textContent = data.title;
    cardTitleTextElement.style.color = 'white';
    cardTitle.appendChild(cardTitleTextElement);
    var cardSupportingText = document.createElement('div');
    cardSupportingText.className = 'mdl-card__supporting-text';
    cardSupportingText.textContent = data.location;
    cardSupportingText.style.textAlign = 'center';
    // var cardSaveButton = document.createElement('button');
    // cardSaveButton.textContent = 'Save';
    // cardSaveButton.addEventListener('click', onSaveButtonClicked);
    // cardSupportingText.appendChild(cardSaveButton);
    cardWrapper.appendChild(cardSupportingText);
    componentHandler.upgradeElement(cardWrapper);
    sharedMomentsArea.appendChild(cardWrapper);
}

// var url = 'https://pwa-guide.firebaseio.com/posts.json'; // get request
var url = 'http://localhost:3000/api/posts'; // get request
var networkDataReceived = false;

fetch(url)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        console.log('From web ', data);
        networkDataReceived = true;
        var dataArray = [];
        for (var key in data) {
            dataArray.push(data[key]);
        }

        updateUI(dataArray);
    });

function sendData() {
    // var url = 'https://us-central1-pwa-guide.cloudfunctions.net/storePostData';
    var url = 'http://localhost:3000/api/posts';
    var id = new Date().toISOString();
    var postData = new FormData();
    // postData.append('id', id);
    postData.append('title', titleInput.value);
    postData.append('location', locationInput.value);
    postData.append('rawLocationLat', fetchedLocation.lat);
    postData.append('rawLocationLng', fetchedLocation.lng);
    postData.append('file', picture, id + '.png');
    fetch(url, {
        method: 'POST',
        body: postData
    })
    .then(function (res) {
        console.log('Data sent to server', res);
        updateUI();
    });
}

if ('indexedDB' in window) {
    readAllData('posts')
        .then(
            function (data) {
                if (!networkDataReceived) {
                    console.log('From indexedDB ', data);
                    updateUI(data);
                }
            }
        );
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (titleInput.value.trim() === '' || locationInput.value.trim() === '') {
        return;
    }
    closeCreatePostModal();
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready
            .then(function (sw) {
                var post = {
                    id: new Date().toISOString(),
                    title: titleInput.value,
                    location: locationInput.value,
                    rawLocation: fetchedLocation,
                    picture: picture
                };

                writeData('sync-posts', post)
                    .then(function () {
                        return sw.sync.register('sync-new-posts');
                    })
                    .then(function () {
                        var snackbarContainer = document.querySelector('#confirmation-toast');
                        var data = {
                            message: "Your post saved for syncing"
                        };
                        snackbarContainer.MaterialSnackbar.showSnackbar(data);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });
    } else {
        sendData();
    }
});