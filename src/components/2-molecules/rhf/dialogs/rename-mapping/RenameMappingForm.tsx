/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid2 as Grid, Stack } from '@mui/material';
import type { UUID } from 'node:crypto';
import { ElementType, UniqueNameInput } from '@gridsuite/commons-ui';
import { MAPPING_NAME } from '../new-mapping/new-mapping-dialog-utils';

type RenameMappingFormProps = {
    parentDirectory?: UUID;
};
function RenameMappingForm({ parentDirectory }: Readonly<RenameMappingFormProps>) {
    return (
        <Stack spacing={2} marginTop="auto">
            <Grid>
                <UniqueNameInput
                    name={MAPPING_NAME}
                    label="nameProperty"
                    elementType={ElementType.DYNAMIC_MAPPING}
                    activeDirectory={parentDirectory}
                    autoFocus
                />
            </Grid>
        </Stack>
    );
}

export default RenameMappingForm;
