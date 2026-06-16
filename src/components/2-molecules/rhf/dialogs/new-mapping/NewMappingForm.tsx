/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid2 as Grid } from '@mui/material';
import { ElementType, FieldConstants, RadioInput, UniqueNameInput } from '@gridsuite/commons-ui';
import { FILE_SELECTOR, MAPPING_NAME } from './new-mapping-dialog-utils';
import FileInputSelector from '../../inputs/FileInputSelector';
import { usePrefilledName } from '../../hooks/usePrefilledName';
import { useWatch } from 'react-hook-form';
import { OperationType } from '../../../../../utils/types';

const ADD_MAPPING_OPTIONS = [
    { id: OperationType.NEW, label: 'emptyMapping' },
    { id: OperationType.IMPORT, label: 'addMapping' },
];

function NewMappingForm() {
    const { autoFocus, setManualChanged } = usePrefilledName({
        inputName: MAPPING_NAME,
        selectorName: FILE_SELECTOR,
        prefilledNameProvider: (fileName: string) => {
            return Promise.resolve(fileName.replace(/\.json$/i, ''));
        },
    });

    const operationType = useWatch({ name: FieldConstants.OPERATION_TYPE });

    return (
        <>
            <Grid container spacing={2} marginTop="auto" direction="column">
                <Grid>
                    <RadioInput name={FieldConstants.OPERATION_TYPE} options={ADD_MAPPING_OPTIONS} />
                </Grid>
                <Grid>
                    <UniqueNameInput
                        name={MAPPING_NAME}
                        label="nameProperty"
                        elementType={ElementType.DYNAMIC_SIMULATION_MAPPING}
                        autoFocus={autoFocus}
                        onManualChangeCallback={() => setManualChanged(true)}
                    />
                </Grid>
            </Grid>
            {operationType === OperationType.IMPORT && (
                <FileInputSelector name={FILE_SELECTOR} label="selectMapping" accept={'.json,application/json'} />
            )}
        </>
    );
}
export default NewMappingForm;
