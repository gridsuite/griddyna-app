import { createSelector, createSlice } from '@reduxjs/toolkit';
import { EquipmentType } from '../../constants/equipmentDefinition';
// Only process instantiated models, models without parameters will be
// put in config files when added to app.

const initialState = {
    models: [
        // TODO Remove when connected
        {
            id: 'LoadLab',
            type: EquipmentType.LOAD,
            name: 'LoadAlphaBeta',
            modelName: 'LoadAlphaBeta',
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
