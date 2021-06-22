/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { makeStyles } from '@material-ui/core';

const FONT_SIZE = '0.875em';
const MINIMUM_WIDTH = '150px';
export const useStyles = makeStyles((theme) => ({
    inputWidth: ({ labelLength, selectedOptions }) => {
        return {
            width: `max(${MINIMUM_WIDTH},calc(${FONT_SIZE} * ${labelLength} + 80px * ${selectedOptions} +  ${
                selectedOptions !== 0 ? 1 : 0
            } * 50px))`,
        };
    },
}));
