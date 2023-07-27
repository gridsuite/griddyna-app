/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback } from 'react';
import { Divider, Grid, Paper, Typography } from '@mui/material';
import Autocomplete from '../../1-atoms/Autocomplete';
import { useStyles } from './AutomatonPropertiesStyle';
import { getPossibleOptionsForProperty } from '../../../utils/automata';
import * as _ from 'lodash';
import { Automaton } from '../../../redux/types/mapping.type';
import {
    AutomationDefinition,
    PropertyMappingDefinition,
} from '../../../redux/types/model.type';
import { EquipmentValues } from '../../../redux/types/network.type';

export interface AutomatonPropertiesProps {
    automaton: Automaton;
    automatonDefinition: AutomationDefinition;
    networkPropertyValues: EquipmentValues[];
    onChangeProperty: (
        propertyName: string,
        propertyType?: string
    ) => (propertyValue: string) => void;
}

const AutomatonProperties = ({
    automaton,
    automatonDefinition,
    networkPropertyValues,
    onChangeProperty,
}: AutomatonPropertiesProps) => {
    const classes = useStyles();

    const propertyNames = Object.keys(automatonDefinition);

    const handleChangeProperty = useCallback(
        (propertyName: string, propertyType?: string) =>
            (propertyValue: string) => {
                onChangeProperty(
                    propertyName,
                    propertyType
                )(
                    // convert an array to a string content with ',' delimiter
                    _.isArray(propertyValue)
                        ? _.join(propertyValue, ', ')
                        : propertyValue
                );
            },
        [onChangeProperty]
    );
    return (
        propertyNames?.length > 0 && (
            <Paper className={classes.group}>
                {propertyNames.map((propertyName, index) => {
                    const propertyDefinition =
                        automatonDefinition[propertyName];
                    const property = automaton.properties.find(
                        (elem) => elem.name === propertyName
                    );

                    // convert a string content with ',' delimiter to an array
                    const propertyValue = propertyDefinition.multiple
                        ? _.split(property?.value, ', ')
                        : property?.value ?? '';

                    const options =
                        propertyDefinition?.values ??
                        (propertyDefinition?.mapping &&
                            getPossibleOptionsForProperty(
                                propertyDefinition?.mapping as PropertyMappingDefinition,
                                networkPropertyValues
                            )) ??
                        [];

                    return (
                        <Grid container key={propertyName}>
                            <Grid
                                container
                                item
                                justifyContent={'flex-start'}
                                xs={6}
                            >
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
                                            onChange={handleChangeProperty(
                                                propertyName,
                                                propertyDefinition?.type
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

export default AutomatonProperties;
