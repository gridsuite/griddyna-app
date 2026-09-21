/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button, SxProps, Tooltip } from '@mui/material';

type AttachButtonProps = {
    label: string;
    tooltip: string;
    disabled?: boolean;
    onClick: () => void;
    variant?: 'contained';
    sx: SxProps;
};

const AttachButton = ({ label, onClick, variant, sx, disabled, tooltip }: Readonly<AttachButtonProps>) => (
    <Tooltip title={tooltip}>
        <Button variant={variant} onClick={onClick} sx={sx} disabled={disabled}>
            {label}
        </Button>
    </Tooltip>
);

export default AttachButton;
