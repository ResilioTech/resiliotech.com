// Service Worker for Resilio Tech Website
// Provides offline support and performance caching

const CACHE_NAME = 'resilio-tech-v1.0.0';
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/projects/',
    '/projects/index.html',
    '/resources/',
    '/resources/index.html',
    
    // CSS Files
    '/shared/css/common.css',
    '/assets/css/styles.css',
    '/resources/assets/css/resources.css',
    '/projects/assets/css/projects.css',
    
    // JavaScript Files
    '/shared/js/utils.js',
    '/shared/js/common.js',
    '/assets/js/main.js',
    '/resources/assets/js/resources.js',
    '/projects/assets/js/projects.js',
    
    // Images
    '/assets/images/logo.svg',
    
    // Components
    '/shared/components/header.html',
    '/shared/components/navigation.html',
    '/shared/components/footer.html',
    '/shared/components/meta.html',
    
    // Web App Manifest
    '/manifest.json',
    
    // Fonts (if using web fonts)
    // Add font URLs here
];

// Install event - cache assets
self.addEventListener('install', event => {
    // console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // console.log('Caching app shell');
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => {
                // console.log('Service Worker installed successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker install failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if (cache !== CACHE_NAME) {
                            console.log('Deleting old cache:', cache);
                            return caches.delete(cache);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        cacheFirst(event.request)
    );
});

// Cache-first strategy with network fallback
async function cacheFirst(request) {
    try {
        // Try to get from cache first
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            // Update cache in background if needed
            updateCacheInBackground(request);
            return cachedResponse;
        }
        
        // If not in cache, fetch from network
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('Fetch failed:', error);
        
        // Return offline fallback for HTML requests
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html') || 
                   new Response('Offline - Please check your connection', {
                       status: 503,
                       statusText: 'Service Unavailable'
                   });
        }
        
        throw error;
    }
}

// Update cache in background (stale-while-revalidate)
async function updateCacheInBackground(request) {
    try {
        const response = await fetch(request);
        
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response);
        }
    } catch (error) {
        console.log('Background update failed:', error);
    }
}

// Handle messages from the client
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_CACHE_SIZE') {
        getCacheSize().then(size => {
            event.ports[0].postMessage({
                type: 'CACHE_SIZE',
                size: size
            });
        });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        clearCache().then(() => {
            event.ports[0].postMessage({
                type: 'CACHE_CLEARED'
            });
        });
    }
});

// Get cache size
async function getCacheSize() {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    
    let totalSize = 0;
    
    for (const key of keys) {
        const response = await cache.match(key);
        if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
        }
    }
    
    return totalSize;
}

// Clear cache
async function clearCache() {
    const cacheNames = await caches.keys();
    
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Handle any queued actions when back online
    console.log('Background sync triggered');
    
    // Example: sync form submissions, analytics, etc.
    // Implementation depends on your app's needs
}

// Push notification handling (if needed)
self.addEventListener('push', event => {
    if (event.data) {
        const options = {
            body: event.data.text(),
            icon: '/assets/images/logo.svg',
            badge: '/assets/images/logo.svg',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };
        
        event.waitUntil(
            self.registration.showNotification('Resilio Tech', options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Performance monitoring
self.addEventListener('fetch', event => {
    // Track performance metrics
    const startTime = performance.now();
    
    event.respondWith(
        cacheFirst(event.request).then(response => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // Log slow requests
            if (duration > 1000) {
                console.warn(`Slow request: ${event.request.url} took ${duration}ms`);
            }
            
            return response;
        })
    );
});

console.log('Service Worker loaded successfully');
