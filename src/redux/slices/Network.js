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
import { createParameterSelector } from '../selectorUtil';
import { PropertyType } from '../../constants/equipmentType';

const initialState = {
    propertyValues: [],
    knownNetworks: [],
    currentNetwork: '',
    status: RequestStatus.IDLE,
};

// base selectors
export const getPropertyValues = (state) => state.network.propertyValues;

// parameter selectors
// property param object {equipmentType, fullProperty, ..}
const getEquipmentTypeParam = createParameterSelector(
    ({ equipmentType }) => equipmentType
);
const getFullPropertyParam = createParameterSelector(
    ({ fullProperty }) => fullProperty
);

// Selectors
export const getNetworkValues = (propertyValues, equipmentType, fullProperty) =>
    propertyValues
        ?.find(
            (propertyValuesItem) => propertyValuesItem.type === equipmentType
        )
        ?.values[fullProperty?.name]?.map((value) =>
            fullProperty?.type === PropertyType.BOOLEAN
                ? value === 'true'
                : value
        ) ?? [];

export const makeGetNetworkValues = () =>
    createSelector(
        getPropertyValues,
        getEquipmentTypeParam,
        getFullPropertyParam,
        getNetworkValues
    );

export const makeGetPropertyValues = () =>
    createSelector(getPropertyValues, (propertyValues) => propertyValues);

export const getCurrentNetworkId = (state) => state.network.currentNetwork;

// from current network id => get network object
export const getCurrentNetworkObj = (state) => {
    const currentNetwork = state.network.currentNetwork;
    return state.network.knownNetworks?.find(
        (knowNetwork) => knowNetwork.networkId === currentNetwork
    );
};

// Reducers

export const getPropertyValuesFromFile = createAsyncThunk(
    'network/getValuesFromFile',
    async (file, { getState }) => {
        const token = getState()?.user.user?.id_token;
        return await networkAPI.getPropertyValuesFromFile(file, token);
    }
);

export const getPropertyValuesFromNetworkId = createAsyncThunk(
    'network/getValuesFromId',
    async (networkId, { getState }) => {
        const token = getState()?.user.user?.id_token;
        return await networkAPI.getPropertyValuesFromId(networkId, token);
    }
);

export const getNetworkNames = createAsyncThunk(
    'network/getNetworks',
    async (_args, { getState }) => {
        const token = getState()?.user.user?.id_token;
        return await networkAPI.getNetworksName(token);
    }
);

const reducers = {
    cleanNetwork: (state) => {
        state.propertyValues = [];
        state.currentNetwork = '';
    },
};

const extraReducers = {
    /* TODO
[GET_EQUIPMENTS] // read the idm (only if we want
[GET_TYPES] // Get the properties
*/
    [getPropertyValuesFromFile.fulfilled]: (state, action) => {
        state.status = RequestStatus.SUCCESS;
        const { propertyValues, networkId } = action.payload;
        state.propertyValues = propertyValues;
        state.currentNetwork = networkId;
    },
    [getPropertyValuesFromFile.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [getPropertyValuesFromFile.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
    [getPropertyValuesFromNetworkId.fulfilled]: (state, action) => {
        state.status = RequestStatus.SUCCESS;
        const { propertyValues, networkId } = action.payload;
        state.propertyValues = propertyValues;
        state.currentNetwork = networkId;
    },
    [getPropertyValuesFromNetworkId.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [getPropertyValuesFromNetworkId.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
    [getNetworkNames.fulfilled]: (state, action) => {
        state.status = RequestStatus.SUCCESS;
        state.knownNetworks = action.payload;
    },
    [getNetworkNames.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [getNetworkNames.pending]: (state, _action) => {
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
