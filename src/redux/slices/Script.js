import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as scriptsAPI from '../../rest/scriptsAPI';

import RequestStatus from '../../constants/RequestStatus';
const initialState = {
    scripts: [], // if alone, state as array directly
    status: RequestStatus.IDLE,
};

const DEFAULT_SCRIPT = {
    name: '',
    parent: undefined,
    script: '',
};
// Selectors

// Reducers

export const convertScript = createAsyncThunk(
    'scripts/convert',
    async (mappingName, { getState }) => {
        // TODO name
        const response = await scriptsAPI.convertToScript(mappingName);
        return response.json();
    }
);

const reducers = {};

const extraReducers = {
    [convertScript.fulfilled]: (state, action) => {
        state.status = RequestStatus.SUCCESS;
        alert(action.payload.script);
        state.scripts.push(action.payload.script);
    },
    [convertScript.rejected]: (state, action) => {
        state.status = RequestStatus.ERROR;
    },
    [convertScript.pending]: (state, action) => {
        state.status = RequestStatus.PENDING;
    },
};

export const ScriptSlice = createSlice({
    name: 'Script',
    initialState,
    reducers,
    extraReducers,
});

export const ScriptReducer = ScriptSlice.reducer;
