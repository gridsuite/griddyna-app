import { Box, Typography } from '@material-ui/core';
import { ConvertButton, SaveButton, AddIconButton } from '../1-atoms/buttons/';
import React from 'react';
import PropTypes from 'prop-types';

import { useStyles } from './HeaderStyles';

const Header = (props) => {
    const { name, isModified = false, save, addElement, convert } = props;
    const classes = useStyles();
    return (
        <Box className={classes.headerBox}>
            <Box width="100%" display="flex">
                <Box className={classes.titleBox}>
                    <Typography
                        variant="h2"
                        className={isModified ? classes.italic : ''}
                    >{`${name}${isModified ? '*' : ''} :`}</Typography>
                </Box>
                <Box className={classes.buttonBox}>
                    {convert !== undefined && (
                        <ConvertButton onClick={convert} />
                    )}
                    {save !== undefined && <SaveButton onClick={save} />}
                    {addElement !== undefined && (
                        <AddIconButton onClick={addElement} />
                    )}
                </Box>
            </Box>
        </Box>
    );
};

Header.propTypes = {
    mappingName: PropTypes.string.isRequired,
    isModified: PropTypes.bool,
    saveMapping: PropTypes.func.isRequired,
    convertToScript: PropTypes.func.isRequired,
    addRule: PropTypes.func.isRequired,
};

export default Header;
