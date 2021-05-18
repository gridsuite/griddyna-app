import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

const NewButton = ({ onClick, className }) => (
    <Button
        variant="outlined"
        onClick={onClick}
        endIcon={<AddRoundedIcon />}
        className={className}
    >
        New
    </Button>
);

NewButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default NewButton;
