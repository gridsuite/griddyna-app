/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material';
export const useStyles = makeStyles<Theme>((theme) => ({
    label: {
        textAlign: 'left',
        marginTop: '12px',
        '& .MuiTypography-root': {
            fontWeight: 'bold',
        },
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
}));
