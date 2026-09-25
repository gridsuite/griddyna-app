/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Tooltip, Typography } from '@mui/material';
import { FolderOutlined } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { styles } from './HeaderStyles';
import { mergeSx } from 'utils/functions';
import SaveButton from '../1-atoms/buttons/SaveButton';

const outdatedLabel = 'Generated elements are outdated, re-generate them to delete this warning';

const Header = ({ name, breadCrumbName, isModified = false, isValid = true, save, saveTooltip, isCurrent = true }) => {
    const intl = useIntl();

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
        <Grid container sx={mergeSx(getHeaderBoxStyle(), { justifyContent: 'flex-end' })}>
            <Grid sx={{ paddingTop: 1 }}>
                <FolderOutlined />
            </Grid>
            <Grid size="grow" sx={styles.gridTitle}>
                <Tooltip title={isCurrent ? '' : outdatedLabel}>
                    <Typography variant="h6" sx={getTitleStyle()}>
                        {`${breadCrumbName || (name ?? intl.formatMessage({ id: 'elementNotFound' }))}${isModified ? '*' : ''}`}
                    </Typography>
                </Tooltip>
            </Grid>
            <Grid size="auto" sx={mergeSx(styles.gridButton)}>
                {save !== undefined && (
                    <SaveButton
                        label={intl.formatMessage({ id: 'saveMapping' })}
                        onClick={save}
                        tooltip={saveTooltip}
                        disabled={!isModified || !isValid}
                    />
                )}
            </Grid>
        </Grid>
    );
};

Header.propTypes = {
    name: PropTypes.string.isRequired,
    breadCrumbName: PropTypes.string,
    isModified: PropTypes.bool,
    isValid: PropTypes.bool,
    isCurrent: PropTypes.bool,
    save: PropTypes.func,
    saveTooltip: PropTypes.string,
};

export default Header;
