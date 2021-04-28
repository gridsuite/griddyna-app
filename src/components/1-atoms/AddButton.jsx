import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const AddButton = ({ onClick }) => (
    <IconButton onClick={onClick}>
        <AddCircleIcon />
    </IconButton>
);

AddButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default AddButton;
