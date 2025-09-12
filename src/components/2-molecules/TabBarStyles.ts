/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { type MuiStyles } from '@gridsuite/commons-ui';

export const styles = {
    tabWithError: {
        '&.Mui-selected': { color: 'error.main' },
        color: 'error.main',
    },
} as const satisfies MuiStyles;
