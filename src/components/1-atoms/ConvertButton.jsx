import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';

const AddButton = ({ onClick }) => (
    <IconButton onClick={onClick}>
        <PublishOutlinedIcon />
    </IconButton>
);

AddButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default AddButton;
