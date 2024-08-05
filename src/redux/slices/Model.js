/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import * as modelsAPI from '../../rest/modelsAPI';
import RequestStatus from '../../constants/RequestStatus';
import * as _ from 'lodash';
import { SetType } from '../../constants/models';

const DEFAULT_GROUP = {
    name: '',
    modelName: '',
    type: '',
    sets: [],
};

const initialState = {
    models: [],
    currentGroup: DEFAULT_GROUP,
    parameterDefinitions: [],
    automatonDefinitions: [],
    status: RequestStatus.IDLE,
};

// Selectors
export const makeGetAutomatonDefinition = () =>
    createSelector(
        (state) => state.models.automatonDefinitions,
        (_, model) => model,
        (automatonDefinitions, model) => automatonDefinitions[model] ?? {}
    );

export const makeGetModels = () =>
    createSelector(
        (state) => state.models.models,
        (_, equipmentType) => equipmentType,
        (models, equipmentType) => (equipmentType ? models.filter((model) => model.type === equipmentType) : [])
    );

export const makeGetModel = () =>
    createSelector(
        (state) => state.models.models,
        (_, modelName) => modelName,
        (models, modelName) => models.find((model) => model.name === modelName)
    );

export const makeGetGroupByModel = () =>
    createSelector(
        (state) => state,
        (_, model) => model,
        (state, model) => model?.groups
    );

export const makeGetSearchSets = () =>
    createSelector(
        (state) => state.models,
        (_) => _,
        (models, _) => models.currentGroup.searchSets
    );
// Reducers

export const getModels = createAsyncThunk('models/get', async (_arg, { getState }) => {
    const token = getState()?.user.user?.id_token;
    return await modelsAPI.getModels(token);
});

export const getModelDefinitions = createAsyncThunk('models/definitions', async (modelName, { getState }) => {
    const token = getState()?.user.user?.id_token;
    return await modelsAPI.getModelDefinitions(modelName, token);
});

export const getModelSets = createAsyncThunk(
    'models/sets',
    async ({ modelName, groupName, groupType }, { getState }) => {
        if (groupName) {
            const token = getState()?.user.user?.id_token;
            return await modelsAPI.getModelSets(
                modelName,
                groupName,
                groupType !== '' ? groupType : SetType.FIXED,
                token
            );
        } else {
            return [];
        }
    }
);

export const getSearchedModelSets = createAsyncThunk(
    'models/sets/candidate',
    async ({ modelName, groupName, groupType }, { getState }) => {
        if (groupName) {
            const token = getState()?.user.user?.id_token;
            return await modelsAPI.getModelSets(modelName, groupName, groupType ?? '', token);
        } else {
            return [];
        }
    }
);

export const postModelSetsGroup = createAsyncThunk('models/post', async (strict, { getState }) => {
    const token = getState()?.user.user?.id_token;
    const setGroup = getState()?.models.currentGroup;
    return await modelsAPI.postModelSetsGroup(setGroup, strict, token);
});

export const getAutomatonDefinitions = createAsyncThunk(
    'models/automaton/get/definitions',
    async (_arg, { getState }) => {
        const token = getState()?.user.user?.id_token;
        return await modelsAPI.getAutomatonDefinitions(token);
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
    resetGroup: (state) => {
        state.currentGroup = DEFAULT_GROUP;
    },
    changeGroup: (state, action) => {
        const { group, originalGroup, modelName, isAbsolute, matches } = action.payload;
        const currentGroup = _.cloneDeep(group);
        const definitions = state.parameterDefinitions;
        currentGroup.modelName = modelName;
        if (originalGroup) {
            currentGroup.name = currentGroup.name !== '' ? currentGroup.name : originalGroup.name;
            currentGroup.type = currentGroup.type !== '' ? currentGroup.type : originalGroup.type;
        } else if (isAbsolute) {
            currentGroup.type = SetType.FIXED;
        }
        const matchingSetName = (matchName, type) =>
            `${type === SetType.SUFFIX ? matchName : ''}${currentGroup.name}${
                type === SetType.PREFIX ? matchName : ''
            }`;
        // Create blank sets if needed
        if ((currentGroup.type === SetType.PREFIX || currentGroup.type === SetType.SUFFIX) && matches.length > 0) {
            const newSets = matches
                .filter(
                    (match) =>
                        _.findIndex(
                            currentGroup.sets,
                            (set) => set.name === matchingSetName(match, currentGroup.type)
                        ) === -1
                )
                .map((matchToAdd) => ({
                    name: matchingSetName(matchToAdd, currentGroup.type),
                    parameters: definitions.map((definition) => ({
                        name: definition.name,
                        value: definition.fixedValue ?? '',
                    })),
                }));
            currentGroup.sets = currentGroup.sets.concat(newSets);
        } else if (currentGroup.type === SetType.FIXED) {
            if (currentGroup.sets.length === 0) {
                currentGroup.sets.push({
                    name: currentGroup.name,
                    parameters: definitions.map((definition) => ({
                        name: definition.name,
                        value: definition.fixedValue ?? '',
                    })),
                });
            } else {
                const currentSet = currentGroup.sets[0];
                if (currentSet?.name !== currentGroup.name) {
                    currentSet['name'] = currentGroup.name;
                }
                if (currentSet.parameters?.length === 0) {
                    currentSet['parameters'] = definitions.map((definition) => ({
                        name: definition.name,
                        value: definition.fixedValue ?? '',
                    }));
                }
            }
        }

        state.currentGroup = currentGroup;
    },
    addOrModifySet: (state, action) => {
        const newSets = action.payload;

        _.forEach(Array.isArray(newSets) ? newSets : [newSets], (newSet) => {
            const setIndex = state.currentGroup.sets.findIndex((setToTest) => setToTest.name === newSet.name);
            if (setIndex === -1) {
                state.currentGroup.sets.push(newSet);
            } else {
                state.currentGroup.sets[setIndex] = newSet;
            }
        });
    },
    resetSearchSets: (state) => {
        state.currentGroup.searchSets = [];
    },
};

const extraReducers = (builder) => {
    builder.addCase(getModels.fulfilled, (state, action) => {
        state.models = action.payload;
        state.status = RequestStatus.SUCCESS;
    });
    builder.addCase(getModelDefinitions.fulfilled, (state, action) => {
        state.parameterDefinitions = action.payload;
        state.status = RequestStatus.SUCCESS;
    });
    builder.addCase(getModelSets.fulfilled, (state, action) => {
        const receivedSets = action.payload;

        state.currentGroup.sets = _.uniqBy(receivedSets.concat(state.currentGroup.sets), 'name');
        state.status = RequestStatus.SUCCESS;
    });
    builder.addCase(getSearchedModelSets.fulfilled, (state, action) => {
        const candidateSets = action.payload;

        state.currentGroup.searchSets = _.uniqBy(candidateSets, 'name');
        state.status = RequestStatus.SUCCESS;
    });
    builder.addCase(postModelSetsGroup.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.currentGroup = DEFAULT_GROUP;
        const updatedModel = state.models.find((model) => model.name === updatedGroup.modelName);
        if (updatedModel) {
            const simpleUpdatedGroup = {
                name: updatedGroup.name,
                type: updatedGroup.type,
                setsNumber: updatedGroup.sets.length,
            };
            const groupIndex = updatedModel.groups.findIndex((group) => group.name === simpleUpdatedGroup.name);
            if (groupIndex === -1) {
                updatedModel.groups.push(simpleUpdatedGroup);
            } else {
                updatedModel.groups[groupIndex] = simpleUpdatedGroup;
            }
        }
        state.status = RequestStatus.SUCCESS;
    });
    builder.addCase(getAutomatonDefinitions.fulfilled, (state, action) => {
        const automatonDefinitions = action.payload;

        // received automatonDefinitions is an array of automaton models
        // => aggregate this array into an object map for the reason of simplicity
        state.automatonDefinitions = automatonDefinitions.reduce((obj, automaton) => ({ ...obj, ...automaton }), {});
        state.status = RequestStatus.SUCCESS;
    });
};

export const ModelSlice = createSlice({
    name: 'InstanceModel',
    initialState,
    reducers,
    extraReducers,
});

export const ModelReducer = ModelSlice.reducer;
