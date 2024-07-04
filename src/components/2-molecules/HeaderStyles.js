/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const ICON_SIZE = '2em';

export const styles = {
    headerBox: {
        border: '1px solid',
        borderRadius: '5px',
        marginBottom: 1,
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
    buttonIcon: {
        '& .MuiIconButton-root': {
            width: ICON_SIZE,
            height: ICON_SIZE,
            '& .MuiIconButton-label .MuiSvgIcon-root': {
                fontSize: ICON_SIZE,
            },
        },
    },
    gridTitle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 1,
    },
    gridButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 1,
    },
};
