/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const EquipmentType = {
    GENERATOR: 'GENERATOR',
    LOAD: 'LOAD',
};
Object.freeze(EquipmentType);

export const PropertyType = {
    ENUM: 'ENUM',
    STRING: 'STRING',
    BOOLEAN: 'BOOLEAN',
    NUMBER: 'NUMBER',
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
            type: PropertyType.NUMBER,
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
