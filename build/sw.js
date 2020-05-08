importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js', '/js/app.js');

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
    new RegExp('https://unpkg.com/material-components-web@v4.0.0/dist/'),
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
    maxRetentionTime: 24 * 60 // Retry for max of 24 hours (specified in minutes)
});

workbox.routing.registerRoute(
    new RegExp(`${apiURL}/api/installerAppData/postJobInstallCompletion`),
    new workbox.strategies.NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);

workbox.precaching.precacheAndRoute([{"revision":"3a94fe1fa46941d3062a72e119fb9136","url":"css/calendar.css"},{"revision":"89e763e694d665f3445b195c63e8ab14","url":"css/jobCard.css"},{"revision":"caac9d3ff0c3ea6ff98b0d3d1a144f11","url":"css/main.css"},{"revision":"e8b3d535cea3eac50e33901aa60fabbb","url":"css/refreshControl.css"},{"revision":"55ef8393d5579f593c33b3203765d53d","url":"index.html"},{"revision":"a60142e2adb0ea6bbd03653fa8d7c1f4","url":"js/apiFetch.js"},{"revision":"3ade51f96a6bef4084993dec5502b07e","url":"js/app.js"},{"revision":"6f8102a25d5b91861a23c3b9036205b0","url":"js/calendar.js"},{"revision":"fdc15432a04c4d099dd3205bdb1e7d72","url":"js/jsClass/designSetInfoCardElement.js"},{"revision":"c11abe07bea2d35928e50c1a3b58b767","url":"js/jsClass/jobCardElement.js"},{"revision":"eef47629f598b1b4ab690eafed11e318","url":"js/modalCreation.js"},{"revision":"dfc20073d069c76c1b67606f3b916e8c","url":"js/refreshControl.js"},{"revision":"8618cac677171c71ee01a7027cdb659b","url":"js/swiped-events.js"},{"revision":"edd4495e66b5cb260886662b5e5b2e42","url":"js/workbox-7248be78.js"}]);