/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CommonAutomatonModelGroupPlugins } from './automaton';
import { ExtendedAutomatonModelGroupPlugins } from '../plugins';

export const AutomatonFamily = {
    CURRENT_LIMIT: 'CURRENT_LIMIT',
    VOLTAGE: 'VOLTAGE',
};
Object.freeze(AutomatonFamily);

export const AutomatonProperties = {
    ...CommonAutomatonModelGroupPlugins.concat(
        ExtendedAutomatonModelGroupPlugins
    ).reduce((obj, plugin) => ({ ...obj, ...plugin.model }), {}),
};
Object.freeze(AutomatonProperties);
