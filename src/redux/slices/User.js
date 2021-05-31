/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice } from '@reduxjs/toolkit';
import { SIGNIN_CALLBACK_ERROR, USER } from '@gridsuite/commons-ui';

const initialState = {
    user: null,
    signInCallbackError: null,
};

// Selectors

// Reducers

const reducers = {
    [USER]: (state, action) => {
        // TODO: GridSuite: Should be payload
        state.user = action.payload.user;
    },
    [SIGNIN_CALLBACK_ERROR]: (state, action) => {
        // TODO: GridSuite: Should be payload
        state.signInCallbackError = action.payload.signInCallbackError;
    },
};

export const UserSlice = createSlice({
    name: 'User',
    initialState,
    reducers,
});

export const UserReducer = UserSlice.reducer;
