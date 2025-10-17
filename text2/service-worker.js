const CACHE_NAME = 'text2-cache-v4';
const STATIC_CACHE = 'text2-static-v4';
const DYNAMIC_CACHE = 'text2-dynamic-v4';
const VERSION = '4.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/favicon.ico',
  '/manifest.json',
  '/browserconfig.xml',
  '/logoc.png',
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap',
  'https://fonts.gstatic.com/s/quicksand/v30/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkP8o58a-xw.woff2',
  'https://fonts.gstatic.com/s/quicksand/v30/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkM0o58a-xw.woff2'
];

// API endpoints to cache
const API_CACHE = [
  'https://generativelanguage.googleapis.com/',
  'https://chat.text2.click/',
  'https://img.text2.click/'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker installing... Version:', VERSION);
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches and force update
self.addEventListener('activate', event => {
  console.log('Service Worker activating... Version:', VERSION);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== STATIC_CACHE && 
                 cacheName !== DYNAMIC_CACHE && 
                 cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      // Force all clients to reload
      return self.clients.claim().then(() => {
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'FORCE_RELOAD',
              version: VERSION,
              timestamp: Date.now()
            });
          });
        });
      });
    })
  );
});

// Fetch event - serve from cache, fallback to network with cache busting
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Add cache busting for HTML files
  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(handleHTMLRequest(request));
    return;
  }

  // Handle different types of requests
  if (url.origin === self.location.origin) {
    // Same-origin requests
    event.respondWith(handleSameOriginRequest(request));
  } else if (API_CACHE.some(api => url.href.startsWith(api))) {
    // API requests
    event.respondWith(handleAPIRequest(request));
  } else if (url.protocol === 'https:' && 
             (url.pathname.includes('.css') || 
              url.pathname.includes('.js') || 
              url.pathname.includes('.png') || 
              url.pathname.includes('.jpg') || 
              url.pathname.includes('.ico'))) {
    // External static resources
    event.respondWith(handleExternalStaticRequest(request));
  } else {
    // Other requests - network first
    event.respondWith(handleNetworkFirstRequest(request));
  }
});

// Handle HTML requests with cache busting
async function handleHTMLRequest(request) {
  try {
    // Always try network first for HTML files
    const networkResponse = await fetch(request, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (networkResponse.ok) {
      // Update cache with new version
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      
      // Notify clients about the update
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'CONTENT_UPDATED',
          url: request.url,
          timestamp: Date.now()
        });
      });
    }
    
    return networkResponse;
  } catch (error) {
    console.error('HTML request failed, trying cache:', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Handle same-origin requests
async function handleSameOriginRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Error handling same-origin request:', error);
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Handle API requests
async function handleAPIRequest(request) {
  try {
    // Network first for API requests
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('API request failed, trying cache:', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Handle external static requests
async function handleExternalStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('External static request failed:', error);
    throw error;
  }
}

// Handle network-first requests
async function handleNetworkFirstRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Network request failed, trying cache:', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Perform background sync tasks
    console.log('Performing background sync...');
    
    // Check for updates
    await checkForUpdates();
    
    // Example: sync search queries, user preferences, etc.
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'background-sync-complete',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Check for updates
async function checkForUpdates() {
  try {
    // Check if there's a new version of the main page
    const response = await fetch('/', {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
    if (response.ok) {
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'UPDATE_AVAILABLE',
          timestamp: Date.now()
        });
      });
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
}

// Push notification handling
self.addEventListener('push', event => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Text2 has a new update!',
    icon: '/logoc.png',
    badge: '/logoc.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open Text2',
        icon: '/logoc.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/logoc.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Text2', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', event => {
  console.log('Message received in service worker:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.addAll(event.data.urls);
      })
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('Clearing cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    event.waitUntil(checkForUpdates());
  }
}); 