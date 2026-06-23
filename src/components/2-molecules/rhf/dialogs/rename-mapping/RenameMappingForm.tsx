/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid2 as Grid } from '@mui/material';
import { ElementType, UniqueNameInput } from '@gridsuite/commons-ui';
import { MAPPING_NAME } from '../new-mapping/new-mapping-dialog-utils';
import { UUID } from 'node:crypto';

type RenameMappingFormProps = {
    parentDirectory?: UUID;
};
function RenameMappingForm({ parentDirectory }: Readonly<RenameMappingFormProps>) {
    return (
        <Grid container spacing={2} marginTop="auto" direction="column">
            <Grid>
                <UniqueNameInput
                    name={MAPPING_NAME}
                    label="nameProperty"
                    elementType={ElementType.DYNAMIC_MAPPING}
                    activeDirectory={parentDirectory}
                    autoFocus
                />
            </Grid>
        </Grid>
    );
}

export default RenameMappingForm;
