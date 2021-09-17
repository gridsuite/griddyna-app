/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ParameterOrigin, ParameterType } from '../../constants/models';
import { Box, Grid, TextField, Tooltip, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import * as _ from 'lodash';
import { isParameterValueValid } from '../../utils/parameters';

const infoTypeLabel = 'This parameter is of type ';
const networkLabel = ' From Network';
const SetEditor = (props) => {
    const { definitions, set, saveSet } = props;
    const valueOrigin = (origin) => {
        switch (origin) {
            case ParameterOrigin.USER:
                return -1;
            case ParameterOrigin.FIXED:
                return 0;
            case ParameterOrigin.NETWORK:
                return 1;
            default:
                return 10;
        }
    };
    const onChange = (event) => {
        const parameterChanged = event.target.id;
        const newValue = event.target.value;
        const newValueToUse =
            definitions.find(
                (definition) => definition.name === parameterChanged
            ).type === ParameterType.BOOL
                ? newValue.replace(',', '.')
                : newValue;
        const updatedSet = _.cloneDeep(set);
        updatedSet.parameters.find(
            (parameter) => parameter.name === parameterChanged
        ).value = newValueToUse;
        saveSet(updatedSet);
    };

    return (
        <Box>
            <Typography variant="h2"> {set.name}</Typography>
            {_.cloneDeep(definitions)
                .sort((a, b) => valueOrigin(a.origin) - valueOrigin(b.origin))
                .map((definition) => {
                    const correspondingParameter = set.parameters.find(
                        (param) => param.name === definition.name
                    );
                    return (
                        <Grid container justify="space-evenly">
                            <Grid item xs={5}>
                                <Typography>{definition.name}</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    id={definition.name}
                                    value={
                                        definition.origin ===
                                        ParameterOrigin.NETWORK
                                            ? networkLabel
                                            : correspondingParameter?.value
                                    }
                                    error={
                                        definition.origin ===
                                            ParameterOrigin.USER &&
                                        !isParameterValueValid(
                                            correspondingParameter?.value,
                                            definition.type
                                        )
                                    }
                                    onChange={onChange}
                                    disabled={
                                        definition.origin !==
                                        ParameterOrigin.USER
                                    }
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <Tooltip
                                    title={infoTypeLabel + definition.type}
                                >
                                    <InfoIcon />
                                </Tooltip>
                            </Grid>
                        </Grid>
                    );
                })}
        </Box>
    );
};

SetEditor.propTypes = {
    set: PropTypes.object.isRequired,
    definitions: PropTypes.array.isRequired,
    saveSet: PropTypes.func.isRequired,
};

export default SetEditor;
