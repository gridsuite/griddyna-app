/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button, SxProps, Tooltip } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { ReactNode } from 'react';

type SaveButtonProps = {
    label: string;
    tooltip: string;
    disabled?: boolean;
    onClick: () => void;
    startIcon?: ReactNode;
    sx: SxProps;
};

const SaveButton = ({ label, onClick, sx, disabled, tooltip, startIcon }: Readonly<SaveButtonProps>) => (
    <Tooltip title={tooltip}>
        <Button
            variant="contained"
            onClick={onClick}
            startIcon={startIcon ?? <SaveOutlinedIcon />}
            sx={sx}
            disabled={disabled}
        >
            {label}
        </Button>
    </Tooltip>
);

export default SaveButton;
