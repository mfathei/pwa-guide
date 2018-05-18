'use strict';
var deferredPrompt;
var notificationButtons = document.querySelectorAll('.enable-notifications');

if (!window.Promise) {
    window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/workbox-sw.js')
        .then(function () {
            console.log('service worker registered!');
        }).catch(function (err) {
            console.log(err);
        });
}

window.addEventListener('beforeinstallprompt', function (event) {
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});

function displayConfirmNotification() {
    if ('serviceWorker' in navigator) {
        var options = {
            body: 'You Successfully Subscribed to our Notifications system',
            icon: '/src/images/icons/app-icon-96x96.png',
            image: '/src/images/sf-boat.jpg',
            dir: 'ltr',
            lang: 'en-US', // BCP 47
            vibrate: [100, 50, 200],
            badge: '/src/images/icons/app-icon-96x96.png',
            tag: 'confirm-notification',
            renotify: true,
            actions: [{
                    action: 'confirm',
                    title: 'Okay',
                    icon: '/src/images/icons/app-icon-96x96.png'
                },
                {
                    action: 'cancel',
                    title: 'Cancel',
                    icon: '/src/images/icons/app-icon-96x96.png'
                }
            ]
        };
        navigator.serviceWorker.ready
            .then(function (swreg) {
                swreg.showNotification('Successfully Subscribed', options);
            });
    }

}

var reg;

function configurePushSub() {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    navigator.serviceWorker.ready
        .then(function (swreg) {
            reg = swreg;
            return swreg.pushManager.getSubscription();
        })
        .then(function (sub) {
            if (!sub) {
                var vapidPublicKey = 'BLet4p6u28mtoXKDmbGx1eHtXxHb8zRRSruyP-I7Hl9z7a6mYZd33_ogVCkMIZ2fTT806Lb4XtkoE7ALHPBGoSM'
                var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
                return reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidPublicKey
                });
            } else {
                // we have a Subscription
                console.log('we have a Subscription')
            }
        })
        .then(function (newSub) {
            // var url = 'https://pwa-guide.firebaseio.com/subscriptions.json';
            console.log(newSub);
            var url = 'http://localhost:3000/api/subscriptions';
            return fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(newSub)
            });
        })
        .then(function (res) {
            displayConfirmNotification();
        })
        .catch(function (err) {
            console.log(err);
        });
}

function askForNotificationPermission() {
    var result = Notification.requestPermission(function (result) {
        console.log('User Choice', result);
        if (result !== 'granted') {
            console.log('No notification permission', result);
        } else {
            // hide button
            configurePushSub();
        }
    });
}

if ('Notification' in window && 'serviceWorker' in navigator) {
    for (var i = 0; i < notificationButtons.length; i++) {
        notificationButtons[i].style.display = 'inline-block';
        notificationButtons[i].addEventListener('click', askForNotificationPermission);
    }
}