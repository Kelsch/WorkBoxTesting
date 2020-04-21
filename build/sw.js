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

workbox.precaching.precacheAndRoute([{"revision":"85657d1bba8e409e99900d08315c4f7c","url":"css/calendar.css"},{"revision":"2ad42f73f91d9ccd75e88088d3cb2f2e","url":"css/jobCard.css"},{"revision":"241a4b39493315e52d8a98a168763015","url":"css/main.css"},{"revision":"e8b3d535cea3eac50e33901aa60fabbb","url":"css/refreshControl.css"},{"revision":"1644e59423e9911c1a606def52073551","url":"index.html"},{"revision":"f5facc0a85be8c545a8f0afcc1aec108","url":"js/apiFetch.js"},{"revision":"cacc974c1d7f10c26afbeeef972b0512","url":"js/app.js"},{"revision":"67407aa5dc86ffd1da48af1abdba1b7d","url":"js/calendar.js"},{"revision":"fdc15432a04c4d099dd3205bdb1e7d72","url":"js/jsClass/designSetInfoCardElement.js"},{"revision":"79b8af2c975ac97878741a173a740c36","url":"js/jsClass/jobCardElement.js"},{"revision":"558ac803f62d4e2c5fbee31c75e5789d","url":"js/modalCreation.js"},{"revision":"bbd4348497b30dcb1ad7caf21256136c","url":"js/refreshControl.js"},{"revision":"8618cac677171c71ee01a7027cdb659b","url":"js/swiped-events.js"},{"revision":"edd4495e66b5cb260886662b5e5b2e42","url":"js/workbox-7248be78.js"}]);