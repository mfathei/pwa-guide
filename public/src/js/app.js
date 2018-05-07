if('serviceWorker' in navigator){
	navigator.serviceWorker.register('/sw.js')
	.then(function(){
		console.log('service worker registered!');
	}).catch(function(err){
		console.log(err);
	});
}


fetch('https://httpbin.org/ip').
then(function(response){
	return response.json();
}).then(function(data){
	console.log(data);
}).catch(function(err){
	console.log(err);
})