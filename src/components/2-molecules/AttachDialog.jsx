/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { Divider, Grid, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useStyles } from './AttachDialogStyles';
import Autocomplete from '../1-atoms/Autocomplete';

const AttachDialog = (props) => {
    const { open, handleClose, attachWithFile, networks, attachWithId } = props;
    const [file, setFile] = useState(null);
    const [networkId, setNetworkId] = useState('');
    const classes = useStyles();

    const onChangeFile = (event) => {
        setFile(event.target.files[0]);
    };

    const onAttach = (type) => {
        if (type === 'file') {
            attachWithFile(file);
        } else {
            attachWithId(networkId);
        }
        closeDialog();
    };

    const closeDialog = () => {
        handleClose();
        setFile(null);
        setNetworkId('');
    };

    return (
        <Dialog
            open={open}
            onClose={closeDialog}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Attach a Network</DialogTitle>
            <Divider />
            <DialogContent>
                {attachWithId && networks.length > 0 && (
                    <Box>
                        <Typography>Attach a known network :</Typography>
                        <Grid container className={classes.margins}>
                            <Grid item xs={10}>
                                <Autocomplete
                                    options={networks.map((network) => ({
                                        label: network.networkName,
                                        value: network.networkId,
                                    }))}
                                    value={networkId}
                                    onChange={setNetworkId}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    onClick={() => onAttach('id')}
                                    className={classes.idVerticalAlign}
                                    disabled={networkId === ''}
                                >
                                    Attach
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                )}
                {attachWithFile && (
                    <Box>
                        <Typography>
                            Attach a new network using the iidm:
                        </Typography>
                        <Grid container className={classes.margins}>
                            <Grid item xs={10}>
                                <input
                                    type="file"
                                    name="file"
                                    onChange={(e) => onChangeFile(e)}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    onClick={() => onAttach('file')}
                                    disabled={file === null}
                                >
                                    Attach
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={closeDialog} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AttachDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    networks: PropTypes.array.isRequired,
    handleClose: PropTypes.func.isRequired,
    attachWithFile: PropTypes.func,
    attachWithId: PropTypes.func,
};

export default AttachDialog;
