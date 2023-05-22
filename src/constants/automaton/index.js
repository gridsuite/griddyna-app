/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import TapChangerBlockingModel from './model/TapChangerBlockingModel';
import CurrentLimitAutomatonModel from './model/CurrentLimitAutomatonModel';

export const CommonAutomatonModelGroupPlugins = [
    {
        id: 'TapChangerBlockingModel',
        model: TapChangerBlockingModel,
    },
    {
        id: 'CurrentLimitAutomatonModel',
        model: CurrentLimitAutomatonModel,
    },
];