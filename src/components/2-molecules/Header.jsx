/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Typography } from '@material-ui/core';
import {
    ConvertButton,
    SaveButton,
    AddIconButton,
    AttachButton,
} from '../1-atoms/buttons/';
import React from 'react';
import PropTypes from 'prop-types';

import { useStyles } from './HeaderStyles';

const Header = (props) => {
    const {
        name,
        isModified = false,
        isValid = true,
        save,
        saveTooltip,
        addElement,
        addTooltip,
        convert,
        convertTooltip,
        attach,
        attachTooltip,
    } = props;
    const classes = useStyles({ isModified, isValid });
    return (
        <Box className={classes.headerBox}>
            <Box width="100%" display="flex">
                <Box className={classes.titleBox}>
                    <Typography
                        variant="h2"
                        className={classes.title}
                    >{`${name}${isModified ? '*' : ''} :`}</Typography>
                </Box>
                <Box className={classes.buttonBox}>
                    {convert !== undefined && (
                        <ConvertButton
                            onClick={convert}
                            tooltip={convertTooltip}
                            disabled={!isValid || isModified}
                        />
                    )}
                    {attach !== undefined && (
                        <AttachButton
                            onClick={attach}
                            tooltip={attachTooltip}
                            disabled={!isValid}
                        />
                    )}
                    {save !== undefined && (
                        <SaveButton
                            onClick={save}
                            tooltip={saveTooltip}
                            disabled={!isValid}
                        />
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
    isValid: PropTypes.bool,
    save: PropTypes.func,
    saveTooltip: PropTypes.string,
    convert: PropTypes.func,
    convertTooltip: PropTypes.string,
    addElement: PropTypes.func,
    addTooltip: PropTypes.string,
    attach: PropTypes.func,
    attachTooltip: PropTypes.string,
};

export default Header;
