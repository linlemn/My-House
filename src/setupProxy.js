const { createProxyMiddleware } = require('http-proxy-middleware');
 
module.exports = function (app) {
 app.use(
 createProxyMiddleware('/bibi', {
  "target": "http://103.79.27.148:15345",
  changeOrigin: true,
 })
 )
}