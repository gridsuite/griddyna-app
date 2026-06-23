/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import {
    CustomMuiDialog,
    ElementAttributes,
    fetchDirectoryElementPath,
    isObjectEmpty,
    Nullable,
} from '@gridsuite/commons-ui';
import { FieldValues, useForm } from 'react-hook-form';
import { MAPPING_NAME } from '../new-mapping/new-mapping-dialog-utils';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    renameMappingDialogEmpty,
    RenameMappingDialogForm,
    renameMappingDialogSchema,
} from './rename-mapping-dialog-utils';
import { useEffect, useMemo, useState } from 'react';
import RenameMappingForm from './RenameMappingForm';

export type RenameMappingDialogProps = {
    onClose: () => void;
    open: boolean;
    onSubmit: (params: { id: UUID; newName: string }) => void;
    previousName: string;
    mappingId: UUID;
};

const RenameMappingDialog = ({
    onClose,
    open,
    onSubmit,
    previousName,
    mappingId,
}: Readonly<RenameMappingDialogProps>) => {
    const renameMappingDialogDefault = useMemo(
        () => ({
            ...renameMappingDialogEmpty,
            [MAPPING_NAME]: previousName,
        }),
        [previousName]
    );
    const formMethods = useForm<Nullable<RenameMappingDialogForm>>({
        defaultValues: renameMappingDialogDefault,
        resolver: yupResolver<Nullable<RenameMappingDialogForm>>(renameMappingDialogSchema),
    });
    const {
        formState: { errors, isValid },
    } = formMethods;

    const isFormValid = isObjectEmpty(errors) && isValid;

    const handleSubmit = (values: FieldValues) => {
        const name = values[MAPPING_NAME] as string;
        if (name) {
            onSubmit({ id: mappingId, newName: name });
        }
    };

    // fetch parent directory
    const [initialized, setInitialized] = useState(false);
    const [parentDirectory, setParentDirectory] = useState<UUID | undefined>();
    useEffect(() => {
        fetchDirectoryElementPath(mappingId).then((path: ElementAttributes[]) => {
            setParentDirectory(path[path.length - 2]?.elementUuid);
            setInitialized(true);
        });
    }, [mappingId]);

    return (
        <CustomMuiDialog
            titleId="renameMappingDialogTitle"
            formContext={{
                ...formMethods,
                validationSchema: renameMappingDialogSchema,
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
            {initialized && <RenameMappingForm parentDirectory={parentDirectory} />}
        </CustomMuiDialog>
    );
};

export default RenameMappingDialog;
