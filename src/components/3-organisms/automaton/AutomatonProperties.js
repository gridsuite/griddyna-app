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
import {
    getPossibleOptionsForProperty,
    getAutomatonPropertiesByModelThenGroup,
    UNKNOWN_GROUP,
} from '../../../utils/automata';

const AutomatonProperties = ({
    automaton,
    networkPropertyValues,
    onChangeProperty = () => {},
}) => {
    const classes = useStyles();

    const propertiesByGroup = getAutomatonPropertiesByModelThenGroup(
        automaton?.model
    );
    const groupNames = Object.keys(propertiesByGroup);

    return (
        <>
            {groupNames.map((groupName) => {
                const propertiesInGroup = propertiesByGroup[groupName];
                const propertyNames = Object.keys(propertiesInGroup);
                return (
                    <>
                        {groupName !== UNKNOWN_GROUP && (
                            <Grid container justify={'flex-start'}>
                                <Grid item xs="auto" className={classes.label}>
                                    <Typography>{`${groupName} :`}</Typography>
                                </Grid>
                            </Grid>
                        )}
                        {propertyNames.map((propertyName) => {
                            const propertyDefinition =
                                propertiesInGroup[propertyName];
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
                                <Grid
                                    container
                                    justify={'flex-start'}
                                    key={propertyName}
                                >
                                    <Grid
                                        item
                                        xs="auto"
                                        className={classes.label}
                                    >
                                        <Typography>{`${propertyDefinition.label} :`}</Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs="auto"
                                        className={classes.value}
                                    >
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
                                        />
                                    </Grid>
                                </Grid>
                            );
                        })}
                    </>
                );
            })}
        </>
    );
};

export default AutomatonProperties;
