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
import RequestStatus from '../../constants/RequestStatus';
import * as networkAPI from '../../rest/networkAPI';
import { PropertyType } from '../../constants/equipmentDefinition';

const initialState = {
    propertyValues: [],
    status: RequestStatus.IDLE,
};

// Selectors

export const makeGetNetworkValues = () =>
    createSelector(
        (state) => state.network.propertyValues,
        (_state, args) => args,
        (propertyValues, { equipmentType, fullProperty }) =>
            propertyValues
                ?.find(
                    (propertyValuesItem) =>
                        propertyValuesItem.type === equipmentType
                )
                ?.values[fullProperty?.name]?.map((value) =>
                    fullProperty?.type === PropertyType.BOOLEAN
                        ? value === 'true'
                        : value
                ) ?? []
    );

// Reducers

export const getPropertyValuesFromFile = createAsyncThunk(
    'network/getValuesFromFile',
    async (file, { getState }) => {
        const token = getState()?.user.user?.id_token;
        const response = await networkAPI.getPropertyValuesFromFile(
            file,
            token
        );
        return response.json();
    }
);

export const getPropertyValuesFromNetworkId = createAsyncThunk(
    'network/getValuesFromId',
    async (networkId, { getState }) => {
        const token = getState()?.user.user?.id_token;
        const response = await networkAPI.getPropertyValuesFromId(
            networkId,
            token
        );
        return response.json();
    }
);

const reducers = {
    cleanNetwork: (state) => {
        state.propertyValues = [];
    },
};

const extraReducers = {
    /* TODO
    [GET_EQUIPMENTS] // read the idm (only if we want
    [GET_TYPES] // Get the properties
     */
    [getPropertyValuesFromFile.fulfilled]: (state, action) => {
        state.status = RequestStatus.SUCCESS;
        state.propertyValues = action.payload;
    },
    [getPropertyValuesFromFile.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [getPropertyValuesFromFile.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
    [getPropertyValuesFromNetworkId.fulfilled]: (state, action) => {
        state.status = RequestStatus.SUCCESS;
        state.propertyValues = action.payload;
    },
    [getPropertyValuesFromNetworkId.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [getPropertyValuesFromNetworkId.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
};

export const NetworkSlice = createSlice({
    name: 'Network',
    initialState,
    reducers,
    extraReducers,
});

export const NetworkReducer = NetworkSlice.reducer;
