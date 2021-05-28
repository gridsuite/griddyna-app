/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const BaseOperands = {
    EQUALS: 'EQUALS',
    NOT_EQUALS: 'NOT_EQUALS',
};

export const StringOperands = {
    ...BaseOperands,
    INCLUDES: 'INCLUDES',
    STARTS_WITH: 'STARTS_WITH',
    ENDS_WITH: 'ENDS_WITH',
};
export const NumberOperands = {
    ...BaseOperands,
    LOWER: 'LOWER',
    LOWER_OR_EQUALS: 'LOWER_OR_EQUALS',
    HIGHER_OR_EQUALS: 'HIGHER_OR_EQUALS',
    HIGHER: 'HIGHER',
};

export const EnumOperands = {
    ...BaseOperands,
    IN: 'IN',
    NOT_IN: 'NOT_IN',
};
