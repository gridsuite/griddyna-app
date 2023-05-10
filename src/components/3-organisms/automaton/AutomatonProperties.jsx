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
import { getAutomatonAdditionalProperty } from '../../../utils/automata';

const propertiesLabel = 'Additional properties';

const AutomatonProperties = ({
    model,
    properties = [],
    onChangeProperty = () => {},
}) => {
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
                const additionalProperty = getAutomatonAdditionalProperty(
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
                                        additionalProperty?.values &&
                                        additionalProperty?.values?.length > 0
                                    )
                                }
                                isMultiple={additionalProperty.multiple}
                                value={property.value}
                                onChange={onChangeProperty(property.name)}
                                options={additionalProperty?.values}
                                type={
                                    additionalProperty?.type === 'number'
                                        ? 'number'
                                        : undefined
                                }
                                error={
                                    property.value === '' ||
                                    (Array.isArray(property.value) &&
                                        property.value.length === 0)
                                }
                                ignoreReset={
                                    !(
                                        additionalProperty?.values &&
                                        additionalProperty?.values?.length > 0
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
