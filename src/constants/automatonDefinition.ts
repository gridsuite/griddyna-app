/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { EquipmentType } from './equipmentType';

export const AutomatonFamily = {
    CURRENT: 'CURRENT',
    VOLTAGE: 'VOLTAGE',
};
Object.freeze(AutomatonFamily);

// Family is used just as alias, we need a mapping to real automaton types
// to lookup associated automaton models for a given family
export const AutomatonFamilyToAutomatonType = {
    [AutomatonFamily.CURRENT]: EquipmentType.OVERLOAD_MANAGEMENT,
    [AutomatonFamily.VOLTAGE]: EquipmentType.VOLTAGE,
};
