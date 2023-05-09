/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid, Typography } from '@mui/material';
import Autocomplete from '../../1-atoms/Autocomplete';
import React from 'react';
import { useStyles } from './AutomatonModelPropertiesStyle';
import { getPossibleOptionsModelProperty } from '../../../utils/automata';
import { AutomatonModelProperties as ModelPropertiesDefinitions } from '../../../constants/equipmentDefinition';

const AutomatonModelProperties = ({
    automaton,
    onChangeModelProperty = () => {},
    networkPropertyValues,
}) => {
    const classes = useStyles();
    const modelPropertyNames = Object.keys(
        ModelPropertiesDefinitions[automaton?.model] ?? {}
    );
    console.log('modelPropertyNames', [modelPropertyNames]);
    return (
        <>
            {modelPropertyNames.map((modelPropertyName) => {
                const modelProperty =
                    ModelPropertiesDefinitions[automaton?.model]?.[
                        modelPropertyName
                    ];
                const options = getPossibleOptionsModelProperty(
                    automaton?.model,
                    modelPropertyName,
                    modelProperty.networkProperty,
                    networkPropertyValues
                );

                const value = automaton[modelPropertyName];
                return (
                    <Grid container justify={'flex-start'}>
                        <Grid item xs="auto" className={classes.label}>
                            <Typography>{`${modelProperty.label} :`}</Typography>
                        </Grid>
                        <Grid item xs="auto" className={classes.value}>
                            <Autocomplete
                                isFree={!(options && options.length > 0)}
                                value={value}
                                onChange={onChangeModelProperty(
                                    modelPropertyName
                                )}
                                options={options}
                                error={value === ''}
                            />
                        </Grid>
                    </Grid>
                );
            })}
        </>
    );
};

export default AutomatonModelProperties;
