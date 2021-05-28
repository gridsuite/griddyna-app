/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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
        saveTooltip,
        addElement,
        addTooltip,
        convert,
        convertTooltip,
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
                            tooltip={convertTooltip}
                        />
                    )}
                    {save !== undefined && (
                        <SaveButton onClick={save} tooltip={saveTooltip} />
                    )}
                    {addElement !== undefined && (
                        <AddIconButton
                            onClick={addElement}
                            tooltip={addTooltip}
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
    saveTooltip: PropTypes.string,
    convert: PropTypes.func,
    convertTooltip: PropTypes.string,
    addElement: PropTypes.func,
    addTooltip: PropTypes.string,
};

export default Header;
