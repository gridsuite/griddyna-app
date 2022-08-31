/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import makeStyles from '@mui/styles/makeStyles';
export const useStyles = makeStyles((theme) => ({
    automatonPaper: (isValid) => ({
        border: '2px solid',
        borderRadius: '5px',
        borderColor: isValid ? 'black' : 'red',
        marginBottom: '5px',
        '& >.MuiGrid-root': {
            marginTop: '5px',
        },
    }),
    titleLabel: (isValid) => ({
        '& .MuiTypography-root': {
            fontWeight: 'bold',
            color: !isValid ? 'red' : theme.palette.text.primary,
        },
    }),
    label: {
        textAlign: 'right',
        marginTop: '12px',
        '& .MuiTypography-root': {
            fontWeight: 'bold',
        },
    },
    value: {
        margin: '8px',
        '& .MuiFormControl-root .MuiInput-root': {
            minHeight: '2em',
            '& .MuiSelect-root': {
                paddingTop: 0,
                paddingBottom: 0,
            },
        },
    },
    select: {},
}));
