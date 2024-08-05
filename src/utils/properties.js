/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EquipmentProperties } from '../constants/equipmentDefinition';

export function getProperty(equipmentType, propertyName) {
    return EquipmentProperties[equipmentType].find((property) => property.name === propertyName);
}

export function getValuesOption(property) {
    //TODO Intl
    return property?.values?.map((value) => ({
        label: value,
        value,
    }));
}
