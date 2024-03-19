const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
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
    app.use(
        createProxyMiddleware(
            'http://localhost:5036/api/dynamic-mapping-server',
            {
                pathRewrite: { '^/api/dynamic-mapping-server/': '/' },
            }
        )
    );
    app.use(
        createProxyMiddleware('http://localhost:5001/api/study-server', {
            pathRewrite: { '^/api/study-server/': '/' },
        })
    );
};
