/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const SetType = {
    FIXED: 'FIXED',
    PREFIX: 'PREFIX',
    SUFFIX: 'SUFFIX',
};
Object.freeze(SetType);

export const ParameterOrigin = {
    USER: 'USER',
    NETWORK: 'NETWORK',
    FIXED: 'FIXED',
};
Object.freeze(ParameterOrigin);

export const ParameterType = {
    INT: 'INT',
    BOOL: 'BOOL',
    DOUBLE: 'DOUBLE',
    STRING: 'STRING',
};
Object.freeze(ParameterType);

export const GroupEditionOrigin = {
    RULE: 'RULE',
    AUTOMATON: 'AUTOMATON',
};
Object.freeze(GroupEditionOrigin);
