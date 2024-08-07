/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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
        createProxyMiddleware('http://localhost:5036/api/dynamic-mapping-server', {
            pathRewrite: { '^/api/dynamic-mapping-server/': '/' },
        })
    );
    app.use(
        createProxyMiddleware('http://localhost:5001/api/study-server', {
            pathRewrite: { '^/api/study-server/': '/' },
        })
    );
};
