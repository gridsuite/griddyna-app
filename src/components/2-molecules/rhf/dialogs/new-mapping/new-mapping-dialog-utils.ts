/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { InferType } from 'yup';
import { DIRECTORY_ITEM, directoryItemSchema, FieldConstants, NAME_EMPTY } from '@gridsuite/commons-ui';
import { OperationType } from '../../../../../utils/types';

export const MAPPING_NAME = 'mappingName';
export const FILE_SELECTOR = 'fileSelectorName';

export const newMappingDialogSchema = yup.object().shape({
    [FieldConstants.OPERATION_TYPE]: yup.string().required(),
    [MAPPING_NAME]: yup.string().trim().required(NAME_EMPTY),
    [FieldConstants.DESCRIPTION]: yup.string(),
    [FILE_SELECTOR]: yup
        .mixed<File>()
        .nullable()
        .when([FieldConstants.OPERATION_TYPE], {
            is: (operationType: OperationType) => operationType === OperationType.IMPORT,
            then: (schema) => schema.required(),
        }),
    [DIRECTORY_ITEM]: directoryItemSchema.required(),
});

export const newMappingDialogEmpty = {
    [FieldConstants.OPERATION_TYPE]: OperationType.NEW,
    [MAPPING_NAME]: '',
    [FieldConstants.DESCRIPTION]: '',
    [FILE_SELECTOR]: null,
    [DIRECTORY_ITEM]: null,
};

export type NewMappingDialogForm = InferType<typeof newMappingDialogSchema>;
