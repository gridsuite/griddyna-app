/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';
import {
    AuthenticationRouterErrorAction,
    AuthenticationRouterErrorState,
    CommonStoreState,
    LOGOUT_ERROR,
    LogoutErrorAction,
    RESET_AUTHENTICATION_ROUTER_ERROR,
    SHOW_AUTH_INFO_LOGIN,
    ShowAuthenticationRouterLoginAction,
    SIGNIN_CALLBACK_ERROR,
    SignInCallbackErrorAction,
    UNAUTHORIZED_USER_INFO,
    UnauthorizedUserAction,
    USER,
    USER_VALIDATION_ERROR,
    UserAction,
    UserValidationErrorAction,
} from '@gridsuite/commons-ui';

export type UserState = CommonStoreState & {
    signInCallbackError: Error | null;
    authenticationRouterError: AuthenticationRouterErrorState | null;
    showAuthenticationRouterLogin: boolean;
};

const initialState: UserState = {
    user: null,
    signInCallbackError: null,
    authenticationRouterError: null,
    showAuthenticationRouterLogin: false,
};

// Selectors

// Reducers

const reducers: SliceCaseReducers<UserState> = {
    [USER]: (state, action: PayloadAction<UserAction>) => {
        state.user = action.payload.user;
    },

    [SIGNIN_CALLBACK_ERROR]: (state, action: PayloadAction<SignInCallbackErrorAction>) => {
        state.signInCallbackError = action.payload.signInCallbackError;
    },

    [UNAUTHORIZED_USER_INFO]: (state, action: PayloadAction<UnauthorizedUserAction>) => {
        state.authenticationRouterError = action.payload.authenticationRouterError;
    },

    [LOGOUT_ERROR]: (state, action: PayloadAction<LogoutErrorAction>) => {
        state.authenticationRouterError = action.payload.authenticationRouterError;
    },

    [USER_VALIDATION_ERROR]: (state, action: PayloadAction<UserValidationErrorAction>) => {
        state.authenticationRouterError = action.payload.authenticationRouterError;
    },

    [RESET_AUTHENTICATION_ROUTER_ERROR]: (state, action: PayloadAction<AuthenticationRouterErrorAction>) => {
        state.authenticationRouterError = action.payload.authenticationRouterError;
    },

    [SHOW_AUTH_INFO_LOGIN]: (state, action: PayloadAction<ShowAuthenticationRouterLoginAction>) => {
        state.showAuthenticationRouterLogin = action.payload.showAuthenticationRouterLogin;
    },
};

export const UserSlice = createSlice({
    name: 'User',
    initialState,
    reducers,
});

export const UserReducer = UserSlice.reducer;
