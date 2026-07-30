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
    getNewMappingDialogSchema,
    MAPPING_NAME,
    newMappingDialogEmpty,
    NewMappingDialogForm,
} from './new-mapping-dialog-utils';
import NewMappingForm from './NewMappingForm';
import { OperationType } from '../../../../../utils/types';
import { useEffect, useMemo } from 'react';

type NewMappingDialogProps = {
    onClose: () => void;
    open: boolean;
    onSubmit: (params: {
        operationType: OperationType;
        file: File;
        name: string;
        description: string;
        directoryInputUuid: UUID;
    }) => void;
    items: {
        id: UUID;
        name: string;
    }[];
};

function NewMappingDialog({ onClose, open, onSubmit, items }: NewMappingDialogProps) {
    const schema = useMemo(() => getNewMappingDialogSchema(items?.map((elem) => elem.id)), [items]);

    const formMethods = useForm<Nullable<NewMappingDialogForm>>({
        defaultValues: newMappingDialogEmpty,
        resolver: yupResolver<Nullable<NewMappingDialogForm>>(schema),
    });

    const {
        formState: { errors },
        subscribe,
        setValue,
    } = formMethods;
    const nameError = errors?.[MAPPING_NAME];
    const disabledSave = !isObjectEmpty(errors) || !!nameError;

    useEffect(() => {
        const unsubscribe = subscribe({
            name: [FieldConstants.OPERATION_TYPE],
            formState: {
                values: true, // Subscribe to field value changes
            },
            callback: () => {
                // When operation changes, reset the directory item
                setValue(DIRECTORY_ITEM, null);
            },
        });
        return () => unsubscribe();
    }, [setValue, subscribe]);

    const handleSubmit = (values: FieldValues) => {
        const operationType = values[FieldConstants.OPERATION_TYPE] as OperationType;
        const name = values[MAPPING_NAME] as string;
        const file = values[FILE_SELECTOR] as File;
        const description = (values[FieldConstants.DESCRIPTION] ?? '') as string;
        const directoryInputUuid = values[DIRECTORY_ITEM][DIRECTORY_ITEM_ID] as UUID;
        if (
            (operationType !== OperationType.IMPORT_EXPLORE && name) ||
            operationType === OperationType.IMPORT_EXPLORE
        ) {
            onSubmit({ operationType, file, name, description, directoryInputUuid });
        }
    };
    return (
        <CustomMuiDialog
            titleId="addMappingDialogTitle"
            formContext={{
                ...formMethods,
                validationSchema: schema,
                removeOptional: true,
            }}
            onClose={onClose}
            open={open}
            onSave={handleSubmit}
            disabledSave={disabledSave}
            sx={{
                '.MuiDialog-paper': {
                    minWidth: '40vw',
                },
            }}
        >
            <NewMappingForm />
        </CustomMuiDialog>
    );
}
export default NewMappingDialog;
