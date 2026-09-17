/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button, SxProps, Tooltip } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

type SaveButtonProps = {
    label: string;
    tooltip: string;
    disabled?: boolean | undefined;
    onClick: () => void;
    sx: SxProps;
};

const SaveButton = ({ label, onClick, sx, disabled, tooltip }: Readonly<SaveButtonProps>) => (
    <Tooltip title={tooltip}>
        <Button variant="contained" onClick={onClick} startIcon={<SaveOutlinedIcon />} sx={sx} disabled={disabled}>
            {label}
        </Button>
    </Tooltip>
);

export default SaveButton;
