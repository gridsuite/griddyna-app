/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import makeStyles from '@mui/styles/makeStyles';

const ICON_SIZE = '2em';

const displayColor = (isValid, isCurrent) => {
    if (!isValid) {
        return 'red';
    } else if (!isCurrent) {
        return 'orange';
    } else {
        return undefined;
    }
};

export const useStyles = makeStyles({
    headerBox: ({ isValid, isCurrent }) => ({
        border: '5px solid',
        borderRadius: '10px',
        marginBottom: '5px',
        borderColor: displayColor(isValid, isCurrent),
    }),
    title: ({ isModified, isValid, isCurrent }) => ({
        fontStyle: isModified ? 'italic' : undefined,
        color: displayColor(isValid, isCurrent),
    }),
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
});
