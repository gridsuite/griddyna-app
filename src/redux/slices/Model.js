/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    createAsyncThunk,
    createSelector,
    createSlice,
} from '@reduxjs/toolkit';
import * as modelsAPI from '../../rest/modelsAPI';
import RequestStatus from '../../constants/RequestStatus';
// Only process instantiated models, models without parameters will be
// put in config files when added to app.

const initialState = {
    models: [],
    parameterDefinitions: [],
    setsToConsider: [],
    status: RequestStatus.IDLE,
};

// Selectors

export const makeGetModels = () =>
    createSelector(
        (state) => state.models.models,
        (_, equipmentType) => equipmentType,
        (models, equipmentType) =>
            models.filter((model) => model.type === equipmentType)
    );

// Reducers

export const getModels = createAsyncThunk(
    'models/get',
    async (_arg, { getState }) => {
        const token = getState()?.user.user?.id_token;
        const response = await modelsAPI.getModels(token);
        return response.json();
    }
);

export const getModelDefinitions = createAsyncThunk(
    'models/definitions',
    async (modelName, { getState }) => {
        const token = getState()?.user.user?.id_token;
        const response = await modelsAPI.getModelDefinitions(modelName, token);
        return response.json();
    }
);

export const getModelSets = createAsyncThunk(
    'models/sets',
    async (modelName, { getState }) => {
        const token = getState()?.user.user?.id_token;
        const response = await modelsAPI.getModelSets(modelName, token);
        return response.json();
    }
);

export const postModelSetWithInstance = createAsyncThunk(
    'models/sets',
    async ({ instanceModel, set }, { getState }) => {
        const token = getState()?.user.user?.id_token;
        const response = await modelsAPI.postModelSetWithInstance(
            instanceModel,
            set,
            token
        );
        return response.json();
    }
);

export const postModelSetWithoutInstance = createAsyncThunk(
    'models/sets',
    async (set, { getState }) => {
        const token = getState()?.user.user?.id_token;
        const response = await modelsAPI.postModelSetWithoutInstance(
            set,
            token
        );
        return response.json();
    }
);

const reducers = {};

const extraReducers = {
    [getModels.fulfilled]: (state, action) => {
        state.models = action.payload;
        state.status = RequestStatus.SUCCESS;
    },
    [getModelDefinitions.fulfilled]: (state, action) => {
        state.definitions = action.payload;
        state.status = RequestStatus.SUCCESS;
    },
    [getModelSets.fulfilled]: (state, action) => {
        state.setsToConsider = action.payload;
        state.status = RequestStatus.SUCCESS;
    },
};

export const Model = createSlice({
    name: 'InstanceModel',
    initialState,
    reducers,
    extraReducers,
});

export const ModelReducer = Model.reducer;
