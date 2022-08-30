/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Select from '../1-atoms/Select';
import { CopyButton, DeleteButton } from '../1-atoms/buttons';
import { Grid, Paper, Typography } from '@mui/material';
import { getAutomatonFamiliesOptions } from '../../utils/optionsBuilders';
import Autocomplete from '../1-atoms/Autocomplete';
import { useStyles } from './AutomatonStyle';
import { getAutomatonProperty } from '../../utils/automata';
import ModelSelect from '../2-molecules/ModelSelect';
import { SetType } from '../../constants/models';

const Automaton = (props) => {
    const {
        automaton,
        isAutomatonValid = true,
        changeFamily,
        changeWatchedElement,
        changeModel,
        changeParameters,
        changeProperty,
        models,
        networkIds = [],
        deleteAutomaton,
        copyAutomaton,
        editGroup = () => {},
        controlledParameters = false,
    } = props;
    const { family, watchedElement, model, setGroup, properties } = automaton;
    const classes = useStyles(isAutomatonValid);
    // TODO intl
    const automatonLabel = 'Automaton';
    const deleteAutomatonLabel = 'Delete automaton';
    const copyAutomatonLabel = 'Copy automaton';
    const familyLabel = 'Of Family';
    const watchedElementLabel = 'On equipment';
    const propertiesLabel = 'Additional properties';

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
            <ModelSelect
                model={model}
                models={models}
                changeModel={changeModel}
                setGroup={setGroup}
                groupType={SetType.FIXED}
                changeGroup={changeParameters}
                editGroup={editGroup}
                controlledParameters={controlledParameters}
            />
        </Paper>
    );
};

Automaton.propTypes = {
    automaton: PropTypes.object.isRequired,
    isAutomatonValid: PropTypes.bool,
    changeFamily: PropTypes.func.isRequired,
    changeWatchedElement: PropTypes.func.isRequired,
    changeModel: PropTypes.func.isRequired,
    changeParameters: PropTypes.func.isRequired,
    changeProperty: PropTypes.func.isRequired,
    models: PropTypes.array.isRequired,
    networkIds: PropTypes.array,
    deleteAutomaton: PropTypes.func.isRequired,
    copyAutomaton: PropTypes.func.isRequired,
    editGroup: PropTypes.func.isRequired,
    controlledParameters: PropTypes.bool,
};

export default Automaton;
