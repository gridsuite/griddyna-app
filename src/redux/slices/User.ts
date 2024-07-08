/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice } from '@reduxjs/toolkit';
import {
    USER,
    SIGNIN_CALLBACK_ERROR,
    UNAUTHORIZED_USER_INFO,
    LOGOUT_ERROR,
    USER_VALIDATION_ERROR,
    RESET_AUTHENTICATION_ROUTER_ERROR,
    SHOW_AUTH_INFO_LOGIN,
} from '@gridsuite/commons-ui';
import { User } from 'oidc-client';
import { SliceCaseReducers } from '@reduxjs/toolkit';

export type UserState = {
    user: User | null;
    signInCallbackError: string | null;
    authenticationRouterError: any;
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
    [USER]: (state, action) => {
        // TODO: GridSuite: Should be payload
        state.user = action.payload.user;
    },

    [SIGNIN_CALLBACK_ERROR]: (state, action) => {
        // TODO: GridSuite: Should be payload
        state.signInCallbackError = action.payload.signInCallbackError;
    },

    [UNAUTHORIZED_USER_INFO]: (state, action) => {
        state.authenticationRouterError =
            action.payload.authenticationRouterError;
    },

    [LOGOUT_ERROR]: (state, action) => {
        state.authenticationRouterError =
            action.payload.authenticationRouterError;
    },

    [USER_VALIDATION_ERROR]: (state, action) => {
        state.authenticationRouterError =
            action.payload.authenticationRouterError;
    },

    [RESET_AUTHENTICATION_ROUTER_ERROR]: (state, action) => {
        state.authenticationRouterError = null;
    },

    [SHOW_AUTH_INFO_LOGIN]: (state, action) => {
        state.showAuthenticationRouterLogin =
            action.payload.showAuthenticationRouterLogin;
    },
};

export const UserSlice = createSlice({
    name: 'User',
    initialState,
    reducers,
});

export const UserReducer = UserSlice.reducer;
