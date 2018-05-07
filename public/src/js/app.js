if('serviceWorker' in navigator){
	navigator.serviceWorker.register('/sw.js')
	.then(function(){
		console.log('service worker registered!');
	}).catch(function(err){
		console.log(err);
	});
}

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