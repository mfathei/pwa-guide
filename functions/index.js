'use strict';

var functions = require('firebase-functions');
var admin = require('firebase-admin');
// CORS Express middleware to enable CORS Requests.
var cors = require('cors')({
  origin: true,
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
var serviceAccount = require("./pwa-fb-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pwa-guide.firebaseio.com"
});

exports.storePostData = functions.https.onRequest(function(request, response) {
	// Forbidding PUT requests.
	if (request.method === 'PUT') {
		return response.status(403).send('Forbidden!');
	}

	return cors(request, response, function(){
		admin.database().ref('posts').push({
			id: request.body.id,
			title: request.body.title,
			location: request.body.location,
			image: request.body.image
		})
		.then(function(){
			response.status(201).json({message: 'Data stored!', id: request.body.id});
		})
		.catch(function(err){
			response.status(500).json({error: err});
		});
	});
});
