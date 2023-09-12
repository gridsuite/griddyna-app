/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const styles = {
    form: {
        m: 1,
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
        mt: 0,
    },
    chip: {
        m: 0,
    },
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
    // Either mess with the style (disappearing overflow) or allow scroll while Select is open
    disableScrollLock: true,
};
