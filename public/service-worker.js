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
    })
  )
})

// fetch 事件：拦截请求，优先返回缓存内容
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      console.log(111, response)
      // 如果缓存中有匹配的资源，则直接返回
      if (response) return response;
      // 否则尝试从网络获取
      return fetch(event.request).catch(() => {
        console.log(222, event.request.mode)

        // 其他资源断网时可返回自定义离线页面
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});