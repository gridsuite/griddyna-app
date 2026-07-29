/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import RequestStatus from '../../constants/RequestStatus';
import * as studyAPI from '../../rest/studyAPI';
import { PropertyType } from '../../constants/equipmentType';

const initialState = {
    propertyValues: [],
    knownStudies: [],
    currentStudy: '',
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

export const getCurrentNetworkId = (state) => state.network.currentStudy;

// from the current study id => get study infos
export const getCurrentStudyInfos = createSelector(
    (state) => state.network.currentStudy,
    (state) => state.network.knownStudies,
    (currentStudy, knownStudies) => {
        return knownStudies?.find((study) => study.studyId === currentStudy);
    }
);

// Reducers

export const getPropertyValuesFromStudyId = createAsyncThunk(
    'network/getValuesFromStudyId',
    async (studyId, { getState }) => {
        const token = getState()?.user.user?.id_token;
        const { propertyValues } = await studyAPI.getNetworkValuesFromStudy(studyId, token);
        return { propertyValues, studyId };
    }
);

export const getStudies = createAsyncThunk('network/getStudies', async ({ ids }, _thunkApi) => {
    return studyAPI.getStudyNames(ids);
});

const reducers = {
    cleanNetwork: (state) => {
        state.propertyValues = [];
        state.currentStudy = '';
    },
};

const extraReducers = (builder) => {
    /* TODO
[GET_EQUIPMENTS] // read the idm (only if we want
[GET_TYPES] // Get the properties
*/
    builder.addCase(getPropertyValuesFromStudyId.fulfilled, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        const { propertyValues, studyId } = action.payload;
        state.propertyValues = propertyValues;
        state.currentStudy = studyId;
    });
    builder.addCase(getPropertyValuesFromStudyId.rejected, (state, _action) => {
        state.status = RequestStatus.ERROR;
    });
    builder.addCase(getPropertyValuesFromStudyId.pending, (state, _action) => {
        state.status = RequestStatus.PENDING;
    });
    builder.addCase(getStudies.fulfilled, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        state.knownStudies = action.payload;
    });
    builder.addCase(getStudies.rejected, (state, _action) => {
        state.status = RequestStatus.ERROR;
    });
    builder.addCase(getStudies.pending, (state, _action) => {
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
