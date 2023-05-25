/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Grid, Paper, Typography } from '@mui/material';
import Autocomplete from '../../1-atoms/Autocomplete';
import { useStyles } from './AutomatonPropertiesStyle';
import {
    getAutomatonPropertiesByModel,
    getPossibleOptionsForProperty,
} from '../../../utils/automata';

const AutomatonProperties = ({
    automaton,
    networkPropertyValues,
    onChangeProperty = () => {},
}) => {
    const classes = useStyles();

    const automatonProperties =
        getAutomatonPropertiesByModel(automaton?.model) ?? {};
    const propertyNames = Object.keys(automatonProperties);

    return (
        propertyNames?.length > 0 && (
            <Paper className={classes.group}>
                {propertyNames.map((propertyName, index) => {
                    const propertyDefinition =
                        automatonProperties[propertyName];
                    const propertyValue = automaton[propertyName];
                    const options =
                        propertyDefinition?.values ??
                        (propertyDefinition?.mapping &&
                            getPossibleOptionsForProperty(
                                propertyDefinition?.mapping,
                                networkPropertyValues
                            )) ??
                        [];

                    return (
                        <Grid container key={propertyName}>
                            <Grid container item justify={'flex-start'} xs={6}>
                                <Grid container>
                                    <Grid item xs={4} className={classes.label}>
                                        <Typography>{`${propertyDefinition.label} :`}</Typography>
                                    </Grid>
                                    <Grid item xs={8} className={classes.value}>
                                        <Autocomplete
                                            isFree={
                                                !(options && options.length > 0)
                                            }
                                            isMultiple={
                                                propertyDefinition.multiple
                                            }
                                            value={
                                                propertyValue ??
                                                (propertyDefinition.multiple
                                                    ? []
                                                    : propertyValue)
                                            }
                                            onChange={onChangeProperty(
                                                propertyName
                                            )}
                                            options={options}
                                            type={
                                                propertyDefinition?.type ===
                                                'number'
                                                    ? 'number'
                                                    : undefined
                                            }
                                            error={
                                                propertyValue === '' ||
                                                (Array.isArray(propertyValue) &&
                                                    propertyValue.length === 0)
                                            }
                                            ignoreReset={
                                                !(options && options.length > 0)
                                            }
                                            fixedWidth
                                        />
                                    </Grid>
                                </Grid>
                                {index !== propertyNames.length - 1 && (
                                    <Grid
                                        item
                                        xs={12}
                                        sx={{ paddingRight: '8px' }}
                                    >
                                        <Divider />
                                    </Grid>
                                )}
                            </Grid>
                            <Grid item xs></Grid>
                        </Grid>
                    );
                })}
            </Paper>
        )
    );
};

AutomatonProperties.propTypes = {
    automaton: PropTypes.object,
    networkPropertyValues: PropTypes.array,
    onChangeProperty: PropTypes.func,
};

export default AutomatonProperties;
