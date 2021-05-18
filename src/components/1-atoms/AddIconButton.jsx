import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const AddIconButton = ({ onClick }) => (
    <IconButton onClick={onClick}>
        <AddCircleIcon />
    </IconButton>
);

AddIconButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default AddIconButton;
