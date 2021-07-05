/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Select from '../1-atoms/Select';
import { DeleteButton, CopyButton } from '../1-atoms/buttons';
import { Grid, Paper, Typography } from '@material-ui/core';
import {
    getAutomatonFamiliesOptions,
    getModelsOptions,
} from '../../utils/optionsBuilders';
import Autocomplete from '../1-atoms/Autocomplete';
import { useStyles } from './AutomatonStyle';
import { getAutomatonProperty } from '../../utils/automata';

const Automaton = (props) => {
    const {
        automaton,
        isAutomatonValid = true,
        changeFamily,
        changeWatchedElement,
        changeModel,
        changeProperty,
        models,
        networkIds = [],
        deleteAutomaton,
        copyAutomaton,
    } = props;
    const { family, watchedElement, model, properties } = automaton;
    const classes = useStyles(isAutomatonValid);
    // TODO intl
    const automatonLabel = 'Automaton';
    const deleteAutomatonLabel = 'Delete automaton';
    const copyAutomatonLabel = 'Copy automaton';
    const familyLabel = 'Of Family';
    const watchedElementLabel = 'On equipment';
    const propertiesLabel = 'Additional properties';
    const modelLabel = 'Modelled by';

    const onChangeProperty = (propertyName) => (propertyValue) => {
        changeProperty({ name: propertyName, value: propertyValue });
    };

    return (
        <Paper elevation={0} className={classes.automatonPaper}>
            <Grid container justify={'space-between'}>
                <Grid item className={classes.titleLabel}>
                    <Typography variant="h4">{automatonLabel}</Typography>
                </Grid>
                <Grid item>
                    <DeleteButton
                        onClick={deleteAutomaton}
                        tooltip={deleteAutomatonLabel}
                    />
                    <CopyButton
                        onClick={copyAutomaton}
                        tooltip={copyAutomatonLabel}
                    />
                </Grid>
            </Grid>
            <Grid container justify={'flex-start'}>
                <Grid item xs="auto" className={classes.label}>
                    <Typography>{`${familyLabel} :`}</Typography>
                </Grid>
                <Grid item xs="auto" className={classes.select}>
                    <Select
                        options={getAutomatonFamiliesOptions()}
                        value={family}
                        setValue={changeFamily}
                        error={family === ''}
                    />
                </Grid>
            </Grid>
            <Grid container justify={'flex-start'}>
                <Grid item xs="auto" className={classes.label}>
                    <Typography>{`${watchedElementLabel} :`}</Typography>
                </Grid>
                <Grid item xs="auto" className={classes.value}>
                    <Autocomplete
                        isFree
                        value={watchedElement}
                        onChange={changeWatchedElement}
                        options={networkIds}
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
                const modelProperty = getAutomatonProperty(
                    family,
                    property.name
                );
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
            <Grid container justify={'flex-start'}>
                <Grid item xs="auto" className={classes.label}>
                    <Typography variant="h4">{`${modelLabel} :`}</Typography>
                </Grid>
                <Grid item xs="auto" className={classes.value}>
                    <Select
                        options={getModelsOptions(models)}
                        value={model}
                        setValue={changeModel}
                        error={model === ''}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

Automaton.propTypes = {
    automaton: PropTypes.object.isRequired,
    isAutomatonValid: PropTypes.bool,
    changeFamily: PropTypes.func.isRequired,
    changeWatchedElement: PropTypes.func.isRequired,
    changeModel: PropTypes.func.isRequired,
    changeProperty: PropTypes.func.isRequired,
    models: PropTypes.array.isRequired,
    networkIds: PropTypes.array,
    deleteAutomaton: PropTypes.func.isRequired,
    copyAutomaton: PropTypes.func.isRequired,
};

export default Automaton;
