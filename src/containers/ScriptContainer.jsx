/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    isModified as isModifiedSelector,
    postScript,
    ScriptsSlice,
} from '../redux/slices/Script';
import { Paper } from '@material-ui/core';
import Header from '../components/2-molecules/Header';
import Script from '../components/3-organisms/Script';

// TODO intl
const SAVE_LABEL = 'Save Script';

const ScriptContainer = () => {
    // TODO Add path parameter here
    const activeScript = useSelector((state) => state.scripts.activeScript);
    const script = useSelector((state) => state.scripts.text);
    const parametersFile = useSelector((state) => state.scripts.parametersFile);
    const isCurrent = useSelector((state) => state.scripts.isCurrent);
    const isModified = useSelector(isModifiedSelector);
    const dispatch = useDispatch();

    function setScript(newScript) {
        dispatch(ScriptsSlice.actions.setText(newScript));
    }

    function saveScript() {
        dispatch(postScript());
    }

    return (
        <Paper>
            <Header
                name={activeScript}
                isModified={isModified}
                save={saveScript}
                saveTooltip={SAVE_LABEL}
                isCurrent={isCurrent}
            />
            <Script
                script={script}
                setScript={setScript}
                parametersFile={parametersFile}
            />
        </Paper>
    );
};

export default ScriptContainer;
