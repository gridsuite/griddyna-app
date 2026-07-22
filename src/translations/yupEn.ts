/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    YUP_DEFAULT,
    YUP_NOT_NULL,
    YUP_NOT_TYPE_DEFAULT,
    YUP_NOT_TYPE_NUMBER,
    YUP_POSITIVE,
    YUP_REQUIRED,
} from '@gridsuite/commons-ui';

// TODO move to commons-ui and clean in networkModificationsEn.ts
export const yupEn = {
    [YUP_REQUIRED]: 'Required',
    [YUP_NOT_NULL]: 'Cannot be empty',
    [YUP_DEFAULT]: 'This field is invalid',
    [YUP_POSITIVE]: 'Must be a positive number',
    [YUP_NOT_TYPE_NUMBER]: 'This field only accepts numeric values',
    [YUP_NOT_TYPE_DEFAULT]: 'Field value format is incorrect',
};
