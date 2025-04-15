importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js', '/js/app.js');

// workbox.routing.registerRoute(
//     // new RegExp('https://jsonplaceholder.typicode.com/users'),
//     new RegExp('userTestJson.json'),
//     new workbox.strategies.StaleWhileRevalidate()
// );

// Detailed logging is very useful during development
workbox.setConfig({debug: true});

// Updating SW lifecycle to update the app after user triggered refresh
workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
    new RegExp(`${apiURL}/api/installerAppData/getNonWorkDays`),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'non-workDay',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 4,
            }),
        ],
    })
);

//workbox.routing.registerRoute(
//    new RegExp(`${apiURL}/api/installerAppData/getInstallerRating`),
//    new workbox.strategies.NetworkFirst({
//        cacheName: 'installer-rating',
//        plugins: [
//            new workbox.expiration.ExpirationPlugin({
//                maxAgeSeconds: 60 * 60 * 4,
//            }),
//        ],
//    })
//);

workbox.routing.registerRoute(
    new RegExp(`${apiURL}/api/installerAppData/getInstallIndicators`),
    new workbox.strategies.NetworkFirst({
        cacheName: 'job-list',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 4,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    new RegExp(`${apiURL}/api/installerAppData/getInstallerJobNotification`),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'job-notification-list',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 4,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    new RegExp(`${apiURL}/api/installerAppData/getInstallJobsDesignSets`),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'job-designSets-list',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 4,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    new RegExp(`${apiURL}/api/installerAppData/getJobsLayouts`),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'jobs-layout-list',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 4,
            }),
        ],
    })
);

// Cache the Google Fonts stylesheets with a cache first strategy.
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

// Material Components CSS and JS
workbox.routing.registerRoute(
    new RegExp('https://unpkg.com/material-components-web@v6.0.0/dist/'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-material-components',
    })
);

// Time Picker UI
workbox.routing.registerRoute(
    new RegExp('/build/timepicker-ui/dist/'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'time-picker-ui',
    })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);

const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('bgPluginConfig', {
    maxRetentionTime: 24 * 60, // Retry for max of 24 hours (specified in minutes)
    onSync: async (queue) => {
        try {
            await queue.queue.replayRequests();

            // The replay was successful! Notification logic can go here.
            console.log('Replay complete!');
        } catch (error) {
            // The replay failed...
            console.log(error);
        }
    }
});

workbox.routing.registerRoute(
    new RegExp(`${apiURL}/api/installerAppData/postJobInstallCompletion`),
    new workbox.strategies.NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);

workbox.routing.registerRoute(
    new RegExp(`${apiURL}/api/installerAppData/postJobToggleInstallConfirmation`),
    new workbox.strategies.NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);

workbox.routing.registerRoute(
    new RegExp(`${apiURL}/api/installerAppData/postJobinstallPORequest`),
    new workbox.strategies.NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);

workbox.routing.registerRoute(
    new RegExp(`${apiURL}/api/installerAppData/postJobInstallDateTimeChange`),
    new workbox.strategies.NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);

self.addEventListener('fetch', (event) => {
    // Clone the request to ensure it's safe to read when
    // adding to the Queue.

    const promiseChain = fetch(event.request.clone()).catch((err) => {
        return queue.pushRequest({ request: event.request });
    });

    event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;

    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow('https://localhost:8181/');
        notification.close();
    }
});

workbox.precaching.precacheAndRoute([{"revision":"180293f8186d67e903ae62adf69188ae","url":"css/calendar.css"},{"revision":"aee6368e06474c927c4da8de593dc82b","url":"css/date-pick.css"},{"revision":"b9906c868f4fd0f3469dd611ce903afe","url":"css/jobCard.css"},{"revision":"618b7a6221ac53f5ae693a21f18783f0","url":"css/main.css"},{"revision":"a326b7ccd8c4ec6fe6ccf162aaa0c597","url":"css/materialDesignOverride.css"},{"revision":"1004b7c5a4ff02a6b3a863f557041e40","url":"css/notificationMenu.css"},{"revision":"e8b3d535cea3eac50e33901aa60fabbb","url":"css/refreshControl.css"},{"revision":"ae7e570c551bfeecf3b7c9d29f1a1408","url":"css/searchContent.css"},{"revision":"5b02991859c18cc0c981dc9803afbdf4","url":"index.html"},{"revision":"706fdb3fc25438846058f735e0a70f2c","url":"js/apiFetch.js"},{"revision":"7f21bf2aa3fc3318a1db93e5264c0574","url":"js/app.js"},{"revision":"c980016989d6d1dfb76850efc491015a","url":"js/calendar.js"},{"revision":"00cd9167d7aa759132d0fc7549a57721","url":"js/date-pick.js"},{"revision":"88c6a2e3caf0b9b2bcc143c42362bf3b","url":"js/jsClass/designSetInfoCardElement.js"},{"revision":"7143394fccb9095cbc8f28fe91b2d2ae","url":"js/jsClass/jobCardElement.js"},{"revision":"a71eb6fb74a5770e9b15c74579084dd5","url":"js/misc.js"},{"revision":"62bd3954dcf83d0166d90a8aa75ce879","url":"js/modalCreation.js"},{"revision":"f8577277051dbeb154123ea1d7d160f1","url":"js/notification.js"},{"revision":"dfc20073d069c76c1b67606f3b916e8c","url":"js/refreshControl.js"},{"revision":"b893e251fd22b7019d63c30d25b4ba9c","url":"js/search.js"},{"revision":"8618cac677171c71ee01a7027cdb659b","url":"js/swiped-events.js"},{"revision":"d8de3cfe1d50872753350425951493d5","url":"js/timepicker-ui.js"},{"revision":"f1c35845766e78ccf5b35437d4ec43ec","url":"js/workbox-7248be78.js"},{"revision":"e69c668f5b1158378f2c04b20c5afea8","url":"privacy.html"}]);