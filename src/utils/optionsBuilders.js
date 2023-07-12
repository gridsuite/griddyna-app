/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    BaseOperands,
    EnumOperands,
    NumberOperands,
    StringOperands,
} from '../constants/operands';
import { EquipmentProperties } from '../constants/equipmentDefinition';
import { SetType } from '../constants/models';
import { AutomatonFamily } from '../constants/automatonDefinition';
import { PropertyType, RuleEquipmentTypes } from '../constants/equipmentType';

export function getRuleEquipmentTypesOptions() {
    return RuleEquipmentTypes.map((elem) => {
        const type = elem;
        // TODO intl
        return { value: type, label: type };
    });
}

export function getAutomatonFamiliesOptions() {
    return Object.keys(AutomatonFamily).map((key) => {
        const family = AutomatonFamily[key];
        // TODO intl
        return { value: family, label: family };
    });
}

// TODO intl
export function getOperandsOptions(propertyType) {
    switch (propertyType) {
        case PropertyType.BOOLEAN:
            return [
                {
                    value: BaseOperands.EQUALS,
                    label: '=',
                },
                // Since choices are always True/False, having both is redundant
            ];
        case PropertyType.NUMBER:
            return [
                {
                    value: NumberOperands.LOWER,
                    label: '<',
                },
                {
                    value: NumberOperands.LOWER_OR_EQUALS,
                    label: '<=',
                },
                {
                    value: NumberOperands.EQUALS,
                    label: '=',
                },
                {
                    value: NumberOperands.NOT_EQUALS,
                    label: '<>',
                },
                {
                    value: NumberOperands.HIGHER_OR_EQUALS,
                    label: '>=',
                },
                {
                    value: NumberOperands.HIGHER,
                    label: '>',
                },
                {
                    value: NumberOperands.IN,
                    label: 'is in',
                },
                {
                    value: NumberOperands.NOT_IN,
                    label: 'is not in',
                },
            ];
        case PropertyType.STRING:
            return [
                {
                    value: StringOperands.EQUALS,
                    label: '=',
                },
                {
                    value: StringOperands.NOT_EQUALS,
                    label: '!=',
                },
                {
                    value: StringOperands.INCLUDES,
                    label: 'includes',
                },
                {
                    value: StringOperands.STARTS_WITH,
                    label: 'starts with',
                },
                {
                    value: StringOperands.ENDS_WITH,
                    label: 'ends with',
                },
                {
                    value: StringOperands.IN,
                    label: 'is in',
                },
                {
                    value: StringOperands.NOT_IN,
                    label: 'is not in',
                },
            ];
        case PropertyType.ENUM:
            return [
                {
                    value: EnumOperands.EQUALS,
                    label: '=',
                },
                {
                    value: EnumOperands.NOT_EQUALS,
                    label: '!=',
                },
                {
                    value: EnumOperands.IN,
                    label: 'is in',
                },
                {
                    value: EnumOperands.NOT_IN,
                    label: 'is not in',
                },
            ];
        default:
            return [];
    }
}

// TODO Intl
export function getPropertiesOptions(type) {
    return EquipmentProperties[type].map((property) => ({
        label: property.label ?? property.name,
        value: property.name,
    }));
}

export function getModelNamesOptions(models) {
    return models.map((model) => ({
        label: model.id,
        value: model.id,
    }));
}

export function getInstantiatedModelsOptions(models) {
    return models.map((model) => ({
        label: model.name,
        value: model.name,
    }));
}

export function getModelsOptions(models) {
    return models.map((model) => ({
        label: model.name,
        value: model.name,
    }));
}

export function getSetTypesOptions() {
    return Object.keys(SetType).map((type) => ({
        label: SetType[type],
        value: SetType[type],
    }));
}
