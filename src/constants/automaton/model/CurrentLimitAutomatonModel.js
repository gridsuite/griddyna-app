/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EquipmentType, PropertyType } from '../../equipmentType';

const CurrentLimitAutomatonModel = {
    CurrentLimitAutomaton: {
        name: {
            type: PropertyType.STRING,
            label: 'Name',
        },
        staticId: {
            type: PropertyType.STRING,
            label: 'On equipment',
            mapping: {
                equipmentType: [EquipmentType.LINE],
                equipmentProperty: 'id',
            },
        },
        side: {
            type: PropertyType.ENUM,
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
        },
    },
};

export default CurrentLimitAutomatonModel;
