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
    new RegExp(`${apiURL}/api/installerAppData/postInstallJobsDesignSets`),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'job-designSets-list',
      }),
    'POST'
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

workbox.precaching.precacheAndRoute([{"revision":"85657d1bba8e409e99900d08315c4f7c","url":"css/calendar.css"},{"revision":"13f7d848d51014e248dbc0badfd025b1","url":"css/jobCard.css"},{"revision":"00a771612246876daac3dcd208024e39","url":"css/main.css"},{"revision":"38029eadd97a7a5c56b0a8d0ec475bee","url":"index.html"},{"revision":"c579213ae557af6561688a33bc97fa3f","url":"js/apiFetch.js"},{"revision":"4e6774967fdcfd72564c1a613eaee5c1","url":"js/app.js"},{"revision":"64a79bb704d1325c71dbfd041b116b68","url":"js/calendar.js"},{"revision":"dd1dd3013702b7cd8612cf66fd17b1e2","url":"js/jsClass/designSetInfoCardElement.js"},{"revision":"a0f31cf617d6f27da6036d7ffc8f8490","url":"js/jsClass/jobCardElement.js"},{"revision":"808317934d6af89a3a652b7832768796","url":"js/modalCreation.js"},{"revision":"8618cac677171c71ee01a7027cdb659b","url":"js/swiped-events.js"},{"revision":"edd4495e66b5cb260886662b5e5b2e42","url":"js/workbox-7248be78.js"}]);