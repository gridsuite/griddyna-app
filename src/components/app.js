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
    Routes,
    Route,
    useNavigate,
    useLocation,
} from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import {
    createTheme,
    ThemeProvider,
    StyledEngineProvider,
} from '@mui/material/styles';
import { LIGHT_THEME } from '../redux/slices/Theme';

import {
    TopBar,
    AuthenticationRouter,
    CardErrorBoundary,
    logout,
    getPreLoginPath,
    initializeAuthenticationProd,
    initializeAuthenticationDev,
} from '@gridsuite/commons-ui';

import { useMatch } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Box from '@mui/material/Box';

import { ReactComponent as PowsyblLogo } from '../images/powsybl_logo.svg';
import {
    fetchAppsAndUrls,
    fetchAuthorizationCodeFlowFeatureFlag,
    fetchValidateUser,
} from '../utils/rest-api';
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

    const [appsAndUrls, setAppsAndUrls] = React.useState([]);

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

    const initialize = useCallback(() => {
        if (process.env.REACT_APP_USE_AUTHENTICATION === 'true') {
            return fetchAuthorizationCodeFlowFeatureFlag().then(
                (authorizationCodeFlowEnabled) => {
                    return initializeAuthenticationProd(
                        dispatch,
                        initialMatchSilentRenewCallbackUrl != null,
                        fetch('idpSettings.json'),
                        fetchValidateUser,
                        authorizationCodeFlowEnabled
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
                    )
            );
        }
        // Note: initialMatchSilentRenewCallbackUrl and dispatch don't change
    }, [initialMatchSilentRenewCallbackUrl, authenticationDispatch]);

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

    function onLogoClicked() {
        navigate('/', { replace: true });
    }

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
                        onParametersClick={() =>
                            console.log('onParametersClick')
                        }
                        onLogoutClick={() =>
                            logout(authenticationDispatch, userManager.instance)
                        }
                        onLogoClick={() => onLogoClicked()}
                        appLogo={<PowsyblLogo />}
                        user={user}
                        appsAndUrls={appsAndUrls}
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
