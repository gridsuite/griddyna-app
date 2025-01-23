/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice } from '@reduxjs/toolkit';
import { getLocalStorageTheme, saveLocalStorageTheme } from '../local-storage';

export const SELECT_THEME = 'SELECT_THEME';

export function selectTheme(theme) {
    return { type: SELECT_THEME, theme: theme };
}

const initialState = getLocalStorageTheme();

// Selectors

// Reducers

const reducers = {
    selectTheme: (state, action) => {
        state = action.payload;
        saveLocalStorageTheme(state.theme);
    },
};

export const ThemeSlice = createSlice({
    name: 'Theme',
    initialState,
    reducers,
});

export const ThemeReducer = ThemeSlice.reducer;
