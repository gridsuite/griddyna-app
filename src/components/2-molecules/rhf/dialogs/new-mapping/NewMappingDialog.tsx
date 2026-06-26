/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import {
    CustomMuiDialog,
    DIRECTORY_ITEM,
    DIRECTORY_ITEM_ID,
    FieldConstants,
    isObjectEmpty,
    Nullable,
} from '@gridsuite/commons-ui';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    FILE_SELECTOR,
    MAPPING_NAME,
    newMappingDialogEmpty,
    NewMappingDialogForm,
    newMappingDialogSchema,
} from './new-mapping-dialog-utils';
import NewMappingForm from './NewMappingForm';
import { OperationType } from '../../../../../utils/types';

type NewMappingDialogProps = {
    onClose: () => void;
    open: boolean;
    onSubmit: (params: {
        operationType: OperationType;
        file: File;
        name: string;
        description: string;
        parentDirectoryUuid: UUID;
    }) => void;
};

function NewMappingDialog({ onClose, open, onSubmit }: NewMappingDialogProps) {
    const formMethods = useForm<Nullable<NewMappingDialogForm>>({
        defaultValues: newMappingDialogEmpty,
        resolver: yupResolver<Nullable<NewMappingDialogForm>>(newMappingDialogSchema),
    });
    const {
        formState: { errors, isValid },
    } = formMethods;

    const isFormValid = isObjectEmpty(errors) && isValid;

    const handleSubmit = (values: FieldValues) => {
        const operationType = values[FieldConstants.OPERATION_TYPE] as OperationType;
        const name = values[MAPPING_NAME] as string;
        const file = values[FILE_SELECTOR] as File;
        const description = (values[FieldConstants.DESCRIPTION] ?? '') as string;
        const parentDirectoryUuid = values[DIRECTORY_ITEM][DIRECTORY_ITEM_ID] as UUID;
        if (name) {
            onSubmit({ operationType, file, name, description, parentDirectoryUuid });
        }
    };
    return (
        <CustomMuiDialog
            titleId="addMappingDialogTitle"
            formContext={{
                ...formMethods,
                validationSchema: newMappingDialogSchema,
                removeOptional: true,
            }}
            onClose={onClose}
            open={open}
            onSave={handleSubmit}
            disabledSave={!isFormValid}
            sx={{
                '.MuiDialog-paper': {
                    minWidth: '20vw',
                },
            }}
        >
            <NewMappingForm />
        </CustomMuiDialog>
    );
}
export default NewMappingDialog;
