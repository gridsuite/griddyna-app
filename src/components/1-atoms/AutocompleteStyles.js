/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const FONT_SIZE = 0.875; // em
const MINIMUM_WIDTH = '150px';
export const styles = ({ inputLength }) => ({
    inputWidth: {
        minWidth: MINIMUM_WIDTH,
        width: inputLength ? `calc(${inputLength} * ${FONT_SIZE} * 16px)` : 'auto',
    },
});
