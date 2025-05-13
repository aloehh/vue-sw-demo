event.request.mode 取值如下（标准 MDN 文档）：
| 取值 | 含义 |
|--------------|---------------------------------------------------------------------|
| navigate | 导航请求（如用户在地址栏输入网址、点击链接、刷新页面等） |
| same-origin| 仅允许同源请求（默认的 fetch/资源请求） |
| no-cors | 允许跨域但不可访问响应内容（如 <img src=...>、外链 CSS/JS） |
| cors | 允许跨域并可访问响应内容（需服务端允许 CORS） |
| websocket | WebSocket 连接请求 |
实际开发中，判断 event.request.mode === 'navigate' 可用于识别页面导航请求（即 HTML 页面的请求），适合做离线 fallback。