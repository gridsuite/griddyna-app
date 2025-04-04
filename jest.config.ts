/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^.+\\.svg\\?react$': '<rootDir>/src/_mocks_/svg.tsx',
        '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: ['node_modules/(?!@gridsuite/commons-ui|react-dnd|dnd-core|@react-dnd)'], // transform from ESM
    moduleDirectories: ['node_modules', 'src'], // to allow absolute path from ./src
    globals: {
        IS_REACT_ACT_ENVIRONMENT: true,
    },
    setupFiles: ['<rootDir>/jest.setup.ts'],
};

export default config;
