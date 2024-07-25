/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSelector, createSlice } from '@reduxjs/toolkit';
import * as _ from 'lodash';

const initialState = {
    activeScript: '',
    text: '',
    scripts: [], // if alone, state as array directly
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

export const ScriptsSlice = createSlice({
    name: 'Script',
    initialState,
    reducers,
});

export const ScriptsReducer = ScriptsSlice.reducer;
