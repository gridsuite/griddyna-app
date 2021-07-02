/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    AutomatonFamily,
    AutomatonProperties,
} from '../constants/equipmentDefinition';

export const getPossibleEquipmentTypesFromAutomatonFamily = (family) => {
    switch (family) {
        case AutomatonFamily.CURRENT_LIMIT:
            return ['LINE'];
        default:
            return [];
    }
};

export const getAutomatonProperty = (automatonFamily, property) => {
    return AutomatonProperties[automatonFamily][property];
};
