/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Theme } from '@mui/material';

export const styles = {
    gridContainer: (theme: Theme) => ({
        border: 1,
        borderRadius: 1,
        borderColor: theme.palette.grey[500],
    }),
    label: {
        '& .MuiTypography-root': {
            fontWeight: 'normal',
        },
        display: 'flex',
        alignItems: 'center',
    },
    value: {
        padding: '8px 8px',
        '& .MuiFormControl-root .MuiInput-root': {
            minHeight: '2em',
            '& .MuiSelect-root': {
                paddingTop: 0,
                paddingBottom: 0,
            },
        },
    },
    group: {
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
    },
};
