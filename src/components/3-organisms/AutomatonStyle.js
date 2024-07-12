/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const styles = {
    automatonModel: (theme) => ({
        border: 1,
        borderRadius: 1,
        borderColor: theme.palette.grey[500],
    }),
    automatonPaper: {
        borderRadius: '5px',
        marginBottom: '5px',
        '& >.MuiGrid-root': {
            marginTop: '5px',
        },
    },
    invalidAutomatonPaper: {
        border: '1px solid',
        borderColor: 'red',
    },
    titleLabel: {
        '& .MuiTypography-root': {
            fontWeight: 'normal',
            color: 'text.primary',
        },
    },
    invalidTitleLabel: {
        '& .MuiTypography-root': {
            color: 'red',
        },
    },
    label: {
        textAlign: 'left',
        marginTop: '12px',
        '& .MuiTypography-root': {
            fontWeight: 'bold',
        },
    },
    select: {
        textAlign: 'right',
    },
};
