/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export const styles = {
    label: (isValid) => ({
        textAlign: 'right',
        marginTop: '12px',
        '& .MuiTypography-root': {
            fontWeight: 'bold',
            color: !isValid ? 'red' : 'text.primary',
        },
    }),
    filter: {
        justifyContent: 'center',
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
};
