import { Box, Typography } from '@material-ui/core';
import { ConvertButton, SaveButton, AddIconButton } from '../1-atoms/buttons/';
import React from 'react';
import PropTypes from 'prop-types';

import { useStyles } from './MappingHeaderStyles';

const MappingHeader = (props) => {
    const {
        mappingName,
        isModified = false,
        saveMapping,
        addRule,
        convertToScript,
    } = props;
    const classes = useStyles();
    return (
        <Box className={classes.headerBox}>
            <Box width="100%" display="flex">
                <Box className={classes.titleBox}>
                    <Typography
                        variant="h1"
                        className={isModified ? classes.italic : ''}
                    >{`${mappingName}${isModified ? '*' : ''} :`}</Typography>
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
    isModified: PropTypes.bool,
    saveMapping: PropTypes.func.isRequired,
    convertToScript: PropTypes.func.isRequired,
    addRule: PropTypes.func.isRequired,
};

export default MappingHeader;
