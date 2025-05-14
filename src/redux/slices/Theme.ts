/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLocalStorageTheme, saveLocalStorageTheme } from '../local-storage';

const initialState = getLocalStorageTheme();

export const ThemeSlice = createSlice({
    name: 'Theme',
    initialState,
    reducers: {
        selectTheme: (state, action: PayloadAction<typeof initialState>) => {
            state = action.payload;
            saveLocalStorageTheme(state);
        },
    },
});

export const ThemeReducer = ThemeSlice.reducer;
export const { selectTheme } = ThemeSlice.actions;
