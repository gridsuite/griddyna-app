/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid, Tooltip, Typography } from '@mui/material';
import { AttachButton, SaveButton } from '../1-atoms/buttons/';
import PropTypes from 'prop-types';
import { styles } from './HeaderStyles';
import { mergeSx } from 'utils/functions';

const outdatedLabel = 'Generated elements are outdated, re-generate them to delete this warning';

const Header = (props) => {
    const {
        name,
        currentNetwork,
        isModified = false,
        isValid = true,
        save,
        saveTooltip,
        attach,
        attachTooltip,
        isCurrent = true,
    } = props;

    const getHeaderBoxStyle = () => {
        if (!isValid) {
            return mergeSx(styles.headerBox, styles.errorBorderColor);
        } else if (!isCurrent) {
            return mergeSx(styles.headerBox, styles.warningBorderColor);
        } else {
            return mergeSx(styles.headerBox);
        }
    };

    const getTitleStyle = () => {
        let titleStyle = isModified ? styles.modifiedTitle : {};
        if (!isValid) {
            titleStyle = mergeSx(titleStyle, styles.errorTitle);
        } else if (!isCurrent) {
            titleStyle = mergeSx(titleStyle, styles.warningTitle);
        }
        return titleStyle;
    };
    return (
        <Grid container sx={getHeaderBoxStyle()}>
            <Grid size="grow" sx={styles.gridTitle}>
                <Tooltip title={isCurrent ? '' : outdatedLabel}>
                    <Typography variant="h5" sx={getTitleStyle()}>
                        {`${name}${isModified ? '*' : ''} :`}
                    </Typography>
                </Tooltip>
                <Typography variant="h4" sx={getTitleStyle()}>
                    {`${currentNetwork?.networkName ?? ''}`}
                </Typography>
            </Grid>
            <Grid size="auto" sx={mergeSx(styles.gridButton, styles.buttonIcon)}>
                {save !== undefined && (
                    <SaveButton onClick={save} tooltip={saveTooltip} disabled={!isModified || !isValid} />
                )}
                {attach !== undefined && <AttachButton onClick={attach} tooltip={attachTooltip} />}
            </Grid>
        </Grid>
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
    attach: PropTypes.func,
    attachTooltip: PropTypes.string,
};

export default Header;
