/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { IntlProvider } from 'react-intl';
import App from '../components/app';
import { store } from '../redux/store';
import messages_en from '../translations/en.json';
import messages_fr from '../translations/fr.json';
import { businessErrorsEn } from '../translations/businessErrorsEn';
import { businessErrorsFr } from '../translations/businessErrorsFr';
import { yupEn } from '../translations/yupEn';
import { yupFr } from '../translations/yupFr';
import {
    CardErrorBoundary,
    cardErrorBoundaryEn,
    cardErrorBoundaryFr,
    commonButtonEn,
    commonButtonFr,
    descriptionEn,
    descriptionFr,
    equipmentShortEn,
    equipmentShortFr,
    errorsEn,
    errorsFr,
    filterEn,
    filterExpertEn,
    filterExpertFr,
    filterFr,
    GsLangUser,
    type GsTheme,
    LANG_ENGLISH,
    LANG_FRENCH,
    LIGHT_THEME,
    loginEn,
    loginFr,
    NotificationsProvider,
    SnackbarProvider,
    topBarEn,
    topBarFr,
    treeviewFinderEn,
    treeviewFinderFr,
    useUniqueNameValidationEn,
    useUniqueNameValidationFr,
} from '@gridsuite/commons-ui';
import { createTheme, responsiveFontSizes, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { useMemo } from 'react';
import { enUS as MuiCoreEnUS, frFR as MuiCoreFrFR } from '@mui/material/locale';
import useNotificationsUrlGenerator from '../hooks/use-notification-url-generator';
import { getLang, getTheme } from '../redux/slices/Config';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
    mapboxStyle: 'mapbox://styles/mapbox/light-v9',
    typography: {
        button: {
            textTransform: 'none',
        },
    },
});
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    mapboxStyle: 'mapbox://styles/mapbox/dark-v9',
    typography: {
        button: {
            textTransform: 'none',
        },
    },
});

function getMuiTheme(theme: GsTheme, locale: GsLangUser) {
    return responsiveFontSizes(
        createTheme(
            theme === LIGHT_THEME ? lightTheme : darkTheme,
            locale === LANG_FRENCH ? MuiCoreFrFR : MuiCoreEnUS // MUI core translations
        )
    );
}

const messages = {
    en: {
        ...messages_en,
        ...loginEn,
        ...topBarEn,
        ...cardErrorBoundaryEn,
        ...commonButtonEn,
        ...descriptionEn,
        ...equipmentShortEn,
        ...errorsEn,
        ...filterEn,
        ...filterExpertEn,
        ...treeviewFinderEn,
        ...useUniqueNameValidationEn,
        ...businessErrorsEn,
        ...yupEn,
    },
    fr: {
        ...messages_fr,
        ...loginFr,
        ...topBarFr,
        ...cardErrorBoundaryFr,
        ...commonButtonFr,
        ...descriptionFr,
        ...equipmentShortFr,
        ...errorsFr,
        ...filterFr,
        ...filterExpertFr,
        ...treeviewFinderFr,
        ...useUniqueNameValidationFr,
        ...businessErrorsFr,
        ...yupFr,
    },
} as const;

const basename = new URL(document.querySelector('base')!.href).pathname;

function AppProvidersWithStore() {
    const computedLanguage = useSelector(getLang) as GsLangUser;
    const theme = useSelector(getTheme) as GsTheme;
    const themeCompiled = useMemo(() => getMuiTheme(theme, computedLanguage), [computedLanguage, theme]);

    const urlMapper = useNotificationsUrlGenerator();

    return (
        <IntlProvider locale={computedLanguage} messages={messages[computedLanguage] || messages[LANG_ENGLISH]}>
            <BrowserRouter basename={basename}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={themeCompiled}>
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
