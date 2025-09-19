/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useMatch, useNavigate } from 'react-router';
import { Box, createTheme, CssBaseline, responsiveFontSizes, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { enUS as MuiCoreEnUS, frFR as MuiCoreFrFR } from '@mui/material/locale';
import {
    AnnouncementNotification,
    AuthenticationRouter,
    CardErrorBoundary,
    getPreLoginPath,
    type GsLang,
    type GsTheme,
    initializeAuthenticationDev,
    initializeAuthenticationProd,
    LANG_FRENCH,
    LIGHT_THEME,
    logout,
    NotificationsProvider,
    TopBar,
    type UserManagerState,
} from '@gridsuite/commons-ui';
import { FormattedMessage, useIntl } from 'react-intl';
import PowsyblLogo from '../images/powsybl_logo.svg?react';
import AppPackage from '../../package.json';
import { fetchAppsAndUrls, fetchIdpSettings, fetchVersion } from '../utils/rest-api';
import { getServersInfos } from '../rest/studyAPI';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { UserSlice } from '../redux/slices/User';
import RootContainer from '../containers/RootContainer';
import useNotificationsUrlGenerator from '../hooks/use-notification-url-generator';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function getMuiTheme(theme: GsTheme, locale: string /*TODO GsLangUser*/) {
    return responsiveFontSizes(
        createTheme(
            theme === LIGHT_THEME ? lightTheme : darkTheme,
            locale === LANG_FRENCH ? MuiCoreFrFR : MuiCoreEnUS // MUI core translations
        )
    );
}

const noUserManager = { instance: null, error: null } satisfies UserManagerState;

const App = () => {
    const computedLanguage = useIntl().locale;
    const theme = useAppSelector((state) => state.theme);
    const themeCompiled = useMemo(() => getMuiTheme(theme, computedLanguage), [computedLanguage, theme]);

    const user = useAppSelector((state) => state.user.user);

    const signInCallbackError = useAppSelector((state) => state.user.signInCallbackError);
    const authenticationRouterError = useAppSelector((state) => state.user.authenticationRouterError);
    const showAuthenticationRouterLogin = useAppSelector((state) => state.user.showAuthenticationRouterLogin);

    const [userManager, setUserManager] = useState<UserManagerState>(noUserManager);

    const [appsAndUrls, setAppsAndUrls] = useState([]);

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const authenticationDispatch = useCallback(
        (action: any) => {
            action.user = { ...action.user }; // redux toolkit warn about the User class not being serializable
            dispatch(UserSlice.actions[action.type](action));
        },
        [dispatch]
    );

    const langDispatch = useCallback((lng: GsLang) => {
        /*not implemented yet*/
    }, []);

    const location = useLocation();

    const urlMapper = useNotificationsUrlGenerator();

    // Can't use lazy initializer because useMatch is a hook
    const [initialMatchSilentRenewCallbackUrl] = useState(
        useMatch({
            path: '/silent-renew-callback',
        })
    );

    const [initialMatchSigninCallbackUrl] = useState(
        useMatch({
            path: '/sign-in-callback',
        })
    );

    useEffect(() => {
        // need subfunction when async as suggested by rule react-hooks/exhaustive-deps
        (async function initializeAuthentication() {
            try {
                console.debug(`dev auth: ${import.meta.env.VITE_USE_AUTHENTICATION}`);
                const initAuth =
                    import.meta.env.VITE_USE_AUTHENTICATION === 'true'
                        ? initializeAuthenticationProd(
                              authenticationDispatch,
                              initialMatchSilentRenewCallbackUrl != null,
                              fetchIdpSettings,
                              initialMatchSigninCallbackUrl != null
                          )
                        : initializeAuthenticationDev(
                              authenticationDispatch,
                              initialMatchSilentRenewCallbackUrl != null,
                              initialMatchSigninCallbackUrl != null
                          );
                setUserManager({
                    instance: await initAuth,
                    error: null,
                });
            } catch (error: any) {
                setUserManager({ instance: null, error: error.message });
            }
        })();
        // Note: dispatch and initialMatchSilentRenewCallbackUrl won't change
    }, [authenticationDispatch, initialMatchSilentRenewCallbackUrl, initialMatchSigninCallbackUrl]);

    useEffect(() => {
        if (user !== null) {
            fetchAppsAndUrls().then((res) => {
                setAppsAndUrls(res);
            });
        }
    }, [user]);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themeCompiled}>
                <NotificationsProvider urls={urlMapper}>
                    <CssBaseline />
                    <TopBar
                        appName="Dyna"
                        appColor="grey"
                        appLogo={<PowsyblLogo />}
                        appVersion={AppPackage.version}
                        appLicense={AppPackage.license}
                        onLogoClick={() => navigate('/', { replace: true })}
                        onLogoutClick={() => logout(authenticationDispatch, userManager.instance)}
                        user={user ?? undefined}
                        appsAndUrls={appsAndUrls}
                        globalVersionPromise={() => fetchVersion().then((res) => res?.deployVersion)}
                        additionalModulesPromise={getServersInfos}
                        developerMode={false}
                        onLanguageClick={langDispatch}
                        language={computedLanguage as any} //TODO fix type
                    />
                    <AnnouncementNotification user={user} />
                    <CardErrorBoundary>
                        {user !== null ? (
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <Box mt={1}>
                                            <RootContainer />
                                        </Box>
                                    }
                                />
                                <Route
                                    path="/sign-in-callback"
                                    element={<Navigate replace to={getPreLoginPath() || '/'} />}
                                />
                                <Route
                                    path="/logout-callback"
                                    element={<h1>Error: logout failed; you are still logged in.</h1>}
                                />
                                <Route
                                    path="*"
                                    element={
                                        <h1>
                                            <FormattedMessage id="PageNotFound" />
                                        </h1>
                                    }
                                />
                            </Routes>
                        ) : (
                            <AuthenticationRouter
                                userManager={userManager}
                                signInCallbackError={signInCallbackError}
                                authenticationRouterError={authenticationRouterError}
                                showAuthenticationRouterLogin={showAuthenticationRouterLogin}
                                dispatch={authenticationDispatch}
                                navigate={navigate}
                                location={location}
                            />
                        )}
                    </CardErrorBoundary>
                </NotificationsProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
