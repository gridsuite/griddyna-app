/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Field } from 'react-querybuilder';
import { EXPERT_FILTER_FIELDS as BASE_EXPERT_FILTER_FIELDS, FIELDS_OPTIONS, FieldType } from '@gridsuite/commons-ui';

// --- Generator customization --- //
// exclude fields which are not used in griddyna
const GENERATOR_FILTERED = BASE_EXPERT_FILTER_FIELDS.GENERATOR.filter(
    (field: Field) =>
        ![FieldType.TARGET_P, FieldType.TARGET_Q, FieldType.TARGET_V, FieldType.MARGINAL_COST].includes(
            field.name as FieldType
        )
);

// insert custom fields for griddyna after MAX_P
const generatorIndexToInsert = GENERATOR_FILTERED.findIndex((field: Field) => field.name === FieldType.MAX_P) + 1;
const GENERATOR = GENERATOR_FILTERED.slice(0, generatorIndexToInsert)
    .concat([FIELDS_OPTIONS.P, FIELDS_OPTIONS.Q, FIELDS_OPTIONS.P_ABSOLUTE, FIELDS_OPTIONS.Q_ABSOLUTE])
    .concat(GENERATOR_FILTERED.slice(generatorIndexToInsert));

// build custom expert filter fields
export const EXPERT_FILTER_FIELDS = {
    ...BASE_EXPERT_FILTER_FIELDS,
    GENERATOR: GENERATOR,
};
