/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'typeface-roboto';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { IntlProvider } from 'react-intl';
import './index.css';
import App from './components/app';
import { store } from './redux/store';
import messages_en from './translations/en.json';
import messages_fr from './translations/fr.json';
import {
    CardErrorBoundary,
    cardErrorBoundaryEn,
    cardErrorBoundaryFr,
    errorsEn,
    errorsFr,
    filterEn,
    filterExpertEn,
    filterExpertFr,
    filterFr,
    GsLangUser,
    LANG_ENGLISH,
    loginEn,
    loginFr,
    topBarEn,
    topBarFr,
} from '@gridsuite/commons-ui';

const messages = {
    en: {
        ...messages_en,
        ...loginEn,
        ...topBarEn,
        ...cardErrorBoundaryEn,
        ...errorsEn,
        ...filterEn,
        ...filterExpertEn,
    },
    fr: {
        ...messages_fr,
        ...loginFr,
        ...topBarFr,
        ...cardErrorBoundaryFr,
        ...errorsFr,
        ...filterFr,
        ...filterExpertFr,
    },
} as const;

const language = navigator.language.split(/[-_]/)[0]; // language without region code

const basename = new URL(document.querySelector('base')!.href).pathname;

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <IntlProvider locale={language} messages={messages[language as GsLangUser /*TODO fix*/] || messages[LANG_ENGLISH]}>
        <Provider store={store}>
            <BrowserRouter basename={basename}>
                <CardErrorBoundary>
                    <App />
                </CardErrorBoundary>
            </BrowserRouter>
        </Provider>
    </IntlProvider>
);
