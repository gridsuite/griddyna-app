/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EquipmentType, PropertyType } from '../../equipmentType';

const TapChangerBlockingModel = {
    TapChangerBlocking: {
        name: {
            type: PropertyType.STRING,
            label: 'Name',
        },
        uMeasurements: {
            type: PropertyType.STRING,
            label: 'U Measurement',
            mapping: {
                equipmentType: [EquipmentType.BUS],
                equipmentProperty: 'id',
            },
            max: 5,
            multiple: true,
        },
        transformers: {
            type: PropertyType.STRING,
            label: 'Transformers',
            mapping: {
                equipmentType: [
                    EquipmentType.LOAD,
                    EquipmentType.TWO_WINDINGS_TRANSFORMER,
                ],
                equipmentProperty: 'id',
            },
            multiple: true,
        },
    },
};

export default TapChangerBlockingModel;
