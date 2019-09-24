navigator.serviceWorker.register('./sw.js').then(function (reg) {
    console.log('Service worker has been registered.');

    if (!navigator.serviceWorker.controller) {
        return;
    }

    if (reg.waiting) {
        navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
    }

    if (reg.installing) {
        navigator.serviceWorker.addEventListener('statechange', function () {
            if (navigator.serviceWorker.controller.state == 'installed') {
                navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
            }
        });
    }

    reg.addEventListener('updatefound', function () {
        navigator.serviceWorker.addEventListener('statechange', function () {
            if (navigator.serviceWorker.controller.state == 'installed') {
                navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
            }
        });
    });

}).catch(function () {
    console.log('Something has failed while registering the service worker');
});

var refreshing;
navigator.serviceWorker.addEventListener('onControllerChanged', function () {
    if (refreshing) {
        return;
    }

    window.location.reload();
    refreshing = true;
})

navigator.serviceWorker.ready.then(function (swRegistration) {
    return swRegistration.sync.register('syncTag');
});

function onConnected() {
    console.log('Connected...');
}

function onOffline() {
    console.log('Disconnected...');
}

window.addEventListener('online', onConnected);
window.addEventListener('offline', onOffline);
