/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { InferType } from 'yup';
import { DIRECTORY_ITEM, DIRECTORY_ITEM_ID, directoryItemSchema, FieldConstants } from '@gridsuite/commons-ui';
import { OperationType } from '../../../../../utils/types';
import { UUID } from 'crypto';

export const MAPPING_NAME = 'mappingName';
export const FILE_SELECTOR = 'fileSelectorName';

export const getNewMappingDialogSchema = (mappingIdsInWorkspace: UUID[]) =>
    yup.object().shape({
        [FieldConstants.OPERATION_TYPE]: yup.string().required(),
        [MAPPING_NAME]: yup
            .string()
            .trim()
            .when([FieldConstants.OPERATION_TYPE], {
                is: (operationType: OperationType) =>
                    operationType === OperationType.NEW || operationType === OperationType.IMPORT_FILE,
                then: (schema) => schema.required('nameEmpty'),
            }),
        [FieldConstants.DESCRIPTION]: yup.string(),
        [FILE_SELECTOR]: yup
            .mixed<File>()
            .nullable()
            .when([FieldConstants.OPERATION_TYPE], {
                is: (operationType: OperationType) => operationType === OperationType.IMPORT_FILE,
                then: (schema) => schema.required(),
            }),
        [DIRECTORY_ITEM]: directoryItemSchema
            .required()
            .test('checkMappingAlreadyAdded', 'mappingAlreadyAdded', (value, _context) => {
                if (_context.parent[FieldConstants.OPERATION_TYPE] === OperationType.IMPORT_EXPLORE) {
                    const matched = mappingIdsInWorkspace?.some(
                        (mappingId) => mappingId === value?.[DIRECTORY_ITEM_ID]
                    );
                    return !matched;
                }
                return true;
            }),
    });

export const newMappingDialogEmpty = {
    [FieldConstants.OPERATION_TYPE]: OperationType.NEW,
    [MAPPING_NAME]: '',
    [FieldConstants.DESCRIPTION]: '',
    [FILE_SELECTOR]: null,
    [DIRECTORY_ITEM]: null,
};

export type NewMappingDialogForm = InferType<ReturnType<typeof getNewMappingDialogSchema>>;
