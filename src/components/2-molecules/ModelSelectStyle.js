/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
    titleSelect: {},
    box: {},
    infoGrid: {
        height: '100%',
    },
    tooltip: {
        marginTop: '3em',
        justifyContent: 'center',
        display: 'flex',
    },
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
