/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useIntl } from 'react-intl';
import type { UUID } from 'node:crypto';
import { Grid2 as Grid, Stack } from '@mui/material';
import { useWatch } from 'react-hook-form';
import {
    DescriptionField,
    DIRECTORY_ITEM,
    DIRECTORY_ITEM_ID,
    DirectoryItemInput,
    DirectoryItemSchema,
    ElementType,
    FieldConstants,
    RadioInput,
    UniqueNameInput,
} from '@gridsuite/commons-ui';
import { FILE_SELECTOR, MAPPING_NAME } from './new-mapping-dialog-utils';
import FileInputSelector from '../../inputs/FileInputSelector';
import { usePrefilledName } from '../../hooks/usePrefilledName';
import { OperationType } from '../../../../../utils/types';

const ADD_MAPPING_OPTIONS = [
    { id: OperationType.NEW, label: 'emptyMapping' },
    { id: OperationType.IMPORT_FILE, label: 'importMappingFile' },
    { id: OperationType.IMPORT_EXPLORE, label: 'importMappingExplore' },
];

function NewMappingForm() {
    const intl = useIntl();
    const { autoFocus, setManualChanged } = usePrefilledName({
        inputName: MAPPING_NAME,
        selectorName: FILE_SELECTOR,
        prefilledNameProvider: (fileName: string) => {
            return Promise.resolve(fileName.replace(/\.json$/i, ''));
        },
    });

    const operationType = useWatch({ name: FieldConstants.OPERATION_TYPE });
    const folderItem = useWatch({ name: DIRECTORY_ITEM }) as DirectoryItemSchema;
    return (
        <Stack spacing={2} marginTop="auto">
            <RadioInput name={FieldConstants.OPERATION_TYPE} options={ADD_MAPPING_OPTIONS} />
            {(operationType === OperationType.NEW || operationType === OperationType.IMPORT_FILE) && (
                <UniqueNameInput
                    name={MAPPING_NAME}
                    label="nameProperty"
                    elementType={ElementType.DYNAMIC_MAPPING}
                    activeDirectory={folderItem?.[DIRECTORY_ITEM_ID] as UUID}
                    autoFocus={autoFocus}
                    onManualChangeCallback={() => setManualChanged(true)}
                />
            )}
            {operationType === OperationType.IMPORT_FILE && (
                <FileInputSelector name={FILE_SELECTOR} label="selectMapping" accept={'.json,application/json'} />
            )}
            {(operationType === OperationType.NEW || operationType === OperationType.IMPORT_FILE) && (
                <Grid>
                    <DescriptionField />
                </Grid>
            )}
            <DirectoryItemInput
                name={DIRECTORY_ITEM}
                types={[
                    operationType === OperationType.IMPORT_EXPLORE
                        ? ElementType.DYNAMIC_MAPPING
                        : ElementType.DIRECTORY,
                ]}
                multiSelect={false}
                onlyLeaves={false}
                title={intl.formatMessage({
                    id: 'showSelectDirectoryDialog',
                })}
            />
        </Stack>
    );
}
export default NewMappingForm;
