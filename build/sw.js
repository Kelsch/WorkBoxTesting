importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js', '/js/app.js');

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

// Material Components CSS not including the Javascript because it is not essential
workbox.routing.registerRoute(
    new RegExp('https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.css'),
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

workbox.precaching.precacheAndRoute([{"revision":"72def662b52a88a432b3f80802574c96","url":"css/calendar.css"},{"revision":"2ad42f73f91d9ccd75e88088d3cb2f2e","url":"css/jobCard.css"},{"revision":"52f176532ddad2483a939900b0b97f56","url":"css/main.css"},{"revision":"e8b3d535cea3eac50e33901aa60fabbb","url":"css/refreshControl.css"},{"revision":"e1cc16b892ecd067feb8f402cb92a26c","url":"index.html"},{"revision":"62eda0e198b836b3fb2df5bdd475388a","url":"js/apiFetch.js"},{"revision":"c8733c31d750c9f29995c3c66275854b","url":"js/app.js"},{"revision":"6f8102a25d5b91861a23c3b9036205b0","url":"js/calendar.js"},{"revision":"fdc15432a04c4d099dd3205bdb1e7d72","url":"js/jsClass/designSetInfoCardElement.js"},{"revision":"250f223ceb298b1754d50748586a4b8f","url":"js/jsClass/jobCardElement.js"},{"revision":"8a51b757e39744ce430bf5200674da76","url":"js/modalCreation.js"},{"revision":"ec509908c126fc30563afeaf5907a777","url":"js/refreshControl.js"},{"revision":"8618cac677171c71ee01a7027cdb659b","url":"js/swiped-events.js"},{"revision":"edd4495e66b5cb260886662b5e5b2e42","url":"js/workbox-7248be78.js"}]);