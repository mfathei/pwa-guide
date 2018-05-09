var defferedPrompt;
var notificationButtons = document.querySelectorAll('.enable-notifications');

if(!window.Promise){
	window.Promise = Promise;
}

if('serviceWorker' in navigator){
	navigator.serviceWorker.register('/sw.js')
	.then(function(){
		console.log('service worker registered!');
	}).catch(function(err){
		console.log(err);
	});
}

window.addEventListener('beforeinstallprompt', function(event){
	console.log('beforeinstallprompt fired');
	event.preventDefault();
	defferedPrompt = event;
	return false;
});

function displayConfirmNotification(){
	if('serviceWorker' in navigator){
		var options = {
			body: 'You Successfully Subscribed to our Notifications system'
		};
		navigator.serviceWorker.ready
		.then(function(swreg){
			swreg.showNotification('Successfully Subscribed', options);
		});
	}

}

function askForNotificationPermission(){
	var result = Notification.requestPermission(function(result){
		console.log('User Choice', result);
		if(result !== 'granted'){
			console.log('No notification permission', result);
		} else {
			// hide button
			displayConfirmNotification();
		}
	});
}

if('Notification' in window){
	for(var i = 0;i < notificationButtons.length; i++){
		notificationButtons[i].style.display = 'inline-block';
		notificationButtons[i].addEventListener('click', askForNotificationPermission);
	}
}
