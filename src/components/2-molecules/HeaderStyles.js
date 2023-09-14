/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const ICON_SIZE = '2em';

export const styles = {
    headerBox: {
        border: '5px solid',
        borderRadius: '10px',
        marginBottom: '5px',
    },
    errorBorderColor: {
        borderColor: 'red',
    },
    warningBorderColor: {
        borderColor: 'orange',
    },
    modifiedTitle: {
        fontStyle: 'italic',
    },
    errorTitle: {
        color: 'red',
    },
    warningTitle: {
        color: 'orange',
    },
    titleBox: {
        position: 'relative',
        width: '75%',
    },
    buttonBox: {
        marginRight: '10px',
        marginTop: '1em',
        position: 'relative',
        width: '25%',
        display: 'flex',
        justifyContent: 'space-evenly',
        '& .MuiIconButton-root': {
            width: ICON_SIZE,
            height: ICON_SIZE,
            '& .MuiIconButton-label .MuiSvgIcon-root': {
                fontSize: ICON_SIZE,
            },
        },
    },
};
