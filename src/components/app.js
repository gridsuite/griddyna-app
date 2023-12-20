/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useMatch,
    useNavigate,
} from 'react-router-dom';

import { Box, CssBaseline } from '@mui/material';
import {
    createTheme,
    StyledEngineProvider,
    ThemeProvider,
} from '@mui/material/styles';
import { LIGHT_THEME } from '../redux/slices/Theme';

import {
    AuthenticationRouter,
    CardErrorBoundary,
    getPreLoginPath,
    initializeAuthenticationDev,
    initializeAuthenticationProd,
    logout,
    TopBar,
} from '@gridsuite/commons-ui';

import { FormattedMessage } from 'react-intl';

import { ReactComponent as PowsyblLogo } from '../images/powsybl_logo.svg';
import AppPackage from '../../package.json';

import {
    fetchAppsAndUrls,
    fetchAuthorizationCodeFlowFeatureFlag,
    fetchValidateUser,
    fetchVersion,
} from '../utils/rest-api';
import { getServersInfos } from '../rest/studyAPI';

import { UserSlice } from '../redux/slices/User';
import RootContainer from '../containers/RootContainer';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
    mapboxStyle: 'mapbox://styles/mapbox/light-v9',
});
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    mapboxStyle: 'mapbox://styles/mapbox/dark-v9',
});
const getMuiTheme = (theme) => {
    if (theme === LIGHT_THEME) {
        return lightTheme;
    } else {
        return darkTheme;
    }
};

const noUserManager = { instance: null, error: null };

const App = () => {
    const theme = useSelector((state) => state.theme);

    const user = useSelector((state) => state.user.user);

    const signInCallbackError = useSelector(
        (state) => state.user.signInCallbackError
    );
    const authenticationRouterError = useSelector(
        (state) => state.user.authenticationRouterError
    );
    const showAuthenticationRouterLogin = useSelector(
        (state) => state.user.showAuthenticationRouterLogin
    );

    const [userManager, setUserManager] = useState(noUserManager);

    const [appsAndUrls, setAppsAndUrls] = useState([]);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const authenticationDispatch = useCallback(
        (action) => dispatch(UserSlice.actions[action.type](action)),
        [dispatch]
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

    const initialize = useCallback(() => {
        if (process.env.REACT_APP_USE_AUTHENTICATION === 'true') {
            return fetchAuthorizationCodeFlowFeatureFlag().then(
                (authorizationCodeFlowEnabled) => {
                    return initializeAuthenticationProd(
                        authenticationDispatch,
                        initialMatchSilentRenewCallbackUrl != null,
                        fetch('idpSettings.json'),
                        fetchValidateUser,
                        authorizationCodeFlowEnabled,
                        initialMatchSigninCallbackUrl != null
                    );
                }
            );
        } else {
            console.log('devauth');
            return initializeAuthenticationDev(
                authenticationDispatch,
                initialMatchSilentRenewCallbackUrl != null,
                () =>
                    new Promise((resolve) =>
                        window.setTimeout(() => resolve(true), 500)
                    ),
                initialMatchSigninCallbackUrl != null
            );
        }
        // Note: initialMatchSilentRenewCallbackUrl and dispatch don't change
    }, [
        initialMatchSilentRenewCallbackUrl,
        authenticationDispatch,
        initialMatchSigninCallbackUrl,
    ]);

    useEffect(() => {
        initialize()
            .then((userManager) => {
                setUserManager({ instance: userManager, error: null });
            })
            .catch(function (error) {
                setUserManager({ instance: null, error: error.message });
            });
        // Note: initialize and initialMatchSilentRenewCallbackUrl won't change
    }, [
        initialize,
        initialMatchSilentRenewCallbackUrl,
        authenticationDispatch,
    ]);

    useEffect(() => {
        if (user !== null) {
            fetchAppsAndUrls().then((res) => {
                setAppsAndUrls(res);
            });
        }
    }, [user]);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={getMuiTheme(theme)}>
                <React.Fragment>
                    <CssBaseline />
                    <TopBar
                        appName="Dyna"
                        appColor="grey"
                        appLogo={<PowsyblLogo />}
                        appVersion={AppPackage.version}
                        appLicense={AppPackage.license}
                        onLogoClick={() => navigate('/', { replace: true })}
                        onLogoutClick={() =>
                            logout(authenticationDispatch, userManager.instance)
                        }
                        user={user}
                        appsAndUrls={appsAndUrls}
                        getGlobalVersion={(setGlobalVersion) =>
                            fetchVersion()
                                .then((res) =>
                                    setGlobalVersion(res.deployVersion)
                                )
                                .catch((reason) => {
                                    console.error(
                                        'Error while fetching the version : ' +
                                            reason
                                    );
                                    setGlobalVersion(null);
                                })
                        }
                        getAdditionalModules={(setServers) =>
                            getServersInfos(user?.id_token)
                                .then((res) =>
                                    setServers(
                                        Object.entries(res).map(
                                            ([name, infos]) => ({
                                                name:
                                                    infos?.build?.name ||
                                                    infos?.build?.artifact ||
                                                    name,
                                                type: 'server',
                                                version: infos?.build?.version,
                                                gitTag:
                                                    infos?.git?.tags ||
                                                    infos?.git?.commit?.id[
                                                        'describe-short'
                                                    ],
                                            })
                                        )
                                    )
                                )
                                .catch((reason) => {
                                    console.error(
                                        'Error while fetching the servers infos : ' +
                                            reason
                                    );
                                    setServers(null);
                                })
                        }
                    />
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
                                    element={
                                        <Navigate
                                            replace
                                            to={getPreLoginPath() || '/'}
                                        />
                                    }
                                />
                                <Route
                                    path="/logout-callback"
                                    element={
                                        <h1>
                                            Error: logout failed; you are still
                                            logged in.
                                        </h1>
                                    }
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
                                authenticationRouterError={
                                    authenticationRouterError
                                }
                                showAuthenticationRouterLogin={
                                    showAuthenticationRouterLogin
                                }
                                dispatch={authenticationDispatch}
                                navigate={navigate}
                                location={location}
                            />
                        )}
                    </CardErrorBoundary>
                </React.Fragment>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
