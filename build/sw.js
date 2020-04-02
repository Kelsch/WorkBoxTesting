importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

workbox.routing.registerRoute(
    // new RegExp('https://jsonplaceholder.typicode.com/users'),
    new RegExp('userTestJson.json'),
    new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
    new RegExp('https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getNonWorkDays'),
    new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
    new RegExp('https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getInstallIndicators'),
    new workbox.strategies.StaleWhileRevalidate()
);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
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

workbox.precaching.precacheAndRoute([{"revision":"cb614876712bdf089679a8071dafbb18","url":"css/calendar.css"},{"revision":"52d4a6168b8884415e148deb36016fd0","url":"css/main.css"},{"revision":"bda648045bfb4c4395e8ae3a8cbf8315","url":"index.html"},{"revision":"c826dfd18c565dbe4b093a19b2ce7e50","url":"js/app.js"},{"revision":"3c15ff4ecece402fbd32831eacb4b74f","url":"js/calendar.js"},{"revision":"8618cac677171c71ee01a7027cdb659b","url":"js/swiped-events.js"},{"revision":"edd4495e66b5cb260886662b5e5b2e42","url":"js/workbox-7248be78.js"}]);