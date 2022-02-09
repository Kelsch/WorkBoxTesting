if ('Notification' in window && navigator.serviceWorker) {
    // Display the UI to let the user toggle notifications
    Notification.requestPermission(function(status) {
        console.log('Notification permission status:', status);
    });
}

function displayNotification() {
    if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(function(reg) {
        var options = {
            body: 'This is a test notification',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {action: 'open', title: 'Open PDInstall'},
                {action: 'close', title: 'Close notification'},
            ]
            };
            reg.showNotification('Hello world!', options);
        });
    } else if (Notification.permission === "blocked") {
    Notification.requestPermission(function(status) {
        console.log('Notification permission status:', status);
    });
    } else {
        /* show a prompt to the user */
    }
}