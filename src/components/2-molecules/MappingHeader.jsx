import { Box, Typography } from '@material-ui/core';
import ConvertButton from '../1-atoms/ConvertButton';
import SaveButton from '../1-atoms/SaveButton';
import AddIconButton from '../1-atoms/AddIconButton';
import React from 'react';
import PropTypes from 'prop-types';

import { useStyles } from './MappingHeaderStyles';

const MappingHeader = (props) => {
    const { mappingName, saveMapping, addRule, convertToScript } = props;
    const classes = useStyles();
    return (
        <Box className={classes.headerBox}>
            <Box width="100%" display="flex">
                <Box className={classes.titleBox}>
                    <Typography variant="h1">{`${mappingName} :`}</Typography>
                </Box>
                <Box className={classes.buttonBox}>
                    <ConvertButton onClick={convertToScript} />
                    <SaveButton onClick={saveMapping} />
                    <AddIconButton onClick={addRule} />
                </Box>
            </Box>
        </Box>
    );
};

MappingHeader.propTypes = {
    mappingName: PropTypes.string.isRequired,
    saveMapping: PropTypes.func.isRequired,
    convertToScript: PropTypes.func.isRequired,
    copyMapping: PropTypes.func.isRequired,
    addRule: PropTypes.func.isRequired,
};

export default MappingHeader;
