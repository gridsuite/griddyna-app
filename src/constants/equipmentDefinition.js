/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const EquipmentType = {
    GENERATOR: 'GENERATOR',
    LOAD: 'LOAD',
    BUS: 'BUS',
    LINE: 'LINE',
    TWO_WINDINGS_TRANSFORMER: 'TWO_WINDINGS_TRANSFORMER',
};
Object.freeze(EquipmentType);

export const RuleEquipmentTypes = [EquipmentType.GENERATOR, EquipmentType.LOAD];
Object.freeze(RuleEquipmentTypes);

export const PropertyType = {
    STRING: 'STRING',
    BOOLEAN: 'BOOLEAN',
    NUMBER: 'NUMBER',
    ENUM: 'ENUM',
};
Object.freeze(PropertyType);

export const EquipmentProperties = {
    GENERATOR: [
        {
            name: 'energySource',
            type: PropertyType.ENUM,
            values: ['OTHER', 'HYDRO'],
        },
        {
            name: 'id',
            type: PropertyType.STRING,
        },
        {
            name: 'terminal.voltageLevel.nominalV',
            label: 'nominalV',
            type: PropertyType.NUMBER,
        },
        {
            name: 'terminal.voltageLevel.substation.country.name',
            label: 'country',
            type: PropertyType.STRING,
        },
        {
            name: 'name',
            type: PropertyType.STRING,
        },
        {
            name: 'minP',
            type: PropertyType.NUMBER,
        },
        {
            name: 'maxP',
            type: PropertyType.NUMBER,
        },
        {
            name: 'voltageRegulatorOn',
            type: PropertyType.BOOLEAN,
        },
        {
            name: 'targetP',
            type: PropertyType.NUMBER,
        },
        {
            name: 'targetV',
            type: PropertyType.NUMBER,
        },
        {
            name: 'targetQ',
            type: PropertyType.NUMBER,
        },
        {
            name: 'p',
            type: PropertyType.NUMBER,
        },
        {
            name: 'q',
            type: PropertyType.NUMBER,
        },
    ],
    LOAD: [
        {
            name: 'loadType',
            type: PropertyType.ENUM,
            values: ['UNDEFINED'],
        },
        {
            name: 'terminal.voltageLevel.nominalV',
            label: 'nominalV',
            type: PropertyType.NUMBER,
        },
        {
            name: 'terminal.voltageLevel.substation.country.name',
            label: 'country',
            type: PropertyType.STRING,
        },
        {
            name: 'id',
            type: PropertyType.STRING,
        },
        {
            name: 'name',
            type: PropertyType.STRING,
        },
        {
            name: 'p0',
            type: PropertyType.NUMBER,
        },
        {
            name: 'q0',
            type: PropertyType.NUMBER,
        },
        {
            name: 'p',
            type: PropertyType.NUMBER,
        },
        {
            name: 'q',
            type: PropertyType.NUMBER,
        },
    ],
};
Object.freeze(EquipmentProperties);

export const AutomatonFamily = {
    CURRENT_LIMIT: 'CURRENT_LIMIT',
    VOLTAGE: 'VOLTAGE',
};
Object.freeze(AutomatonFamily);

export const AutomatonModels = {
    CURRENT_LIMIT_AUTOMATON: 'CurrentLimitAutomaton',
    TAP_CHANGER_BLOCKING: 'TapChangerBlocking',
};

export const AutomatonProperties = {
    [AutomatonFamily.CURRENT_LIMIT]: {
        [AutomatonModels.CURRENT_LIMIT_AUTOMATON]: {
            side: {
                type: 'string',
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
    },
    [AutomatonFamily.VOLTAGE]: {
        [AutomatonModels.TAP_CHANGER_BLOCKING]: {
            name: {
                type: 'string',
            },
            uMeasurement: {
                type: 'string',
                equipmentTypes: [EquipmentType.BUS],
            },
            transformer: {
                type: 'string',
                equipmentTypes: [
                    EquipmentType.LOAD,
                    EquipmentType.TWO_WINDINGS_TRANSFORMER,
                ],
            },
        },
    },
};
Object.freeze(AutomatonProperties);
