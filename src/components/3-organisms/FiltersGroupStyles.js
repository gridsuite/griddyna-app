/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
    filter: {
        border: 'solid white 1px',
        borderRadius: '5px',
    },
    separator: {
        margin: '1Opx 0',
    },
    group: {
        // MUI Selected color
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
    },
    operatorSelect: {
        marginTop: '-12px',
    },
}));
