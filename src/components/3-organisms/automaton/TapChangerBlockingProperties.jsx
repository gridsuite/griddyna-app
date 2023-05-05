/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid, Typography } from '@mui/material';
import Autocomplete from '../../1-atoms/Autocomplete';
import React from 'react';
import { useStyles } from './TapChangerBlockingPropertiesStyle';

const TapChangerBlockingProperties = ({
    isAutomatonValid = true,
    properties = [],
    onChangeProperty = () => {},
}) => {
    console.log('properties', properties);
    const classes = useStyles(isAutomatonValid);
    return (
        <>
            {properties.map((property) => {
                return (
                    <Grid container justify={'flex-start'} key={property.name}>
                        <Grid item xs="auto" className={classes.label}>
                            <Typography>{`${property.name} :`}</Typography>
                        </Grid>
                        <Grid item xs="auto" className={classes.value}>
                            <Autocomplete
                                isFree={
                                    !(
                                        property?.values &&
                                        property?.values?.length > 0
                                    )
                                }
                                value={property.value}
                                onChange={onChangeProperty(property.name)}
                                options={property?.values}
                                type={
                                    property?.type === 'number'
                                        ? 'number'
                                        : undefined
                                }
                                error={property.value === ''}
                                ignoreReset={
                                    !(
                                        property?.values &&
                                        property?.values?.length > 0
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

export default TapChangerBlockingProperties;
