/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const styles = {
    height: {
        height: 'calc(100vh - 72px)',
    },
    menu: {
        height: '100%',
        display: 'grid',
        '& .MuiDrawer-paper': {
            position: 'relative',
            minWidth: '260px',
            width: '100%',
        },
    },
    mainBox: {
        position: 'absolute',
        maxWidth: 'calc(100% - 260px)',
        right: 0,
        width: '83%',
        padding: '0.3%',
        '& .MuiPaper-root': {
            padding: '10px',
        },
    },
    menuBox: {
        position: 'absolute',
        minWidth: '260px',
        height: 'calc(100vh - 72px)',
        bottom: 0,
        left: 0,
        width: '17%',
        overflowY: 'auto',
    },
};
