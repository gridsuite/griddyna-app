/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import PropTypes from 'prop-types';

const RenameDialog = (props) => {
    const { open, handleClose, handleConfirm, previousName } = props;
    const [name, setName] = useState(previousName);

    const onChange = (event) => {
        setName(event.target.value);
    };

    const onKeyPress = (event) => {
        if (event.key === 'Enter') {
            onConfirm();
        }
    };
    const onConfirm = () => {
        handleConfirm(name);
        handleClose();
    };
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Rename</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    fullWidth
                    value={name}
                    onKeyPress={onKeyPress}
                    onChange={onChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="primary">
                    Rename
                </Button>
            </DialogActions>
        </Dialog>
    );
};

RenameDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    previousName: PropTypes.string.isRequired,
};

export default RenameDialog;
