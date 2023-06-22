/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const getPossibleOptionsForProperty = (
    propertyMappingDefinition,
    networkPropertyValues
) => {
    const possibleTypes = propertyMappingDefinition.equipmentType;
    const possibleValues = possibleTypes.reduce(
        (arr, possibleType) => [
            ...arr,
            ...(networkPropertyValues?.find(
                (networkPropertyValues) =>
                    networkPropertyValues.type === possibleType
            )?.values[propertyMappingDefinition.equipmentProperty] ?? []),
        ],
        []
    );

    return possibleValues.map((possibleValue) => ({
        value: possibleValue,
        label: possibleValue,
    }));
};
