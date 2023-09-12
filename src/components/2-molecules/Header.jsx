/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Tooltip, Typography } from '@mui/material';
import {
    AddIconButton,
    AttachButton,
    ConvertButton,
    SaveButton,
} from '../1-atoms/buttons/';
import React from 'react';
import PropTypes from 'prop-types';

import { styles } from './HeaderStyles';

const outdatedLabel =
    'Generated elements are outdated, re-generate them to delete this warning';

const Header = (props) => {
    const {
        name,
        currentNetwork,
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
        isCurrent = true,
    } = props;
    const sxStyles = styles({ isModified, isValid, isCurrent });
    return (
        <Box sx={sxStyles.headerBox}>
            <Box width="100%" display="flex">
                <Box
                    sx={sxStyles.titleBox}
                    display="flex"
                    alignItems="baseline"
                >
                    <Tooltip title={isCurrent ? '' : outdatedLabel}>
                        <Typography variant="h2" sx={sxStyles.title}>
                            {`${name}${isModified ? '*' : ''} :`}
                        </Typography>
                    </Tooltip>
                    <Typography variant="h3" sx={sxStyles.title}>
                        {`${currentNetwork?.networkName ?? ''}`}
                    </Typography>
                </Box>
                <Box sx={sxStyles.buttonBox}>
                    {convert !== undefined && (
                        <ConvertButton
                            onClick={convert}
                            tooltip={convertTooltip}
                            disabled={!isValid || isModified}
                        />
                    )}
                    {save !== undefined && (
                        <SaveButton
                            onClick={save}
                            tooltip={saveTooltip}
                            disabled={!isValid}
                        />
                    )}
                    {attach !== undefined && (
                        <AttachButton
                            onClick={attach}
                            tooltip={attachTooltip}
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
    currentNetwork: PropTypes.shape({
        networkId: PropTypes.string,
        networkName: PropTypes.string,
    }),
    isModified: PropTypes.bool,
    isValid: PropTypes.bool,
    isCurrent: PropTypes.bool,
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
