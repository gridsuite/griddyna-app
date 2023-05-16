/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AutomatonProperties } from '../constants/equipmentDefinition';

export const getAutomatonPropertiesByModel = (model) => {
    return AutomatonProperties[model];
};

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

const FIELD_GROUP = 'group';
export const UNKNOWN_GROUP = 'Unknown Group';

/**
 * Get automaton property definitions of a model then grouping in an object
 * @param model a model's name
 * @returns {{}} an object which groups property definitions of a model
 */
export const getAutomatonPropertiesByModelThenGroup = (model) => {
    const propertiesDefinition = getAutomatonPropertiesByModel(model) ?? {};

    // grouping by the 'group' attribute, absence of 'group' attribute means UNKNOWN_GROUP
    return Object.entries(propertiesDefinition).reduce(
        (result, [key, value]) => {
            let groupName = value[FIELD_GROUP];
            if (!groupName) {
                groupName = UNKNOWN_GROUP;
            }
            if (!result[groupName]) {
                result[`${groupName}`] = {};
            }
            result[`${groupName}`][key] = value;
            return result;
        },
        {}
    );
};
