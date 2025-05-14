import { createApp } from 'vue'
import App from './App.vue'

// 注册你的 worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js', {
      /**
       scope参数是可选的, 用来指定你想要 service worker 控制的子作用域;
        '/' 表示 app 的源（origin）下的所有内容
      */
      scope: "/", 
      
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
  })
}
// export function unregister() {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.ready.then(registration => {
//       registration.unregister();
//     });
//   }
// }

// unregister();

createApp(App).mount('#app')
