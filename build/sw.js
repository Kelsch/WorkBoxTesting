importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js', '/js/app.js');

// workbox.routing.registerRoute(
//     // new RegExp('https://jsonplaceholder.typicode.com/users'),
//     new RegExp('userTestJson.json'),
//     new workbox.strategies.StaleWhileRevalidate()
// );

workbox.routing.registerRoute(
    // new RegExp('https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getNonWorkDays'),
    new RegExp(`${apiURL}/api/installerAppData/getNonWorkDays`),
    new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
    // new RegExp('https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getInstallIndicators'),
    new RegExp(`${apiURL}/api/installerAppData/getInstallIndicators`),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'job-list',
    })
);

workbox.routing.registerRoute(
    new RegExp(`${apiURL}/api/installerAppData/getInstallJobsDesignSets`),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'job-designSets-list',
    })
);

workbox.routing.registerRoute(
    new RegExp(`${apiURL}/api/installerAppData/getJobsLayouts`),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'jobs-layout-list',
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
    new RegExp(`${apiURL}/api/installerAppData/postJobinstallPORequest`),
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

workbox.precaching.precacheAndRoute([{"revision":"3a94fe1fa46941d3062a72e119fb9136","url":"css/calendar.css"},{"revision":"25245eb36e8e452b743fdad734d47671","url":"css/jobCard.css"},{"revision":"212ae1f33efb2c47984d6f94d2ec1b04","url":"css/main.css"},{"revision":"0bb0bb1ba22fee03c54afe37d749b6b5","url":"css/materialDesignOverride.css"},{"revision":"e8b3d535cea3eac50e33901aa60fabbb","url":"css/refreshControl.css"},{"revision":"8c4a08b94dafe879c82e4cadb39207c5","url":"index.html"},{"revision":"1e7ab1f13785cd76020d2e41aa0180bd","url":"js/apiFetch.js"},{"revision":"14778ca481c97aab471a875a7921ea7e","url":"js/app.js"},{"revision":"be9c8e7fc3f43cb182e1a63721a97a9e","url":"js/calendar.js"},{"revision":"c3b12a0f396e416ae47b228b76280af9","url":"js/jsClass/designSetInfoCardElement.js"},{"revision":"8f7b27db8c8edae1581ef4d43ac709d9","url":"js/jsClass/jobCardElement.js"},{"revision":"4203bbb0a1a4a5fb4cd4b57b472f2f41","url":"js/modalCreation.js"},{"revision":"dfc20073d069c76c1b67606f3b916e8c","url":"js/refreshControl.js"},{"revision":"8618cac677171c71ee01a7027cdb659b","url":"js/swiped-events.js"},{"revision":"edd4495e66b5cb260886662b5e5b2e42","url":"js/workbox-7248be78.js"}]);