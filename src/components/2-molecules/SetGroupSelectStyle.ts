/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material';

export interface StyleProps {
    errorInParams: boolean;
}

export const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
    titleSelect: {
        textAlign: 'right',
    },
    box: {},
    button: ({ errorInParams }) => ({
        justifyContent: 'center',
        display: 'flex',
        '& .MuiIconButton-root .MuiIconButton-label .MuiSvgIcon-root': {
            fontSize: '2em',
            pointerEvents: 'auto',
            color: errorInParams ? 'red' : 'unset',
        },
    }),
}));
