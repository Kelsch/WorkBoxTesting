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

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);