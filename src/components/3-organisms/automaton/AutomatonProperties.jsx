/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid, Typography } from '@mui/material';
import Autocomplete from '../../1-atoms/Autocomplete';
import React from 'react';
import { useStyles } from './AutomatonPropertiesStyle';
import { getAutomatonProperty } from '../../../utils/automata';

const propertiesLabel = 'Additional properties';

const AutomatonProperties = ({
    model,
    properties = [],
    onChangeProperty = () => {},
}) => {
    console.log('automaton properties', properties);
    const classes = useStyles();
    return (
        <>
            {properties.length > 0 && (
                <Grid container justify={'flex-start'}>
                    <Grid item xs="auto" className={classes.label}>
                        <Typography>{`${propertiesLabel} :`}</Typography>
                    </Grid>
                </Grid>
            )}
            {properties.map((property) => {
                const modelProperty = getAutomatonProperty(
                    model,
                    property.name
                );
                return (
                    <Grid container justify={'flex-start'} key={property.name}>
                        <Grid item xs="auto" className={classes.label}>
                            <Typography>{`${property.name} :`}</Typography>
                        </Grid>
                        <Grid item xs="auto" className={classes.value}>
                            <Autocomplete
                                isFree={
                                    !(
                                        modelProperty?.values &&
                                        modelProperty?.values?.length > 0
                                    )
                                }
                                value={property.value}
                                onChange={onChangeProperty(property.name)}
                                options={modelProperty?.values}
                                type={
                                    modelProperty?.type === 'number'
                                        ? 'number'
                                        : undefined
                                }
                                error={property.value === ''}
                                ignoreReset={
                                    !(
                                        modelProperty?.values &&
                                        modelProperty?.values?.length > 0
                                    )
                                }
                            />
                        </Grid>
                    </Grid>
                );
            })}
        </>
    );
};

export default AutomatonProperties;
