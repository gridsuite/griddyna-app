/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSelector, createSlice } from '@reduxjs/toolkit';
import { EquipmentType } from '../../constants/equipmentDefinition';
// Only process instantiated models, models without parameters will be
// put in config files when added to app.

const initialState = {
    models: [
        // TODO Remove when connected
        {
            id: 'LoadAlphaBeta',
            type: EquipmentType.LOAD,
            name: 'LoadLab',
            modelName: 'LoadLab',
            params: {
                type: 'FIXED',
                name: 'LAB',
            },
        },
        {
            id: 'GeneratorFourWindings',
            type: EquipmentType.GENERATOR,
            modelName:
                'GeneratorSynchronousFourWindingsProportionalRegulations',
            name: 'GeneratorSynchronousFourWindingsProportionalRegulations',
            params: {
                type: 'PREFIX',
                name: 'GSFWPR',
            },
            setParams: 'GSFWPR',
        },
        {
            id: 'GeneratorThreeWindings',
            type: EquipmentType.GENERATOR,
            name: 'GeneratorSynchronousThreeWindingsProportionalRegulations',
            modelName:
                'GeneratorSynchronousThreeWindingsProportionalRegulations',
            params: {
                type: 'PREFIX',
                name: 'GSTWPR',
            },
        },
    ], // useless if alone
};

// Selectors

export const makeGetModels = () =>
    createSelector(
        (state) => state.instanceModels.models,
        (_, equipmentType) => equipmentType,
        (models, equipmentType) =>
            models.filter((model) => model.type === equipmentType)
    );

// Reducers

const reducers = {};

const extraReducers = {
    /* TODO
    [GET_MODELS] // instantiated
     */
};

export const InstanceModel = createSlice({
    name: 'InstanceModel',
    initialState,
    reducers,
    extraReducers,
});

export const InstanceModelReducer = InstanceModel.reducer;
