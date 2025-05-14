// Service Worker 文件，负责离线缓存和资源管理
// 定义缓存名称
const CACHE_NAME = 'offline-cache-v1'
// 需要缓存的资源列表（仅缓存 public 目录下的静态资源和 index.html）
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/App.vue',
  '/vite.config.js',
  '/favicon.ico',
  '/manifest.json',
  '/offline.html',
]

// 安装事件：缓存静态资源
self.addEventListener('install', event => {
  // 安装时将资源添加到缓存
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  )
})

// 激活事件：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      )
    }).then(() => self.clients.claim()) // 立即控制所有客户端
  )
})

// fetch 事件：拦截请求，优先返回缓存内容
self.addEventListener('fetch', event => {
  // 忽略非 GET 请求和 chrome-extension 请求
  if (event.request.method !== 'GET' || 
    event.request.url.startsWith('chrome-extension')) {
    return;
  }

  event.respondWith(
    // 首先尝试从缓存获取
    caches.match(event.request)
      .then(response => {
        console.log('Fetching from cache111:', response);
        // 缓存命中 - 返回缓存内容
        if (response) {
          return response;
        }

      // 对于 HTML 页面，使用网络优先策略
      if (event.request.headers.get('accept').includes('text/html')) {
        return fetch(event.request)
          .then(networkResponse => {
            // 克隆响应以进行缓存
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            return networkResponse;
          })
          .catch(() => {
            // 网络失败时返回离线页面
            return caches.match('/offline.html');
          });
      }
      // 对于其他资源，使用缓存优先策略
      return fetch(event.request)
      .then(networkResponse => {
        // 动态缓存非预缓存资源
        if (!networkResponse || 
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, responseToCache));

        return networkResponse;
      })
      .catch(() => {
        // 可以返回回退资源或空响应
        return new Response('', { 
          status: 408, 
          statusText: 'Offline' 
        });
      });
    })
  )
});
