/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid2 as Grid,
    Stack,
    Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { styles } from './AttachDialogStyles';
import { ElementType } from '@gridsuite/commons-ui';
import { useIntl } from 'react-intl';
import DirectoryItemSelect from './directory-item-select/DirectoryItemSelect.tsx';
import DeletableAutocomplete from '../1-atoms/deletable-autocomplete/DeletableAutocomplete.tsx';

const AttachDialog = (props) => {
    const intl = useIntl();
    const { open, handleClose, studies, attachKnownStudy, attachNewStudy, deleteKnownStudy } = props;
    const [newStudyId, setNewStudyId] = useState();
    const [knownStudyId, setKnownStudyId] = useState();

    const handleAttachKnownStudy = () => {
        attachKnownStudy(knownStudyId);
        closeDialog();
    };

    const handleAttachNewStudy = () => {
        attachNewStudy(newStudyId);
        closeDialog();
    };

    const closeDialog = () => {
        handleClose();
        setNewStudyId(null);
        setKnownStudyId(null);
    };

    return (
        <Dialog
            open={open}
            onClose={closeDialog}
            aria-labelledby="form-dialog-title"
            sx={{
                '.MuiDialog-paper': {
                    minWidth: '600px',
                },
            }}
        >
            <DialogTitle id="form-dialog-title">{intl.formatMessage({ id: 'attachStudyDialogTitle' })}</DialogTitle>
            <DialogContent>
                <Stack>
                    {studies.length >= 0 && (
                        <Stack sx={styles.attachKnownStudy}>
                            <Typography>{intl.formatMessage({ id: 'attachKnownStudy' })}</Typography>
                            <Grid container paddingY={2}>
                                <Grid size={10}>
                                    <DeletableAutocomplete
                                        options={studies.map((study) => ({
                                            value: study.studyId,
                                            label: study.studyName,
                                        }))}
                                        value={knownStudyId}
                                        onChange={setKnownStudyId}
                                        onDelete={(value) => {
                                            deleteKnownStudy(value);
                                        }}
                                        inputPlaceholderTextId="selectStudy"
                                    />
                                </Grid>
                                <Grid size={2}>
                                    <Button
                                        onClick={handleAttachKnownStudy}
                                        sx={styles.attachKnownButton}
                                        disabled={!knownStudyId}
                                        variant="outlined"
                                    >
                                        {intl.formatMessage({ id: 'attach' })}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Stack>
                    )}
                    <Divider />
                    {
                        <Stack sx={styles.attachNewStudy}>
                            <Typography>{intl.formatMessage({ id: 'attachNewStudy' })}</Typography>
                            <Grid container paddingY={1}>
                                <Grid size={10}>
                                    <DirectoryItemSelect
                                        types={[ElementType.STUDY]}
                                        onItemSelect={setNewStudyId}
                                        dialogTitleTextId="selectStudyDialogTitle"
                                        noSelectedItemTextId="noSelectedStudyText"
                                    />
                                </Grid>
                                <Grid size={2}>
                                    <Button
                                        onClick={handleAttachNewStudy}
                                        disabled={!newStudyId}
                                        variant="outlined"
                                        sx={styles.attachNewButton}
                                    >
                                        {intl.formatMessage({ id: 'attach' })}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Stack>
                    }
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="primary">
                    {intl.formatMessage({ id: 'cancel' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AttachDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    studies: PropTypes.array.isRequired,
    handleClose: PropTypes.func.isRequired,
    attachKnownStudy: PropTypes.func,
    attachNewStudy: PropTypes.func,
    deleteKnownStudy: PropTypes.func,
};

export default AttachDialog;
