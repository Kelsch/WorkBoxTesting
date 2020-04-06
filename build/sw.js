importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

// workbox.routing.registerRoute(
//     // new RegExp('https://jsonplaceholder.typicode.com/users'),
//     new RegExp('userTestJson.json'),
//     new workbox.strategies.StaleWhileRevalidate()
// );

workbox.routing.registerRoute(
    new RegExp('https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getNonWorkDays'),
    new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
    new RegExp('https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getInstallIndicators'),
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

workbox.precaching.precacheAndRoute([{"revision":"36c10fce3c445e90b1cd3e920c5cc757","url":"css/calendar.css"},{"revision":"2285114f5bfeb835364a7f360efe6bcf","url":"css/jobCard.css"},{"revision":"00a771612246876daac3dcd208024e39","url":"css/main.css"},{"revision":"4fadc95f0aec11802b0f1c347cfb13c6","url":"index.html"},{"revision":"6973e900aff9d25ace1b77146ec285ea","url":"js/apiFetch.js"},{"revision":"7f99fb629e4408475ef3ee6472757ee3","url":"js/app.js"},{"revision":"64a79bb704d1325c71dbfd041b116b68","url":"js/calendar.js"},{"revision":"c9f38a1086ada6cc74ebeb111d471bac","url":"js/jobCard.js"},{"revision":"8618cac677171c71ee01a7027cdb659b","url":"js/swiped-events.js"},{"revision":"edd4495e66b5cb260886662b5e5b2e42","url":"js/workbox-7248be78.js"}]);