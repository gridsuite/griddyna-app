/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { configs, plugins } from 'eslint-config-airbnb-extended';
import { rules as prettierConfigRules } from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import js from '@eslint/js';

const jsConfig = [
    // ESLint Recommended Rules
    {
        name: 'js/config',
        ...js.configs.recommended,
    },
    // Stylistic Plugin
    plugins.stylistic,
    // Import X Plugin
    plugins.importX,
    // Airbnb Base Recommended Config
    ...configs.base.recommended,
];

const reactConfig = [
    // React Plugin
    plugins.react,
    // React Hooks Plugin
    plugins.reactHooks,
    // React JSX A11y Plugin
    plugins.reactA11y,
    // Airbnb React Recommended Config
    ...configs.react.recommended,
];

const typescriptConfig = [
    // TypeScript ESLint Plugin
    plugins.typescriptEslint,
    // Airbnb Base TypeScript Config
    ...configs.base.typescript,
    // Airbnb React TypeScript Config
    ...configs.react.typescript,
];

const prettierConfig = [
    // Prettier Plugin
    {
        name: 'prettier/plugin/config',
        plugins: {
            prettier: prettierPlugin,
        },
    },
    // Prettier Config (disable conflicting rules)
    {
        name: 'prettier/config',
        rules: {
            ...prettierConfigRules,
            'prettier/prettier': 'warn',
        },
    },
];

const projectConfig = [
    {
        name: 'project/ignores',
        ignores: ['dist', 'build', 'coverage'],
    },
    {
        name: 'project/settings',
        settings: {
            react: {
                version: 'detect',
            },
            // TypeScript import resolver settings
            'import-x/parsers': {
                '@typescript-eslint/parser': ['.ts', '.tsx'],
            },
            'import-x/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
            },
        },
    },
    // React Refresh Plugin
    {
        name: 'project/react-refresh',
        files: ['**/*.{jsx,tsx}'],
        plugins: {
            'react-refresh': reactRefreshPlugin,
        },
        rules: {
            'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
        },
    },
    // React JSX Runtime (prevents "React must be in scope" errors)
    {
        name: 'project/react-jsx-runtime',
        files: ['**/*.{jsx,tsx}'],
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
        },
    },
    // Custom rules
    {
        name: 'project/rules',
        rules: {
            // Code style
            curly: 'error',
            'no-console': 'off',
            'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],

            // React rules
            'react/jsx-props-no-spreading': 'off',
            'react/require-default-props': 'off',

            // Import rules
            'import-x/prefer-default-export': 'off',
            'import-x/extensions': 'off',
            'import-x/no-unresolved': 'off',
            'import-x/no-useless-path-segments': 'off',
            'import-x/no-cycle': [
                'error',
                {
                    maxDepth: Infinity,
                    ignoreExternal: true,
                },
            ],
            'import-x/no-self-import': 'error',
            'import-x/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: [
                        'test/**', // tape, common npm pattern
                        'tests/**', // also common npm pattern
                        'spec/**', // mocha, rspec-like pattern
                        '**/__tests__/**', // jest pattern
                        '**/__mocks__/**', // jest pattern
                        'test.{js,jsx,ts,tsx}', // repos with a single test file
                        'test-*.{js,jsx,ts,tsx}', // repos with multiple top-level test files
                        '**/*{.,_}{test,spec}.{js,jsx,ts,tsx}', // tests where the extension or filename suffix denotes that it is a test
                        '**/jest.config.ts', // jest config
                        '**/jest.setup.ts', // jest setup
                        '**/prettier.config.js',
                        '**/vite.config.ts',
                        '**/eslint.config.js',
                    ],
                    optionalDependencies: false,
                },
            ],

            // ============================================
            // Rules disabled to match old .eslintrc.json behavior
            // ============================================
            // import-x
            'import-x/order': 'off',
            'import-x/no-rename-default': 'off',

            // react
            'react/function-component-definition': 'off',
            'react/jsx-curly-brace-presence': 'off',
            'react/jsx-boolean-value': 'off',
            'react/jsx-no-bind': 'off',
            'react/no-array-index-key': 'off',
            'react/no-unstable-nested-components': 'off',
            'react/prop-types': 'off',
            'react/forbid-prop-types': 'off',
            'react/self-closing-comp': 'off',

            // @typescript-eslint
            '@typescript-eslint/consistent-indexed-object-style': 'off',
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unnecessary-type-assertion': 'off',
            '@typescript-eslint/no-unsafe-enum-comparison': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-wrapper-object-types': 'off',

            // @stylistic
            '@stylistic/spaced-comment': 'off',

            // core
            'arrow-body-style': 'off',
            'dot-notation': 'off',
            eqeqeq: 'off',
            'no-else-return': 'off',
            'no-nested-ternary': 'off',
            'no-param-reassign': 'off',
            'no-shadow': 'off',
            'no-underscore-dangle': 'off',
            'no-unneeded-ternary': 'off',
            'no-unsafe-optional-chaining': 'off',
            'no-unused-expressions': 'off',
            'no-unused-vars': 'off',
            'no-use-before-define': 'off',
            'object-shorthand': 'off',
            'prefer-const': 'off',
            'prefer-destructuring': 'off',
            'prefer-object-spread': 'off',
            'prefer-template': 'off',
        },
    },
];

export default [...jsConfig, ...reactConfig, ...typescriptConfig, ...prettierConfig, ...projectConfig];
