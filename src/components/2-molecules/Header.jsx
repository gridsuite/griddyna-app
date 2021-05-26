import { Box, Typography } from '@material-ui/core';
import { ConvertButton, SaveButton, AddIconButton } from '../1-atoms/buttons/';
import React from 'react';
import PropTypes from 'prop-types';

import { useStyles } from './HeaderStyles';

const Header = (props) => {
    const {
        name,
        isModified = false,
        save,
        savePopOver,
        addElement,
        addPopOver,
        convert,
        convertPopOver,
    } = props;
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
                        <ConvertButton
                            onClick={convert}
                            popOver={convertPopOver}
                        />
                    )}
                    {save !== undefined && (
                        <SaveButton onClick={save} popOver={savePopOver} />
                    )}
                    {addElement !== undefined && (
                        <AddIconButton
                            onClick={addElement}
                            popOver={addPopOver}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    );
};

Header.propTypes = {
    name: PropTypes.string.isRequired,
    isModified: PropTypes.bool,
    save: PropTypes.func,
    savePopOver: PropTypes.string,
    convert: PropTypes.func,
    convertPopOver: PropTypes.string,
    addElement: PropTypes.func,
    addPopOver: PropTypes.string,
};

export default Header;
