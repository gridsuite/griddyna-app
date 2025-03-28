/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Select from '../1-atoms/Select';
import { SetType } from '../../constants/models';

// intl
const nameLabel = 'Name of the group';
const typeLabel = 'Type of the group';

const SetGroupEditor = (props) => {
    const { name, type, changeName, changeType, isError = false, isAbsolute } = props;

    const onChange = (event) => changeName(event.target.value);

    return (
        <>
            <Grid container>
                <Grid item xs>
                    <Typography> {`${nameLabel} :`}</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="groupName"
                        label="Name"
                        fullWidth
                        value={name}
                        onChange={onChange}
                        error={isError}
                    />
                </Grid>
            </Grid>
            {!isAbsolute && (
                <Grid container>
                    <Grid item xs>
                        <Typography> {`${typeLabel} :`} </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Select
                            options={[
                                {
                                    value: SetType.PREFIX,
                                    label: SetType.PREFIX,
                                },
                                {
                                    value: SetType.SUFFIX,
                                    label: SetType.SUFFIX,
                                },
                            ]}
                            value={type}
                            setValue={changeType}
                            disabled={name === ''}
                        />
                    </Grid>
                </Grid>
            )}
        </>
    );
};

SetGroupEditor.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    changeName: PropTypes.func.isRequired,
    changeType: PropTypes.func.isRequired,
    isError: PropTypes.bool,
    isAbsolute: PropTypes.bool.isRequired,
};

export default SetGroupEditor;
