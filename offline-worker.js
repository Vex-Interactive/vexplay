const CACHE_NAME = 'VexPlay-cache';
const OFFLINE_URLS = [
    '/offline.html',
    '/eu3-chat.html',
    '/storage/css/themes.css',
    '/storage/js/theme.js',
    '/storage/fonts/ubuntu/Ubuntu.woff2'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(OFFLINE_URLS).then(function() {
                self.skipWaiting();
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => client.postMessage('cached'));
                });
            });
        })
    );
});

self.addEventListener('fetch', function(event) {
    // Skip Firebase requests
    if (event.request.url.includes('firebase') || 
        event.request.url.includes('googleapis') ||
        event.request.url.includes('gstatic.com')) {
        return;
    }

    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request).then(function(response) {
                if (response) {
                    return response;
                }
                // Don't show offline page for chat
                if (event.request.mode === 'navigate' && !event.request.url.includes('chat')) {
                    return caches.match('./offline.html');
                }
            });
        })
    );
});

self.addEventListener('activate', function(event) {
    var cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});


