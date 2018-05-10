'use strict';

var functions = require('firebase-functions');
var admin = require('firebase-admin');
var webpush = require('web-push');
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


exports.storePostData = functions.https.onRequest(function (request, response) {
  cors(request, response, function () {
    admin.database().ref('posts').push({
      id: request.body.id,
      title: request.body.title,
      location: request.body.location,
      image: request.body.image
    })
      .then(function () {
        webpush.setVapidDetails('mailto:oracle.dev10g@gmail.com', 'BN1XjQM4LUPE8vFtK264qjiJEIHrh_SkkUGjw6GuHDdmEOUN3nC_mLgBWVlgViOr2HmcFGR0J-J01Aw7liu0mnY', 'RXz46hB298dGENp2ayOn-U3OO8lWPkSVgo4L86VfK5Q');
        return admin.database().ref('subscriptions').once('value');
      })
      .then(function (subscriptions) {
        subscriptions.forEach(function (sub) {
          var pushConfig = {
            endpoint: sub.val().endpoint,
            keys: {
              auth: sub.val().keys.auth,
              p256dh: sub.val().keys.p256dh
            }
          };

          webpush.sendNotification(pushConfig, 
          		JSON.stringify({title: 'New Post', content: 'New Post added!', openUrl: '/help'})
          	)
            .catch(function(err) {
              console.log(err);
            })
        });
        response.status(201).json({message: 'Data stored', id: request.body.id});
      })
      .catch(function (err) {
        response.status(500).json({error: err});
      });
  });
});