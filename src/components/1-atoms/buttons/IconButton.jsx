/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import PropTypes from 'prop-types';
import { IconButton as MuiIconButton, Tooltip } from '@mui/material';

const IconButton = ({ onClick, icon, tooltip, disabled, ...styleProps }) => {
    const button = (
        <MuiIconButton onClick={onClick} disabled={disabled} {...styleProps}>
            {icon}
        </MuiIconButton>
    );

    if (tooltip) {
        return <Tooltip title={tooltip}>{button}</Tooltip>;
    }
    return button;
};

IconButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.node.isRequired,
    tooltip: PropTypes.string,
};

export default IconButton;
