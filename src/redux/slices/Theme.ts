/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    Action,
    createSlice,
    PayloadAction,
    SliceCaseReducers,
} from '@reduxjs/toolkit';
import {
    getLocalStorageTheme,
    GsTheme,
    saveLocalStorageTheme,
} from '@gridsuite/commons-ui';

export const SELECT_THEME = 'SELECT_THEME';
type SelectThemeAction = Action<typeof SELECT_THEME> & {
    theme: GsTheme;
};
export function selectTheme(theme: GsTheme) {
    return { type: SELECT_THEME, theme: theme };
}

export type ThemeState = {
    theme: GsTheme;
};

const initialState: ThemeState = {
    theme: getLocalStorageTheme(process.env.REACT_APP_NAME!),
};

// Selectors

// Reducers

const reducers: SliceCaseReducers<ThemeState> = {
    selectTheme: (state, action: PayloadAction<SelectThemeAction>) => {
        state = action.payload;
        saveLocalStorageTheme(process.env.REACT_APP_NAME!, state.theme);
    },
};

export const ThemeSlice = createSlice({
    name: 'Theme',
    initialState,
    reducers,
});

export const ThemeReducer = ThemeSlice.reducer;
