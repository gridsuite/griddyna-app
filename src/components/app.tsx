/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useMatch, useNavigate } from 'react-router';
import { Box, CssBaseline } from '@mui/material';
import {
    AnnouncementNotification,
    AuthenticationRouter,
    CardErrorBoundary,
    fetchConfigParameter,
    getPreLoginPath,
    type GsLang,
    GsTheme,
    initializeAuthenticationDev,
    initializeAuthenticationProd,
    logout,
    NotificationsUrlKeys,
    PARAM_DEVELOPER_MODE,
    PARAM_LANGUAGE,
    PARAM_THEME,
    snackWithFallback,
    TopBar,
    updateConfigParameter,
    useNotificationsListener,
    type UserManagerState,
    useSnackMessage,
} from '@gridsuite/commons-ui';
import { FormattedMessage } from 'react-intl';
import PowsyblLogo from '../images/powsybl_logo.svg?react';
import AppPackage from '../../package.json';
import { fetchAppsAndUrls, fetchIdpSettings, fetchVersion } from '../utils/rest-api';
import { getServersInfos } from '../rest/studyAPI';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { UserSlice } from '../redux/slices/User';
import RootContainer from '../containers/RootContainer';
import { APP_NAME } from '../utils/config-params';
import { ConfigSlice, getDeveloperMode, getLang, getTheme, loadConfig } from '../redux/slices/Config';
import { ConfigParameter } from '../redux/types/config.type';
import { useSelector } from 'react-redux';

const noUserManager = { instance: null, error: null } satisfies UserManagerState;

const App = () => {
    const { snackError } = useSnackMessage();

    const userProfile = useAppSelector(
        (state) => state.user.user?.profile ?? null,
        (a, b) =>
            a === b || (a?.sub === b?.sub && a?.name === b?.name && a?.email === b?.email && a?.profile === b?.profile)
    );

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

    const lang = useSelector(getLang);
    const handleLangClick = useCallback(
        (newLangValue: GsLang) => {
            updateConfigParameter(APP_NAME, PARAM_LANGUAGE, newLangValue).catch((error) => {
                snackWithFallback(snackError, error, { headerId: 'paramsChangingError' });
            });
        },
        [snackError]
    );

    const isDeveloperMode = useSelector(getDeveloperMode);
    const handleDeveloperModeClick = useCallback(
        (newDeveloperModeValue: boolean) => {
            updateConfigParameter(APP_NAME, PARAM_DEVELOPER_MODE, newDeveloperModeValue.toString()).catch((error) => {
                snackWithFallback(snackError, error, { headerId: 'paramsChangingError' });
            });
        },
        [snackError]
    );

    const theme = useSelector(getTheme);
    const handleThemeClick = useCallback(
        (newThemeValue: GsTheme) => {
            updateConfigParameter(APP_NAME, PARAM_THEME, newThemeValue).catch((error) => {
                snackWithFallback(snackError, error, { headerId: 'paramsChangingError' });
            });
        },
        [snackError]
    );

    const location = useLocation();

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
        if (userProfile !== null) {
            fetchAppsAndUrls().then((res) => {
                setAppsAndUrls(res);
            });
            // load config
            dispatch(loadConfig());
        }
    }, [userProfile, dispatch]);

    const onUpdateConfigParameter = useCallback(
        (event: MessageEvent<string>) => {
            const eventData = JSON.parse(event.data);
            if (eventData.headers?.parameterName) {
                fetchConfigParameter(APP_NAME, eventData.headers.parameterName)
                    .then((param: ConfigParameter) => dispatch(ConfigSlice.actions.updateConfigParameter(param)))
                    .catch((error) => snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' }));
            }
        },
        [snackError, dispatch]
    );

    useNotificationsListener(NotificationsUrlKeys.CONFIG, {
        listenerCallbackMessage: onUpdateConfigParameter,
    });

    return (
        <>
            <CssBaseline />
            <TopBar
                appName={APP_NAME}
                appColor="grey"
                appLogo={<PowsyblLogo />}
                appVersion={AppPackage.version}
                appLicense={AppPackage.license}
                onLogoClick={() => navigate('/', { replace: true })}
                onLogoutClick={() => logout(authenticationDispatch, userManager.instance)}
                userProfile={userProfile ?? undefined}
                appsAndUrls={appsAndUrls}
                globalVersionPromise={() => fetchVersion().then((res) => res?.deployVersion)}
                additionalModulesPromise={getServersInfos}
                onDeveloperModeClick={handleDeveloperModeClick}
                developerMode={isDeveloperMode ?? false}
                onLanguageClick={handleLangClick}
                language={lang as GsLang}
                onThemeClick={handleThemeClick}
                theme={theme as GsTheme}
            />
            <AnnouncementNotification userProfile={userProfile} />
            <CardErrorBoundary>
                {userProfile !== null ? (
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Box mt={1}>
                                    <RootContainer />
                                </Box>
                            }
                        />
                        <Route path="/sign-in-callback" element={<Navigate replace to={getPreLoginPath() || '/'} />} />
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
        </>
    );
};

export default App;
