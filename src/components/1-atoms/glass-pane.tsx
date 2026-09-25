/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactNode } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { type MuiStyles } from '@gridsuite/commons-ui';

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden', // prevents the absolute child from leaking outside
    },
    glassPane: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        zIndex: 19,
        position: 'absolute',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
    },
} as const satisfies MuiStyles;

interface GlassPaneProps {
    active: boolean;
    children: ReactNode;
    loadingMessageText?: string;
    error: boolean;
    errorMessageText?: string;
}

// Take from study-app then add error, errorMessageText props and a relative container, should move to commons-ui
function GlassPane({ active, children, loadingMessageText, error, errorMessageText }: Readonly<GlassPaneProps>) {
    return (
        <Box sx={styles.container} inert={active || error}>
            {active && (
                <Box sx={styles.glassPane}>
                    <CircularProgress size={64} />
                    {loadingMessageText && <FormattedMessage id={loadingMessageText} />}
                </Box>
            )}
            {error && (
                <Box sx={styles.glassPane}>
                    {errorMessageText && (
                        <Typography variant="h5" sx={{ color: 'text.disabled' }}>
                            <FormattedMessage id={errorMessageText} />
                        </Typography>
                    )}
                </Box>
            )}
            {!error && children}
        </Box>
    );
}

export default GlassPane;
