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
import * as _ from 'lodash';

import * as scriptsAPI from '../../rest/scriptsAPI';
import RequestStatus from '../../constants/RequestStatus';

const initialState = {
    activeScript: '',
    text: '',
    scripts: [], // if alone, state as array directly
    status: RequestStatus.IDLE,
    parametersFile: '',
    isCurrent: true,
};
// TODO: Add Script Creation Front-Side ?
// const DEFAULT_SCRIPT = {
//     name: '',
//     parent: undefined,
//     script: '',
//       isManual: true
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
        const token = getState()?.user.user?.id_token;
        return await scriptsAPI.convertToScript(mappingName, token);
    }
);

export const getScripts = createAsyncThunk(
    'scripts/get',
    async (_arg, { getState }) => {
        const token = getState()?.user.user?.id_token;
        return await scriptsAPI.getScripts(token);
    }
);

export const deleteScript = createAsyncThunk(
    'scripts/delete',
    async (scriptName, { getState }) => {
        const token = getState()?.user.user?.id_token;
        return await scriptsAPI.deleteScript(scriptName, token);
    }
);
export const copyScript = createAsyncThunk(
    'scripts/copy',
    async ({ originalName, copyName }, { getState }) => {
        const token = getState()?.user.user?.id_token;
        return await scriptsAPI.copyScript(originalName, copyName, token);
    }
);

export const renameScript = createAsyncThunk(
    'scripts/rename',
    async ({ nameToReplace, newName }, { getState }) => {
        const token = getState()?.user.user?.id_token;
        return await scriptsAPI.renameScript(nameToReplace, newName, token);
    }
);

export const postScript = createAsyncThunk(
    'scripts/post',
    async (name, { getState }) => {
        const state = getState();
        const token = state?.user.user?.id_token;
        const scriptName = name ?? state?.scripts.activeScript;
        const script =
            name && name !== state?.scripts.activeScript
                ? state?.scripts.scripts.find((script) => script.name === name)
                      ?.script
                : state?.scripts.text;

        return await scriptsAPI.postScript(scriptName, script, token);
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
            state.parametersFile = scriptToUse.parametersFile;
            state.isCurrent = scriptToUse.current;
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
        const receivedScript = action.payload;
        const receivedName = receivedScript.name;
        let isUpdate = false;
        state.scripts.forEach((script) => {
            if (!isUpdate && script.name === receivedName) {
                script.script = receivedScript.script;
                script.script = receivedScript.script;
                script.current = receivedScript.current;
                script.parametersFile = receivedScript.parametersFile;
                isUpdate = true;
            }
        });
        if (state.activeScript === receivedName) {
            state.text = receivedScript.script;
            state.parametersFile =
                receivedScript.parametersFile !== null
                    ? receivedScript.parametersFile
                    : undefined;
            state.isCurrent = receivedScript.current;
        }
        if (!isUpdate) {
            state.scripts.push(receivedScript);
        }
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
    [postScript.fulfilled]: (state, action) => {
        state.status = RequestStatus.SUCCESS;
        const receivedScript = action.payload;
        const foundScript = state.scripts.find(
            (script) => script.name === receivedScript.name
        );
        if (foundScript) {
            foundScript.script = receivedScript.script;
        }
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
    [renameScript.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [renameScript.pending]: (state, _action) => {
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
