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
import { useStyles } from './AutomatonStyle';
import ModelSelect from '../2-molecules/ModelSelect';
import { SetType } from '../../constants/models';
import AutomatonProperties from './automaton/AutomatonProperties';
import SetGroupSelect from '../2-molecules/SetGroupSelect';

const Automaton = (props) => {
    const {
        automaton,
        isAutomatonValid = true,
        changeFamily,
        changeModel,
        changeParameters,
        changeProperty,
        models,
        networkPropertyValues = [],
        deleteAutomaton,
        copyAutomaton,
        editGroup = () => {},
        controlledParameters = false,
        isNetworkAttached = false,
    } = props;
    const { family, model, setGroup } = automaton;
    const classes = useStyles(isAutomatonValid);
    // TODO intl
    const automatonLabel = 'Automaton';
    const deleteAutomatonLabel = 'Delete automaton';
    const copyAutomatonLabel = 'Copy automaton';
    const familyLabel = 'Of Family';

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
                <Grid item xs={2} className={classes.label}>
                    <Typography>{`${familyLabel} :`}</Typography>
                </Grid>
                <Grid item xs={4} className={classes.select}>
                    <Select
                        options={getAutomatonFamiliesOptions()}
                        value={family}
                        setValue={changeFamily}
                        error={family === ''}
                    />
                </Grid>
                <Grid item xs></Grid>
            </Grid>
            <ModelSelect
                model={model}
                models={models}
                changeModel={changeModel}
            />
            <AutomatonProperties
                automaton={automaton}
                networkPropertyValues={networkPropertyValues}
                onChangeProperty={onChangeProperty}
            />
            <SetGroupSelect
                model={model}
                models={models}
                setGroup={setGroup}
                groupType={SetType.FIXED}
                changeGroup={changeParameters}
                editGroup={editGroup}
                controlledParameters={controlledParameters}
                isNetworkAttached={isNetworkAttached}
            />
        </Paper>
    );
};

Automaton.propTypes = {
    automaton: PropTypes.object.isRequired,
    isAutomatonValid: PropTypes.bool,
    changeFamily: PropTypes.func.isRequired,
    changeModel: PropTypes.func.isRequired,
    changeParameters: PropTypes.func.isRequired,
    changeProperty: PropTypes.func.isRequired,
    models: PropTypes.array.isRequired,
    networkPropertyValues: PropTypes.array,
    deleteAutomaton: PropTypes.func.isRequired,
    copyAutomaton: PropTypes.func.isRequired,
    editGroup: PropTypes.func.isRequired,
    controlledParameters: PropTypes.bool,
    isNetworkAttached: PropTypes.bool,
};

export default Automaton;
