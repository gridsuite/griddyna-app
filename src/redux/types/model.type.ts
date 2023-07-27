/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface Group {
    name: string;
    type: string; // TODO must be SetType enum
    setsNumber: number;
}

export interface Model {
    name: string;
    type: string; // TODO must be EquipmentType enum
    groups: Group[];
}

export interface PropertyMappingDefinition {
    equipmentTypes: string[]; // must be EquipmentType enum
    equipmentProperty: string;
}

export interface AutomationPropertyDefinition {
    type: string;
    label: string;
    isRequired?: boolean;
    max?: number;
    multiple: boolean;
    values?: {
        value: string;
        label: string;
    }[];
    mapping?: PropertyMappingDefinition;
}

export interface AutomationDefinition {
    [key: string]: AutomationPropertyDefinition;
}
