import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    IconButton as MuiIconButton,
    Popover,
    Typography,
} from '@material-ui/core';

const IconButton = ({ onClick, icon, popOver }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return (
        <>
            <MuiIconButton
                onClick={onClick}
                onMouseEnter={popOver ? handlePopoverOpen : undefined}
                onMouseLeave={popOver ? handlePopoverClose : undefined}
            >
                {icon}
            </MuiIconButton>
            {popOver !== undefined && popOver !== '' && (
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    <Typography>{popOver}</Typography>
                </Popover>
            )}
        </>
    );
};

IconButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.node.isRequired,
    popOver: PropTypes.string,
};

export default IconButton;
