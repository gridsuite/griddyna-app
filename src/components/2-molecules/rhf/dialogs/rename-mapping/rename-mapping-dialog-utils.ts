/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import { InferType } from 'yup';
import { FieldConstants } from '@gridsuite/commons-ui';

export const MAPPING_NAME = 'mappingName';

export const renameMappingDialogSchema = yup.object().shape({
    [MAPPING_NAME]: yup.string().trim().required('nameEmpty'),
    [FieldConstants.DIRECTORY]: yup
        .string()
        .notRequired() /* not used (use activeDirectory instead) but should be coherent to empty data */,
});

export const renameMappingDialogEmpty = {
    [MAPPING_NAME]: '',
    /* must init with undefined to Validate Button disabled correctly since useUniqueNameValidation subscribes hardcode this field */
    [FieldConstants.DIRECTORY]: undefined,
};

export type RenameMappingDialogForm = InferType<typeof renameMappingDialogSchema>;
