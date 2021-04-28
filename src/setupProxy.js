const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        createProxyMiddleware('http://localhost:8080/api/dyna-server', {
            pathRewrite: { '^/api/dyna-server/': '/' },
        })
    );
    app.use(
        createProxyMiddleware('http://localhost:8080/ws/dyna-server', {
            pathRewrite: { '^/ws/dyna-server/': '/' },
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
