/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import TapChangerBlockingAutomatonModel from './model/TapChangerBlockingAutomatonModel';
import CurrentLimitAutomatonModel from './model/CurrentLimitAutomatonModel';

export const CommonAutomatonModelGroupPlugins = [
    {
        id: 'TapChangerBlockingAutomatonModel',
        model: TapChangerBlockingAutomatonModel,
    },
    {
        id: 'CurrentLimitAutomatonModel',
        model: CurrentLimitAutomatonModel,
    },
];
