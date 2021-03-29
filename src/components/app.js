/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
    Redirect,
    Route,
    Switch,
    useHistory,
    useLocation,
} from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { LIGHT_THEME } from '../redux/actions';

import {
    TopBar,
    AuthenticationRouter,
    logout,
    getPreLoginPath,
    initializeAuthenticationProd,
    initializeAuthenticationDev,
} from '@gridsuite/commons-ui';

import { useRouteMatch } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { ReactComponent as PowsyblLogo } from '../images/powsybl_logo.svg';
import { fetchAppsAndUrls } from '../utils/rest-api';

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
    },
    mapboxStyle: 'mapbox://styles/mapbox/light-v9',
});

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
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

    const user = useSelector((state) => state.user);

    const signInCallbackError = useSelector(
        (state) => state.signInCallbackError
    );

    const [userManager, setUserManager] = useState(noUserManager);

    const [appsAndUrls, setAppsAndUrls] = React.useState([]);

    const history = useHistory();

    const dispatch = useDispatch();

    const location = useLocation();

    // Can't use lazy initializer because useRouteMatch is a hook
    const [initialMatchSilentRenewCallbackUrl] = useState(
        useRouteMatch({
            path: '/silent-renew-callback',
            exact: true,
        })
    );

    const initialize = useCallback(() => {
        if (process.env.REACT_APP_USE_AUTHENTICATION === 'true') {
            return initializeAuthenticationProd(
                dispatch,
                initialMatchSilentRenewCallbackUrl != null,
                fetch('idpSettings.json')
            );
        } else {
            return initializeAuthenticationDev(
                dispatch,
                initialMatchSilentRenewCallbackUrl != null
            );
        }
        // Note: initialMatchSilentRenewCallbackUrl and dispatch don't change
    }, [initialMatchSilentRenewCallbackUrl, dispatch]);

    useEffect(() => {
        initialize()
            .then((userManager) => {
                setUserManager({ instance: userManager, error: null });
                userManager.getUser().then((user) => {
                    if (
                        user == null &&
                        initialMatchSilentRenewCallbackUrl == null
                    ) {
                        userManager.signinSilent().catch((error) => {
                            const oidcHackReloaded =
                                'gridsuite-oidc-hack-reloaded';
                            if (
                                !sessionStorage.getItem(oidcHackReloaded) &&
                                error.message ===
                                    'authority mismatch on settings vs. signin state'
                            ) {
                                sessionStorage.setItem(oidcHackReloaded, true);
                                console.log(
                                    'Hack oidc, reload page to make login work'
                                );
                                window.location.reload();
                            }
                        });
                    }
                });
            })
            .catch(function (error) {
                setUserManager({ instance: null, error: error.message });
                console.debug('error when importing the idp settings');
            });
        // Note: initialize and initialMatchSilentRenewCallbackUrl won't change
    }, [initialize, initialMatchSilentRenewCallbackUrl]);

    function onLogoClicked() {
        history.replace('/');
    }

    useEffect(() => {
        if (user !== null) {
            fetchAppsAndUrls().then((res) => {
                setAppsAndUrls(res);
            });
        }
    }, [user]);

    return (
        <ThemeProvider theme={getMuiTheme(theme)}>
            <React.Fragment>
                <CssBaseline />
                <TopBar
                    appName="XXX"
                    appColor="grey"
                    onParametersClick={() => console.log('onParametersClick')}
                    onLogoutClick={() => logout(dispatch, userManager.instance)}
                    onLogoClick={() => onLogoClicked()}
                    appLogo={<PowsyblLogo />}
                    user={user}
                    appsAndUrls={appsAndUrls}
                />
                {user !== null ? (
                    <Switch>
                        <Route exact path="/">
                            <Box mt={20}>
                                <Typography
                                    variant="h3"
                                    color="textPrimary"
                                    align="center"
                                >
                                    Connected
                                </Typography>
                            </Box>
                        </Route>
                        <Route exact path="/sign-in-callback">
                            <Redirect to={getPreLoginPath() || '/'} />
                        </Route>
                        <Route exact path="/logout-callback">
                            <h1>
                                Error: logout failed; you are still logged in.
                            </h1>
                        </Route>
                        <Route>
                            <h1>
                                <FormattedMessage id="PageNotFound" />
                            </h1>
                        </Route>
                    </Switch>
                ) : (
                    <AuthenticationRouter
                        userManager={userManager}
                        signInCallbackError={signInCallbackError}
                        dispatch={dispatch}
                        history={history}
                        location={location}
                    />
                )}
            </React.Fragment>
        </ThemeProvider>
    );
};

export default App;
