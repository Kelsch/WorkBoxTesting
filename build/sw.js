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
            console.log(queue)
            console.log(queue.o)
            await queue.replayRequests();

            // The replay was successful! Notification logic can go here.
            console.log('Replay complete!');
        } catch (error) {
            // The replay failed...
            console.log(error);
        }
    }
});

// const queue = new workbox.backgroundSync.Queue('bgQueueConfig', {
//     onSync: async (queue) => {
//       let entry;
//       while (entry = await this.shiftRequest()) {
//           console.log(entry, queue)
//         try {
//           await fetch(entry.request);
//           console.error('Replay successful for request', entry.request);
//         } catch (error) {
//           console.error('Replay failed for request', entry.request, error);

//           // Put the entry back in the queue and re-throw the error:
//           await this.unshiftRequest(entry);
//           throw error;
//         }
//       }
//       console.log('Replay complete!');
//     }
//   });

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

workbox.precaching.precacheAndRoute([{"revision":"3a94fe1fa46941d3062a72e119fb9136","url":"css/calendar.css"},{"revision":"25245eb36e8e452b743fdad734d47671","url":"css/jobCard.css"},{"revision":"212ae1f33efb2c47984d6f94d2ec1b04","url":"css/main.css"},{"revision":"0bb0bb1ba22fee03c54afe37d749b6b5","url":"css/materialDesignOverride.css"},{"revision":"e8b3d535cea3eac50e33901aa60fabbb","url":"css/refreshControl.css"},{"revision":"ae3b7da9c6e1e3c9994cd7c3d8035a36","url":"index.html"},{"revision":"e25ab196065565940bc3c0c38632efaf","url":"js/apiFetch.js"},{"revision":"a4bd17453e1ad75b0b2a1c31d78b677c","url":"js/app.js"},{"revision":"6f8102a25d5b91861a23c3b9036205b0","url":"js/calendar.js"},{"revision":"c3b12a0f396e416ae47b228b76280af9","url":"js/jsClass/designSetInfoCardElement.js"},{"revision":"8f7b27db8c8edae1581ef4d43ac709d9","url":"js/jsClass/jobCardElement.js"},{"revision":"a507f0cf47b1b7b93fb6b15efbfe8adb","url":"js/modalCreation.js"},{"revision":"dfc20073d069c76c1b67606f3b916e8c","url":"js/refreshControl.js"},{"revision":"8618cac677171c71ee01a7027cdb659b","url":"js/swiped-events.js"},{"revision":"edd4495e66b5cb260886662b5e5b2e42","url":"js/workbox-7248be78.js"}]);