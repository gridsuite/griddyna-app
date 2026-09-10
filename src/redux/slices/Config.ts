/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    COMMON_APP_NAME,
    fetchConfigParameters,
    GsLang,
    GsTheme,
    PARAM_DEVELOPER_MODE,
    PARAM_LANGUAGE,
    PARAM_THEME,
    updateConfigParameter,
} from '@gridsuite/commons-ui';
import { ConfigParameter, FAVORITE_MAPPINGS, FAVORITE_STUDIES } from '../types/config.type';
import type { RootState } from '../reducer';
import { RequestStatus } from '../../utils/types';
import { APP_NAME } from '../../utils/config-params';
import { saveLocalStorageLanguage, saveLocalStorageTheme } from '../local-storage';

// --- State shape --- //

interface ConfigState {
    [PARAM_LANGUAGE]: GsLang | null;
    [PARAM_THEME]: GsTheme | null;
    [PARAM_DEVELOPER_MODE]: boolean | null;
    [FAVORITE_MAPPINGS]: UUID[] | null;
    [FAVORITE_STUDIES]: UUID[] | null;
    status: RequestStatus;
}

const initialState: ConfigState = {
    [PARAM_LANGUAGE]: null,
    [PARAM_THEME]: null,
    [PARAM_DEVELOPER_MODE]: null,
    [FAVORITE_MAPPINGS]: null,
    [FAVORITE_STUDIES]: null,
    status: RequestStatus.IDLE,
};

// --- Utilities --- //

function updateParams(name: string, value: any, state: ConfigState) {
    switch (name) {
        case PARAM_LANGUAGE:
            state[PARAM_LANGUAGE] = value as GsLang;
            saveLocalStorageLanguage(state[PARAM_LANGUAGE] as GsLang);
            break;
        case PARAM_THEME:
            state[PARAM_THEME] = value as GsTheme;
            saveLocalStorageTheme(state[PARAM_THEME] as GsTheme);
            break;
        case PARAM_DEVELOPER_MODE:
            state[PARAM_DEVELOPER_MODE] = String(value) === 'true';
            break;
        case FAVORITE_MAPPINGS:
            state[FAVORITE_MAPPINGS] = value
                ? String(value)
                      .split(',')
                      .map((id) => id.trim() as UUID)
                : [];
            break;
        case FAVORITE_STUDIES:
            state[FAVORITE_STUDIES] = value
                ? String(value)
                      .split(',')
                      .map((id) => id.trim() as UUID)
                : [];
            break;
        default:
            console.warn(`Unknown config parameter: ${name}`);
    }
}

// --- Async thunks --- //

export const loadConfig = createAsyncThunk('configs/loadConfig', async (_arg, _thunkAPI) => {
    const commonsConfigParams: ConfigParameter[] = await fetchConfigParameters(COMMON_APP_NAME);
    const appConfigParams: ConfigParameter[] = await fetchConfigParameters(APP_NAME);
    return [...commonsConfigParams, ...appConfigParams];
});

export const addFavoriteMappings = createAsyncThunk(
    'configs/addFavoriteMappings',
    async ({ mappingId }: { mappingId: UUID }, { getState }) => {
        const state = getState() as { configs: ConfigState };
        const favoriteMappings = state.configs?.[FAVORITE_MAPPINGS];
        const updatedFavoriteMappings = [...(favoriteMappings ?? []), mappingId];
        // using notifier to call the simple action updateConfigParameter later
        await updateConfigParameter(APP_NAME, FAVORITE_MAPPINGS, updatedFavoriteMappings?.join(','));
    }
);

export const removeFavoriteMappings = createAsyncThunk(
    'configs/removeFavoriteMappings',
    async ({ mappingId }: { mappingId: UUID }, { getState }) => {
        const state = getState() as { configs: ConfigState };
        const favoriteMappings = state.configs?.[FAVORITE_MAPPINGS];
        const updatedFavoriteMappings = favoriteMappings?.filter(
            (favoriteMapping: UUID) => favoriteMapping !== mappingId
        );
        // using notifier to call the simple action updateConfigParameter later
        await updateConfigParameter(APP_NAME, FAVORITE_MAPPINGS, updatedFavoriteMappings?.join(',') ?? '');
    }
);

export const addFavoriteStudies = createAsyncThunk(
    'configs/addFavoriteStudies',
    async ({ studyId }: { studyId: UUID }, { getState }) => {
        const state = getState() as { configs: ConfigState };
        const favoriteStudies = state.configs?.[FAVORITE_STUDIES];
        const updatedFavoriteStudies = [...(favoriteStudies ?? []), studyId];
        // using notifier to call the simple action updateConfigParameter later
        await updateConfigParameter(APP_NAME, FAVORITE_STUDIES, updatedFavoriteStudies?.join(','));
    }
);

export const removeFavoriteStudies = createAsyncThunk(
    'configs/removeFavoriteStudies',
    async ({ studyId }: { studyId: UUID }, { getState }) => {
        const state = getState() as { configs: ConfigState };
        const favoriteStudies = state.configs?.[FAVORITE_STUDIES];
        const updatedFavoriteStudies = favoriteStudies?.filter((favoriteStudy: UUID) => favoriteStudy !== studyId);
        // using notifier to call the simple action updateConfigParameter later
        await updateConfigParameter(APP_NAME, FAVORITE_STUDIES, updatedFavoriteStudies?.join(',') ?? '');
    }
);

// --- Slice --- //

export const ConfigSlice = createSlice({
    name: 'configs',
    initialState,
    reducers: {
        updateConfigParameter: (state, action) => {
            const { name, value } = action.payload;
            updateParams(name, value, state);
        },
    },
    extraReducers: (builder) => {
        // --- loadConfig ---
        builder.addCase(loadConfig.pending, (state) => {
            state.status = RequestStatus.PENDING;
        });
        builder.addCase(loadConfig.fulfilled, (state, action) => {
            state.status = RequestStatus.SUCCESS;
            const configParams = action.payload;
            configParams.forEach((param) => {
                updateParams(param.name, param.value, state);
            });
        });
        builder.addCase(loadConfig.rejected, (state) => {
            state.status = RequestStatus.ERROR;
        });
        // --- addFavoriteMappings ---
        builder.addCase(addFavoriteMappings.pending, (state) => {
            state.status = RequestStatus.PENDING;
        });
        builder.addCase(addFavoriteMappings.fulfilled, (state, _action) => {
            state.status = RequestStatus.SUCCESS;
        });
        builder.addCase(addFavoriteMappings.rejected, (state) => {
            state.status = RequestStatus.ERROR;
        });
        // --- removeFavoriteMappings ---
        builder.addCase(removeFavoriteMappings.pending, (state) => {
            state.status = RequestStatus.PENDING;
        });
        builder.addCase(removeFavoriteMappings.fulfilled, (state, _action) => {
            state.status = RequestStatus.SUCCESS;
        });
        builder.addCase(removeFavoriteMappings.rejected, (state) => {
            state.status = RequestStatus.ERROR;
        });
        // --- addFavoriteStudies ---
        builder.addCase(addFavoriteStudies.pending, (state) => {
            state.status = RequestStatus.PENDING;
        });
        builder.addCase(addFavoriteStudies.fulfilled, (state, _action) => {
            state.status = RequestStatus.SUCCESS;
        });
        builder.addCase(addFavoriteStudies.rejected, (state) => {
            state.status = RequestStatus.ERROR;
        });
        // --- removeFavoriteStudies ---
        builder.addCase(removeFavoriteStudies.pending, (state) => {
            state.status = RequestStatus.PENDING;
        });
        builder.addCase(removeFavoriteStudies.fulfilled, (state, _action) => {
            state.status = RequestStatus.SUCCESS;
        });
        builder.addCase(removeFavoriteStudies.rejected, (state) => {
            state.status = RequestStatus.ERROR;
        });
    },
});

// --- Selectors --- //

export const getLang = (state: RootState): GsLang | null => state.configs[PARAM_LANGUAGE];
export const getTheme = (state: RootState): GsTheme | null => state.configs[PARAM_THEME];
export const getDeveloperMode = (state: RootState): boolean | null => state.configs[PARAM_DEVELOPER_MODE];
export const getFavoriteMappings = (state: RootState): UUID[] | null => state.configs[FAVORITE_MAPPINGS];
export const getFavoriteStudies = (state: RootState): UUID[] | null => state.configs[FAVORITE_STUDIES];

// --- Reducer --- //
export const ConfigReducer = ConfigSlice.reducer;
