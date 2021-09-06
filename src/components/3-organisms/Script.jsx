/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';
import { Divider, Typography } from '@material-ui/core';

const parametersLabel = 'models.par';
const Script = (props) => {
    const { script, setScript, parametersFile } = props;

    return (
        <>
            <AceEditor
                placeholder="Script"
                mode="java"
                theme="monokai"
                name="script"
                width="100%"
                height={parametersFile ? '37vh' : '75vh'}
                onChange={setScript}
                fontSize={14}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={true}
                value={script}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2,
                }}
            />
            {parametersFile && (
                <>
                    <Divider />
                    <Typography variant="h3">{`${parametersLabel} :`}</Typography>
                    <AceEditor
                        placeholder="Params"
                        mode="java"
                        theme="monokai"
                        name="params"
                        width="100%"
                        height="37vh"
                        readOnly
                        fontSize={14}
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={parametersFile}
                        setOptions={{
                            showLineNumbers: true,
                            tabSize: 2,
                        }}
                    />
                </>
            )}
        </>
    );
};

Script.propTypes = {
    script: PropTypes.string.isRequired,
    setScript: PropTypes.func.isRequired,
    parametersFile: PropTypes.string,
};

export default Script;
