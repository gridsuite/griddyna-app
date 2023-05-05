/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid, Typography } from '@mui/material';
import Autocomplete from '../../1-atoms/Autocomplete';
import React from 'react';
import { useStyles } from './CurrentLimitAutomatonPropertiesStyle';

const CurrentLimitAutomatonProperties = ({
    isAutomatonValid = true,
    equipmentIds = [],
    watchedElement,
    onChangeWatchedElement = () => {},
    properties = [],
    onChangeProperty = () => {},
}) => {
    const watchedElementLabel = 'On equipment';
    const propertiesLabel = 'Additional properties';

    const classes = useStyles(isAutomatonValid);
    return (
        <>
            <Grid container justify={'flex-start'}>
                <Grid item xs="auto" className={classes.label}>
                    <Typography>{`${watchedElementLabel} :`}</Typography>
                </Grid>
                <Grid item xs="auto" className={classes.value}>
                    <Autocomplete
                        isFree={!(equipmentIds && equipmentIds.length > 0)}
                        value={watchedElement}
                        onChange={onChangeWatchedElement}
                        options={equipmentIds}
                        error={watchedElement === ''}
                    />
                </Grid>
            </Grid>
            {properties.length > 0 && (
                <Grid container justify={'flex-start'}>
                    <Grid item xs="auto" className={classes.label}>
                        <Typography>{`${propertiesLabel} :`}</Typography>
                    </Grid>
                </Grid>
            )}
            {properties.map((property) => {
                return (
                    <Grid container justify={'flex-start'} key={property.name}>
                        <Grid item xs={1} />
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

export default CurrentLimitAutomatonProperties;
