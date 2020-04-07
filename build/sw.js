importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

const apiURL = 'https://142.11.229.62:45455';

// workbox.routing.registerRoute(
//     // new RegExp('https://jsonplaceholder.typicode.com/users'),
//     new RegExp('userTestJson.json'),
//     new workbox.strategies.StaleWhileRevalidate()
// );
console.log(apiURL)
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

workbox.precaching.precacheAndRoute([{"revision":"85657d1bba8e409e99900d08315c4f7c","url":"css/calendar.css"},{"revision":"13f7d848d51014e248dbc0badfd025b1","url":"css/jobCard.css"},{"revision":"00a771612246876daac3dcd208024e39","url":"css/main.css"},{"revision":"76937b8c238433564d87f1400221753a","url":"index.html"},{"revision":"cb586939778928499f17c63df4cdeb05","url":"js/apiFetch.js"},{"revision":"7f99fb629e4408475ef3ee6472757ee3","url":"js/app.js"},{"revision":"64a79bb704d1325c71dbfd041b116b68","url":"js/calendar.js"},{"revision":"45d0cda278e354ed3d8b53dae5fc5bae","url":"js/jsClass/designSetInfoCardElement.js"},{"revision":"f2af467a1ce7343d4f9a5c52124cd22c","url":"js/jsClass/jobCardElement.js"},{"revision":"12bb0ff7fd302963e812dd90e6a3492c","url":"js/modalCreation.js"},{"revision":"8618cac677171c71ee01a7027cdb659b","url":"js/swiped-events.js"},{"revision":"edd4495e66b5cb260886662b5e5b2e42","url":"js/workbox-7248be78.js"}]);