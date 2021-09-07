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
import { SetType } from '../../constants/models';
import * as _ from 'lodash';

const DEFAULT_GROUP = {
    name: '',
    modelName: '',
    type: SetType.FIXED,
    sets: [],
};

const initialState = {
    models: [],
    currentGroup: DEFAULT_GROUP,
    parameterDefinitions: [],
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

export const makeGetModel = () =>
    createSelector(
        (state) => state.models.models,
        (_, modelName) => modelName,
        (models, modelName) => models.find((model) => model.name === modelName)
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
    async ({ modelName, groupName }, { getState }) => {
        if (groupName) {
            const token = getState()?.user.user?.id_token;
            const response = await modelsAPI.getModelSets(
                modelName,
                groupName,
                token
            );
            return response.json();
        } else {
            return [];
        }
    }
);

export const postModelSetsGroup = createAsyncThunk(
    'models/post',
    async (strict, { getState }) => {
        const token = getState()?.user.user?.id_token;
        const setGroup = getState()?.models.currentGroup;
        const response = await modelsAPI.postModelSetsGroup(
            setGroup,
            strict,
            token
        );
        return response.json();
    }
);

const reducers = {
    changeGroupName: (state, action) => {
        const newName = action.payload;
        state.currentGroup.name = newName;
    },
    changeGroupType: (state, action) => {
        const newType = action.payload;
        state.currentGroup.type = newType;
    },
    changeGroup: (state, action) => {
        const { group, modelName } = action.payload;
        state.currentGroup = _.cloneDeep(DEFAULT_GROUP);
        state.currentGroup.modelName = modelName;
        if (group) {
            state.currentGroup.name = group.name;
            state.currentGroup.type = group.type;
        }
    },
    addOrModifySet: (state, action) => {
        const newSet = action.payload;
        const setIndex = state.currentGroup.sets.findIndex(
            (setToTest) => setToTest.name === newSet.name
        );
        if (setIndex === -1) {
            state.currentGroup.sets.push(newSet);
        } else {
            state.currentGroup.sets[setIndex] = newSet;
        }
    },
};

const extraReducers = {
    [getModels.fulfilled]: (state, action) => {
        state.models = action.payload;
        state.status = RequestStatus.SUCCESS;
    },
    [getModelDefinitions.fulfilled]: (state, action) => {
        state.parameterDefinitions = action.payload;
        state.status = RequestStatus.SUCCESS;
    },
    [getModelSets.fulfilled]: (state, action) => {
        state.currentGroup.sets = action.payload;
        state.status = RequestStatus.SUCCESS;
    },
    [postModelSetsGroup.fulfilled]: (state, action) => {
        const updatedGroup = action.payload;
        state.currentGroup = DEFAULT_GROUP;
        const updatedModel = state.models.find(
            (model) => model.name === updatedGroup.modelName
        );
        if (updatedModel) {
            const simpleUpdatedGroup = {
                name: updatedGroup.name,
                type: updatedGroup.type,
                setsNumber: updatedGroup.sets.length,
            };
            const groupIndex = updatedModel.groups.findIndex(
                (group) => group.name === simpleUpdatedGroup.name
            );
            if (groupIndex === -1) {
                updatedModel.groups.push(simpleUpdatedGroup);
            } else {
                updatedModel.groups[groupIndex] = simpleUpdatedGroup;
            }
        }
        state.status = RequestStatus.SUCCESS;
    },
};

export const ModelSlice = createSlice({
    name: 'InstanceModel',
    initialState,
    reducers,
    extraReducers,
});

export const ModelReducer = ModelSlice.reducer;
