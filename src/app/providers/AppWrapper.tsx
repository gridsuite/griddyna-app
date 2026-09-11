/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useMemo } from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { IntlProvider } from 'react-intl';
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { CardErrorBoundary, getComputedLanguage, NotificationsProvider, SnackbarProvider } from '@gridsuite/commons-ui';
import { getMuiTheme } from 'utils/config-theme';
import { store } from 'redux/store';

import useNotificationsUrlGenerator from 'hooks/use-notification-url-generator';
import { getLang, getTheme } from 'redux/slices/Config';
import { getLocalStorageLanguage, getLocalStorageTheme } from 'redux/local-storage';
import App from '../App';
import { appMessages } from '../config/app-messages';

const basename = new URL(document.querySelector('base')!.href).pathname;

function AppProvidersWithStore() {
    const language = useSelector(getLang) ?? getLocalStorageLanguage();
    const computedLanguage = getComputedLanguage(language);
    const theme = useSelector(getTheme) ?? getLocalStorageTheme();
    const themeCompiled = useMemo(() => getMuiTheme(theme, computedLanguage), [computedLanguage, theme]);

    const urlMapper = useNotificationsUrlGenerator();

    return (
        <IntlProvider locale={computedLanguage} messages={appMessages[computedLanguage]}>
            <BrowserRouter basename={basename}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={themeCompiled}>
                        <CssBaseline />
                        <SnackbarProvider hideIconVariant={false}>
                            <NotificationsProvider urls={urlMapper}>
                                <CardErrorBoundary>
                                    <App />
                                </CardErrorBoundary>
                            </NotificationsProvider>
                        </SnackbarProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </BrowserRouter>
        </IntlProvider>
    );
}

export default function AppWrapper() {
    return (
        <Provider store={store}>
            <AppProvidersWithStore />
        </Provider>
    );
}
