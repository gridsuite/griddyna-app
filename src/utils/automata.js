/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    AutomatonModelProperties,
    AutomatonAdditionalProperties,
} from '../constants/equipmentDefinition';

export const getAutomatonAdditionalProperty = (model, property) => {
    return AutomatonAdditionalProperties[model]?.[property];
};

export const getAutomatonAdditionalProperties = (model) => {
    return AutomatonAdditionalProperties[model];
};

export const getPossibleEquipmentTypesFromAutomatonModel = (
    model,
    property
) => {
    return AutomatonModelProperties[model]?.[property]?.equipmentTypes;
};

export const getAutomatonModelProperties = (model) => {
    return AutomatonModelProperties[model];
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

    const possibleValues = possibleTypes.reduce(
        (arr, possibleType) => [
            ...arr,
            ...(propertyValues?.find(
                (propertyValuesItem) => propertyValuesItem.type === possibleType
            )?.values[targetProperty] ?? []),
        ],
        []
    );

    return possibleValues.map((possibleValue) => ({
        value: possibleValue,
        label: possibleValue,
    }));
};
