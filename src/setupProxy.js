const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        createProxyMiddleware('http://localhost:5036/api/dynamic-server', {
            pathRewrite: { '^/api/dynamic-server/': '/' },
        })
    );
    app.use(
        createProxyMiddleware('http://localhost:5036/ws/dynamic-server', {
            pathRewrite: { '^/ws/dynamic-server/': '/' },
            ws: true,
        })
    );
    app.use(
        createProxyMiddleware('http://localhost:9000/api/gateway', {
            pathRewrite: { '^/api/gateway/': '/' },
        })
    );
    app.use(
        createProxyMiddleware('http://localhost:9000/ws/gateway', {
            pathRewrite: { '^/ws/gateway/': '/' },
            ws: true,
        })
    );
};
