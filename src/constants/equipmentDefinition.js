/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EquipmentType, PropertyType } from './equipmentType';

export const EquipmentProperties = {
    [EquipmentType.GENERATOR]: [
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
    [EquipmentType.LOAD]: [
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
