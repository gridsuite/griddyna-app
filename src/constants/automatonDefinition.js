/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AutomatonModelGroupPlugins } from '../plugins';
import { EquipmentType, PropertyType } from './equipmentType';

export const AutomatonFamily = {
    CURRENT_LIMIT: 'CURRENT_LIMIT',
    VOLTAGE: 'VOLTAGE',
};
Object.freeze(AutomatonFamily);

export const PropertyGroups = {
    ADDITIONAL: 'Additional properties',
};
Object.freeze(PropertyGroups);

export const AutomatonProperties = {
    CurrentLimitAutomaton: {
        watchedElement: {
            type: PropertyType.STRING,
            label: 'On equipment',
            mapping: {
                equipmentType: [EquipmentType.LINE],
                equipmentProperty: 'id',
            },
        },
        side: {
            type: PropertyType.STRING,
            label: 'Side',
            values: [
                {
                    value: 'Branch.Side.ONE',
                    label: 'One',
                },
                {
                    value: 'Branch.Side.TWO',
                    label: 'Two',
                },
            ],
            group: PropertyGroups.ADDITIONAL,
        },
    },
    ...AutomatonModelGroupPlugins.reduce(
        (obj, plugin) => ({ ...obj, ...plugin.modePlugin }),
        {}
    ),
};
Object.freeze(AutomatonProperties);
