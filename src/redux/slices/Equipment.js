import { createSlice } from '@reduxjs/toolkit';

// TODO: This slice helps visualise the mapping beforehand, it should show all equipments (ids)  and helps associate the model
const initialState = {
    equipments: [], // useless if alone
};

// Selectors

// Reducers

const reducers = {};

const extraReducers = {
    /* TODO
    [GET_EQUIPMENTS] // read the idm (only if we want
    [GET_TYPES] // Get the properties
     */
};

export const Equipment = createSlice({
    name: 'Equipment',
    initialState,
    reducers,
    extraReducers,
});

export const EquipmentReducer = Rule.reducer;
