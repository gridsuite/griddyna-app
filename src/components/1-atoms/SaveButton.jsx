import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';

const AddButton = ({ onClick }) => (
    <IconButton onClick={onClick}>
        <SaveOutlinedIcon />
    </IconButton>
);

AddButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default AddButton;
