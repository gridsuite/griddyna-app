/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'typeface-roboto';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import './index.css';
import App from './components/app';
import { store } from './redux/store';

import messages_en from './translations/en.json';
import messages_fr from './translations/fr.json';

import {
    card_error_boundary_en,
    card_error_boundary_fr,
    CardErrorBoundary,
    filter_en,
    filter_expert_en,
    filter_expert_fr,
    filter_fr,
    login_en,
    login_fr,
    top_bar_en,
    top_bar_fr,
} from '@gridsuite/commons-ui';

const messages = {
    en: {
        ...messages_en,
        ...login_en,
        ...top_bar_en,
        ...card_error_boundary_en,
        ...filter_en,
        ...filter_expert_en,
    },
    fr: {
        ...messages_fr,
        ...login_fr,
        ...top_bar_fr,
        ...card_error_boundary_fr,
        ...filter_fr,
        ...filter_expert_fr,
    },
};

const language = navigator.language.split(/[-_]/)[0]; // language without region code

const basename = new URL(document.querySelector('base').href).pathname;

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <IntlProvider locale={language} messages={messages[language]}>
        <Provider store={store}>
            <BrowserRouter basename={basename}>
                <CardErrorBoundary>
                    <App />
                </CardErrorBoundary>
            </BrowserRouter>
        </Provider>
    </IntlProvider>
);
