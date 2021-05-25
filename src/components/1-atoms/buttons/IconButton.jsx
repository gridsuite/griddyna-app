import React from 'react';
import PropTypes from 'prop-types';
import { IconButton as MuiIconButton } from '@material-ui/core';

const IconButton = ({ onClick, icon }) => (
    <MuiIconButton onClick={onClick}>{icon}</MuiIconButton>
);

IconButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.node.isRequired,
};

export default IconButton;
