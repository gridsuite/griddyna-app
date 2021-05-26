import React from 'react';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';

const Script = (props) => {
    const { script, setScript } = props;

    return (
        <AceEditor
            placeholder="Script"
            mode="java"
            theme="monokai"
            name="script"
            width="100%"
            height="75vh"
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
    );
};

Script.propTypes = {
    script: PropTypes.string.isRequired,
    setScript: PropTypes.func.isRequired,
};

export default Script;
