/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    AutomatonModelProperties,
    AutomatonProperties,
} from '../constants/equipmentDefinition';

export const getPossibleEquipmentTypesFromAutomatonModel = (
    model,
    property
) => {
    return AutomatonModelProperties[model]?.[property]?.equipmentTypes;
};

export const getAutomatonProperty = (model, property) => {
    return AutomatonProperties[model]?.[property];
};

export const getPossibleOptionsModelProperty = (
    model,
    sourceProperty,
    targetProperty,
    propertyValues
) => {
    const possibleTypes =
        getPossibleEquipmentTypesFromAutomatonModel(model, sourceProperty) ??
        [];

    console.log('possibleTypes', possibleTypes);
    console.log('propertyValues', propertyValues);

    const ids = possibleTypes.reduce(
        (arr, possibleType) => [
            ...arr,
            ...(propertyValues?.find(
                (propertyValuesItem) => propertyValuesItem.type === possibleType
            )?.values[targetProperty] ?? []),
        ],
        []
    );

    console.log('ids', ids);
    return ids;
};
