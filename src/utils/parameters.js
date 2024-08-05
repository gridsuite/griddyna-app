/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ParameterOrigin, ParameterType } from '../constants/models';

export const isSetValid = (set, definitions) =>
    definitions.reduce(
        (acc, definition) => acc && (definition.origin !== ParameterOrigin.USER || isParameterValid(set, definition)),
        true
    );

const isParameterValid = (set, definition) => {
    const correspondingParameter = set.parameters.find((parameter) => parameter.name === definition.name);
    return correspondingParameter && isParameterValueValid(correspondingParameter.value, definition.type);
};

export const isParameterValueValid = (value, type) => {
    switch (type) {
        case ParameterType.BOOL:
            return value === 'true' || value === 'false';
        case ParameterType.STRING:
            return value.length > 0;
        case ParameterType.DOUBLE:
            return /^-?\d+([.]\d*)?$/.test(value);
        case ParameterType.INT:
            return /^\d+$/.test(value);
        default:
            return false;
    }
};
