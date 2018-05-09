var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');
var form = document.querySelector('form');
var titleInput = document.querySelector('#title');
var locationInput = document.querySelector('#location');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  setTimeout(function(){ createPostArea.style.transform = 'translateY(0)'; }, 1);
  if(defferedPrompt){
  	defferedPrompt.prompt().then(function(choiceResult){
  		console.log(defferedPrompt.outcome);

  		if(choiceResult.outcome === 'dismissed'){
  			console.log('user cancelled installation');
  		} else {
  			console.log('added to home screen');
  		}
  	});

  	defferedPrompt = null;
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
  createPostArea.style.transform = 'translateY(100vh)';
  // createPostArea.style.display = 'none'; 
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// enable cache on demand
function onSaveButtonClicked(event){
	console.log('clicked!');
	if('caches' in window){
		caches.open('user-requested')
		.then(function(cache){
			cache.add('https://httpbin.org/get');
			cache.add('/src/images/sf-boat.jpg');
		});
	}
}

function clearCards(){
	while(sharedMomentsArea.hasChildNodes()){
		sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
	}
}

function updateUI(dataArray){
	clearCards();
	for(var i = 0; i < dataArray.length; i++){
		createCard(dataArray[i]);
	}
}

function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("'+ data.image +'")';
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

var url = 'https://pwa-guide.firebaseio.com/posts.json';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
  	console.log('From web ', data);
  	networkDataReceived = true;
  	var dataArray = [];
  	for(var key in data){
  		dataArray.push(data[key]);
  	}
    
    updateUI(dataArray);
  });


if('indexedDB' in window){
	readAllData('posts')
	.then(
		function(data){
			if(!networkDataReceived){
				console.log('From indexedDB ', data);
				updateUI(data);
			}
		}
	);
}

form.addEventListener('submit', function(event){
	event.preventDefault();
	if(titleInput.value.trim() === '' || locationInput.value.trim() === ''){
		return;
	}

	if('serviceWorker' in navigator && 'SyncManager' in window){
		navigator.serviceWorker.ready
		.then(function(sw){
			var post = {
				id: new Date().toISOString(),
				title: titleInput.value,
				location: locationInput.value
			};

			writeData('sync-posts', post)
			.then(function(){
				return sw.sync.register('sync-new-post');
			})
			.then(function(){
				var snackbarContainer = document.querySelector('#confirmation-toast');
				var data = {message: "Your post saved for syncing"};
				snackbarContainer.MaterialSnackbar.showSackbar(data);
			}).catch(function(err){
				console.log(err);
			});
		})
	}
	closeCreatePostModal();
});
