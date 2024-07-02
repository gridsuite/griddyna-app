/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const styles = {
    ruleModel: (theme) => ({
        border: 1,
        borderRadius: 1,
        borderColor: theme.palette.grey[500],
    }),
    rulePaper: {
        borderRadius: '5px',
        marginBottom: '5px',
        '& >.MuiGrid-root': {
            marginTop: '5px',
        },
    },
    invalidRulePaper: {
        borderColor: 'red',
    },
    label: {
        marginTop: '4px',
        textAlign: 'right',
        paddingRight: '5px',
    },
    filterLabel: {
        alignItems: 'center',
        paddingLeft: '5px',
        marginTop: '1em',
    },
    unused: {
        color: '#ff9800',
        '& svg': {
            margin: '0.3em',
            fontSize: '2em',
        },
    },
    matches: (theme) => ({
        backgroundColor: theme.palette.grey[800],
        maxHeight: '8em',
        '& .MuiGrid-container': {
            '& .MuiGrid-item': {
                maxHeight: '7em',
                overflowY: 'auto',
            },
        },
    }),
};
