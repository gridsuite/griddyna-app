/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import react from '@vitejs/plugin-react';
import { CommonServerOptions, defineConfig } from 'vite';
// @ts-expect-error See https://github.com/gxmari007/vite-plugin-eslint/issues/79
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const serverSettings: CommonServerOptions = {
    port: 3003,
    proxy: {
        // remove the prefix from URL path
        '/api/gateway': {
            target: 'http://localhost:9000',
            rewrite: (path) => path.replace(/^\/api\/gateway/, ''),
            changeOrigin: true,
        },
        '/ws/gateway': {
            target: 'http://localhost:9000',
            rewrite: (path) => path.replace(/^\/ws\/gateway/, ''),
            changeOrigin: true,
            ws: true, // enable websocket proxying
        },
        '/api/dynamic-mapping-server': {
            target: 'http://localhost:5036',
            rewrite: (path) => path.replace(/^\/api\/dynamic-mapping-server/, ''),
            changeOrigin: true,
        },
        '/api/study-server': {
            target: 'http://localhost:5001',
            rewrite: (path) => path.replace(/^\/api\/study-server/, ''),
            changeOrigin: true,
        },
    },
};

export default defineConfig((config) => ({
    plugins: [
        react(),
        eslint({
            failOnWarning: config.mode !== 'development',
            lintOnStart: true,
        }),
        svgr(), // works on every import with the pattern "**/*.svg?react"
        tsconfigPaths(), // to resolve absolute path via tsconfig cf https://stackoverflow.com/a/68250175/5092999
    ],
    base: './',
    server: serverSettings, // for npm run start
    preview: serverSettings, // for npm run serve (use local build)
    build: {
        outDir: 'build',
    },
}));
