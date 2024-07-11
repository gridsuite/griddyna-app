/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const styles = {
    titleSelect: {
        textAlign: 'right',
    },
    button: {
        '& .MuiIconButton-root .MuiIconButton-label .MuiSvgIcon-root': {
            fontSize: '2em',
            pointerEvents: 'auto',
        },
    },
    errorButton: {
        '& .MuiIconButton-root .MuiIconButton-label .MuiSvgIcon-root': {
            color: 'red',
        },
    },
    gridItem: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 1,
    },
};
