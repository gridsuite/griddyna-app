/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useMatch, useNavigate } from 'react-router';
import {
    AnnouncementNotification,
    AuthenticationRouter,
    CardErrorBoundary,
    fetchConfigParameter,
    initializeAuthenticationDev,
    initializeAuthenticationProd,
    logout,
    NotificationsUrlKeys,
    snackWithFallback,
    useNotificationsListener,
    type UserManagerState,
    useSnackMessage,
} from '@gridsuite/commons-ui';
import { fetchIdpSettings } from '../utils/rest-api';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { UserSlice } from '../redux/slices/User';
import { APP_NAME } from '../utils/config-params';
import { ConfigSlice, getDeveloperMode, loadConfig } from '../redux/slices/Config';
import { ConfigParameter } from '../redux/types/config.type';
import { AppLayout } from './layout/AppLayout';
import { AppRouter } from './router/AppRouter';

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

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const authenticationDispatch = useCallback(
        (action: any) => {
            action.user = { ...action.user }; // redux toolkit warn about the User class not being serializable
            dispatch(UserSlice.actions[action.type](action));
        },
        [dispatch]
    );

    const isDeveloperMode = useSelector(getDeveloperMode);

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
        <AppLayout
            onLogoutClick={() => logout(authenticationDispatch, userManager.instance)}
            isDeveloperMode={isDeveloperMode ?? false}
            isAuthenticated={userProfile !== null}
        >
            <AnnouncementNotification userProfile={userProfile} />
            <CardErrorBoundary>
                {userProfile !== null ? (
                    <AppRouter />
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
        </AppLayout>
    );
};

export default App;
