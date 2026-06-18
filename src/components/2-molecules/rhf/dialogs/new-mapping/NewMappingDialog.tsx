/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { CustomMuiDialog, FieldConstants, isObjectEmpty } from '@gridsuite/commons-ui';
import { FieldValues, useForm } from 'react-hook-form';
import { FILE_SELECTOR, MAPPING_NAME, newMappingDialogEmpty, newMappingDialogSchema } from './new-mapping-dialog-utils';
import { yupResolver } from '@hookform/resolvers/yup';
import NewMappingForm from './NewMappingForm';
import { OperationType } from '../../../../../utils/types';

type NewMappingDialogProps = {
    onClose: () => void;
    open: boolean;
    onSubmit: (params: { operationType: OperationType; file: File; name: string }) => void;
};

function NewMappingDialog({ onClose, open, onSubmit }: NewMappingDialogProps) {
    const formMethods = useForm({
        defaultValues: newMappingDialogEmpty,
        resolver: yupResolver(newMappingDialogSchema),
    });
    const {
        formState: { errors, isValid },
    } = formMethods;

    const isFormValid = isObjectEmpty(errors) && isValid;

    const handleSubmit = (values: FieldValues) => {
        const operationType = values[FieldConstants.OPERATION_TYPE] as OperationType;
        const mappingName = values[MAPPING_NAME] as string;
        const file = values[FILE_SELECTOR] as File;
        if (mappingName) {
            onSubmit({ operationType: operationType, file, name: mappingName });
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
