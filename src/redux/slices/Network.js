/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import RequestStatus from '../../constants/RequestStatus';
import * as networkAPI from '../../rest/networkAPI';
import { PropertyType } from '../../constants/equipmentType';

const initialState = {
    propertyValues: [],
    knownNetworks: [],
    currentNetwork: '',
    status: RequestStatus.IDLE,
};

// base selectors
export const getPropertyValues = (state) => state.network.propertyValues;

// Selectors
export const getNetworkValues = (propertyValues, equipmentType, fullProperty) =>
    propertyValues
        ?.find((propertyValuesItem) => propertyValuesItem.type === equipmentType)
        ?.values[fullProperty?.name]?.map((value) =>
            fullProperty?.type === PropertyType.BOOLEAN ? value === 'true' : value
        ) ?? [];

export const getCurrentNetworkId = (state) => state.network.currentNetwork;

// from current network id => get network object
export const getCurrentNetworkObj = createSelector(
    (state) => state.network.currentNetwork,
    (state) => state.network.knownNetworks,
    (currentNetwork, knownNetworks) => {
        return knownNetworks?.find((knowNetwork) => knowNetwork.networkId === currentNetwork);
    }
);

// Reducers

export const getPropertyValuesFromFile = createAsyncThunk('network/getValuesFromFile', async (file, { getState }) => {
    const token = getState()?.user.user?.id_token;
    return await networkAPI.getPropertyValuesFromFile(file, token);
});

export const getPropertyValuesFromNetworkId = createAsyncThunk(
    'network/getValuesFromId',
    async (networkId, { getState }) => {
        const token = getState()?.user.user?.id_token;
        return await networkAPI.getPropertyValuesFromId(networkId, token);
    }
);

export const getNetworkNames = createAsyncThunk('network/getNetworks', async (_args, { getState }) => {
    const token = getState()?.user.user?.id_token;
    return await networkAPI.getNetworksName(token);
});

const reducers = {
    cleanNetwork: (state) => {
        state.propertyValues = [];
        state.currentNetwork = '';
    },
};

const extraReducers = (builder) => {
    /* TODO
[GET_EQUIPMENTS] // read the idm (only if we want
[GET_TYPES] // Get the properties
*/
    builder.addCase(getPropertyValuesFromFile.fulfilled, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        const { propertyValues, networkId } = action.payload;
        state.propertyValues = propertyValues;
        state.currentNetwork = networkId;
    });
    builder.addCase(getPropertyValuesFromFile.rejected, (state, _action) => {
        state.status = RequestStatus.ERROR;
    });
    builder.addCase(getPropertyValuesFromFile.pending, (state, _action) => {
        state.status = RequestStatus.PENDING;
    });
    builder.addCase(getPropertyValuesFromNetworkId.fulfilled, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        const { propertyValues, networkId } = action.payload;
        state.propertyValues = propertyValues;
        state.currentNetwork = networkId;
    });
    builder.addCase(getPropertyValuesFromNetworkId.rejected, (state, _action) => {
        state.status = RequestStatus.ERROR;
    });
    builder.addCase(getPropertyValuesFromNetworkId.pending, (state, _action) => {
        state.status = RequestStatus.PENDING;
    });
    builder.addCase(getNetworkNames.fulfilled, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        state.knownNetworks = action.payload;
    });
    builder.addCase(getNetworkNames.rejected, (state, _action) => {
        state.status = RequestStatus.ERROR;
    });
    builder.addCase(getNetworkNames.pending, (state, _action) => {
        state.status = RequestStatus.PENDING;
    });
};

export const NetworkSlice = createSlice({
    name: 'Network',
    initialState,
    reducers,
    extraReducers,
});

export const NetworkReducer = NetworkSlice.reducer;
