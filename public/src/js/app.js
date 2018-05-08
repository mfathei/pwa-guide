var defferedPrompt;

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

// xhr
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://httpbin.org/ip');
xhr.responseType = 'json';
xhr.onload = function(){
	console.log(xhr.response);
}

xhr.onerror = function(){
	console.log(err);
}

xhr.send();

// GET
fetch('https://httpbin.org/ip').
then(function(response){
	return response.json();
}).then(function(data){
	console.log(data);
}).catch(function(err){
	console.log(err);
});

// POST
fetch('https://httpbin.org/post', {
	method: 'POST',
	headers: {
		'Content-type': 'application/json',
		'Accept': 'application/json',
	},
	mode: "cors",
	body: JSON.stringify({message: "This works."})
}).
then(function(response){
	return response.json();
}).then(function(data){
	console.log(data);
}).catch(function(err){
	console.log(err);
});