import React from 'react';
import PropTypes from 'prop-types';
import { IconButton as MuiIconButton, Tooltip } from '@material-ui/core';

const IconButton = ({ onClick, icon, tooltip }) => {
    const button = <MuiIconButton onClick={onClick}>{icon}</MuiIconButton>;

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
