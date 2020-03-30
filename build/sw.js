importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

workbox.routing.registerRoute(
    // new RegExp('https://jsonplaceholder.typicode.com/users'),
    new RegExp('userTestJson.json'),
    new workbox.strategies.NetworkFirst()
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

workbox.precaching.precacheAndRoute([{"revision":"abc9483659f36a330fa7a3820c4256bf","url":"css/calendar.css"},{"revision":"5eaf54831efcbcdfec2cdc44788dbede","url":"css/main.css"},{"revision":"66be084159a745d11c7da5e95fac71dd","url":"index.html"},{"revision":"2a2380ccfd464eb45c1946911437c6d0","url":"js/app.js"},{"revision":"eb088adaa799e03ad02c2fab6f8136a3","url":"js/calendar.js"},{"revision":"edd4495e66b5cb260886662b5e5b2e42","url":"js/workbox-7248be78.js"}]);