import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';

const ContextMenu = (props) => {
    const { anchorEl, open, onClose, options } = props;
    return (
        <Menu anchorEl={anchorEl} keepMounted open={open} onClose={onClose}>
            {options.map((option) => (
                <MenuItem
                    key={option.label}
                    onClick={() => {
                        option.action();
                        onClose();
                    }}
                >
                    {option.label}
                </MenuItem>
            ))}
        </Menu>
    );
};

export default ContextMenu;

ContextMenu.propTypes = {
    anchorEl: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
};
