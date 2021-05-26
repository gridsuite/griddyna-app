import { createSelector, createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as _ from 'lodash';

import * as scriptsAPI from '../../rest/scriptsAPI';
import RequestStatus from '../../constants/RequestStatus';
import { copyMapping, postMapping, renameMapping } from './Mapping';
const initialState = {
    activeScript: '',
    text: '',
    scripts: [], // if alone, state as array directly
    status: RequestStatus.IDLE,
};
// TODO: Add Script Creation Front-Side ?
// const DEFAULT_SCRIPT = {
//     name: '',
//     parent: undefined,
//     script: '',
// };

// Selectors

export const isModified = createSelector(
    (state) => state.scripts.activeScript,
    (state) => state.scripts.text,
    (state) => state.scripts.scripts,
    (activeName, activeScript, savedScripts) => {
        const foundScript = savedScripts.find(
            (script) => script.name === activeName
        );
        return !_.isEqual(activeScript, foundScript.script);
    }
);

export const getScriptsInfo = createSelector(
    (state) => state.scripts.scripts,
    (scripts) =>
        scripts.map((script) => ({
            name: script.name,
        }))
);

// Reducers

export const convertScript = createAsyncThunk(
    'scripts/convert',
    async (mappingName, { getState }) => {
        const response = await scriptsAPI.convertToScript(mappingName);
        return response.json();
    }
);

export const getScripts = createAsyncThunk('scripts/get', async (_arg) => {
    const response = await scriptsAPI.getScripts();
    return response.json();
});

export const deleteScript = createAsyncThunk(
    'scripts/delete',
    async (scriptName) => {
        const response = await scriptsAPI.deleteScript(scriptName);
        return response.text();
    }
);
export const copyScript = createAsyncThunk(
    'scripts/copy',
    async ({ originalName, copyName }) => {
        const response = await scriptsAPI.copyScript(originalName, copyName);
        return response.json();
    }
);

export const renameScript = createAsyncThunk(
    'scripts/rename',
    async ({ nameToReplace, newName }) => {
        const response = await scriptsAPI.renameScript(nameToReplace, newName);
        return response.json();
    }
);

export const postScript = createAsyncThunk(
    'scripts/post',
    async (name, { getState }) => {
        const state = getState();
        const scriptName = name ?? state?.scripts.activeScript;
        const script =
            name && name !== state?.scripts.activeScript
                ? state?.scripts.scripts.find((script) => script.name === name)
                      ?.script
                : state?.scripts.text;

        const response = await scriptsAPI.postScript(scriptName, script);
        return response.json();
    }
);

const reducers = {
    selectScript: (state, action) => {
        const { name } = action.payload;
        const scriptToUse = state.scripts.find(
            (script) => script.name === name
        );
        if (scriptToUse) {
            state.text = scriptToUse.script;
            state.activeScript = name;
        }
    },
    deselectScript: (state, _action) => {
        state.text = '';
        state.activeScript = '';
    },
    setText: (state, action) => {
        state.text = action.payload;
    },
};

const extraReducers = {
    [convertScript.fulfilled]: (state, action) => {
        state.status = RequestStatus.SUCCESS;
        alert(action.payload.script);
    },
    [convertScript.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [convertScript.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
    [getScripts.fulfilled]: (state, action) => {
        state.status = RequestStatus.SUCCESS;
        state.scripts = action.payload;
    },
    [getScripts.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [getScripts.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
    [deleteScript.fulfilled]: (state, action) => {
        state.status = RequestStatus.SUCCESS;
        const name = action.payload;
        state.scripts = state.scripts.filter((script) => script.name !== name);
        if (name === state.activeScript) {
            state.text = '';
            state.activeScript = '';
        }
    },
    [deleteScript.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [deleteScript.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
    [postScript.fulfilled]: (state, _action) => {
        state.status = RequestStatus.SUCCESS;
    },
    [postScript.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [postScript.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
    [renameScript.fulfilled]: (state, action) => {
        const { oldName, newName } = action.payload;
        const scriptToRename = state.scripts.find(
            (script) => script.name === oldName
        );
        if (scriptToRename) {
            scriptToRename.name = newName;
        }
        if (state.activeScript === oldName) {
            state.activeScript = newName;
        }
        state.status = RequestStatus.SUCCESS;
    },
    [renameMapping.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [renameMapping.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
    [copyScript.fulfilled]: (state, action) => {
        state.scripts.push(action.payload);
        state.status = RequestStatus.SUCCESS;
    },
    [copyScript.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [copyScript.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
};

export const ScriptsSlice = createSlice({
    name: 'Script',
    initialState,
    reducers,
    extraReducers,
});

export const ScriptsReducer = ScriptsSlice.reducer;
