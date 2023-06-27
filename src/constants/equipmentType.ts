/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
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
