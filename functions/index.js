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
var webpush = require('web-push');
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
			webpush.setVapidDetails('mailto:oracle.dev10g@gmail.com'
				,'BN1XjQM4LUPE8vFtK264qjiJEIHrh_SkkUGjw6GuHDdmEOUN3nC_mLgBWVlgViOr2HmcFGR0J-J01Aw7liu0mnY'
				,'RXz46hB298dGENp2ayOn-U3OO8lWPkSVgo4L86VfK5Q');
			return admin.database().ref('subscriptions').once('value');
		})
		.then(function(subscriptions){
			subscriptions.forEach(function(sub){
				var pushConfig = {
					endpoint: sub.val().endpoint,
					keys: {
						auth: sub.val().keys.auth,
						p256dh: sub.val().keys.p256dh
					}
				}

				webpush.sendNotification(pushConfig, JSON.stingify({title: "New Post", body: "New Post Added"}))
				.cach(function(err){
					console.log(err);
				});
			});

			response.status(201).json({message: 'Data stored!', id: request.body.id});
		})
		.catch(function(err){
			response.status(500).json({error: err});
		});
	});
});
