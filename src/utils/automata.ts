/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PropertyMappingDefinition } from '../redux/types/model.type';
import { EquipmentValues } from '../redux/types/network.type';

export const getPossibleOptionsForProperty = (
    propertyMappingDefinition: PropertyMappingDefinition,
    networkPropertyValues: EquipmentValues[]
) => {
    const possibleTypes = propertyMappingDefinition.equipmentTypes;
    const possibleValues = possibleTypes.reduce(
        (arr, possibleType) => [
            ...arr,
            ...(networkPropertyValues?.find((equipmentValues) => equipmentValues.type === possibleType)?.values[
                propertyMappingDefinition.equipmentProperty.toUpperCase()
            ] ?? []),
        ],
        [] as string[]
    );

    return possibleValues.map((possibleValue) => ({
        value: possibleValue,
        label: possibleValue,
    }));
};
