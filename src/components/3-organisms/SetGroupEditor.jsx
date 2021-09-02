/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';
import { getSetTypesOptions } from '../../utils/optionsBuilders';
import PropTypes from 'prop-types';
import Select from '../1-atoms/Select';

// intl
const nameLabel = 'Name of the group';
const typeLabel = 'Type of the group';

const SetGroupEditor = (props) => {
    const { name, type, changeName, changeType, isError = false } = props;

    const onChange = (event) => changeName(event.target.value);

    return (
        <>
            <Grid container>
                <Grid item xs="auto">
                    <Typography> {`${nameLabel} :`}</Typography>
                </Grid>
                <Grid item xs="8">
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
            <Grid container>
                <Grid item xs="auto">
                    <Typography> {`${typeLabel} :`} </Typography>
                </Grid>
                <Grid item xs="8">
                    <Select
                        options={getSetTypesOptions()}
                        value={type}
                        setValue={changeType}
                    />
                </Grid>
            </Grid>
        </>
    );
};

SetGroupEditor.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    changeName: PropTypes.func.isRequired,
    changeType: PropTypes.func.isRequired,
    isError: PropTypes.bool,
};

export default SetGroupEditor;
