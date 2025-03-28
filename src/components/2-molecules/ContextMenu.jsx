/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Menu, MenuItem } from '@mui/material';
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
