/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { CopyButton, DeleteButton } from '../1-atoms/buttons';
import { Grid, Paper, Typography } from '@mui/material';
import { styles } from './AutomatonStyle';
import ModelSelect from '../2-molecules/ModelSelect';
import { SetType } from '../../constants/models';
import AutomatonProperties from './automaton/AutomatonProperties';
import SetGroupSelect from '../2-molecules/SetGroupSelect';
import { mergeSx } from 'utils/functions';

const Automaton = (props) => {
    const {
        automaton,
        automatonDefinition = {},
        isAutomatonValid = true,
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
    // TODO intl
    const automatonLabel = 'Automaton of family';
    const deleteAutomatonLabel = 'Delete automaton';
    const copyAutomatonLabel = 'Copy automaton';

    const onChangeProperty = useCallback(
        (propertyName, propertyType) => (propertyValue) => {
            changeProperty({
                name: propertyName,
                value: propertyValue,
                type: propertyType,
            });
        },
        [changeProperty]
    );

    return (
        <Paper elevation={24} sx={mergeSx(styles.automatonPaper, !isAutomatonValid && styles.invalidAutomatonPaper)}>
            <Grid container>
                <Grid container item xs={12} md={4} paddingRight={1} direction={'column'} justifyContent={'flex-start'}>
                    <Grid container item justifyContent={'flex-start'}>
                        <Grid item xs sx={styles.titleLabel}>
                            <Typography variant="subtitle2">{`${automatonLabel} ${family}`}</Typography>
                        </Grid>
                        <Grid item xs={'auto'} paddingLeft={1}>
                            <DeleteButton onClick={deleteAutomaton} tooltip={deleteAutomatonLabel} />
                            <CopyButton onClick={copyAutomaton} tooltip={copyAutomatonLabel} />
                        </Grid>
                    </Grid>
                    <Grid item container sx={styles.automatonModel} direction="column" justifyContent={'flex-start'}>
                        <ModelSelect model={model} models={models} changeModel={changeModel} />
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
                    </Grid>
                </Grid>
                <Grid item container xs={12} md={8} direction="column" justifyContent={'flex-start'}>
                    <Grid item container justify={'flex-start'} marginBottom={2}>
                        <Grid item xs>
                            <Typography>{'Properties :'}</Typography>
                        </Grid>
                    </Grid>
                    <AutomatonProperties
                        automaton={automaton}
                        automatonDefinition={automatonDefinition}
                        networkPropertyValues={networkPropertyValues}
                        onChangeProperty={onChangeProperty}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

Automaton.propTypes = {
    automaton: PropTypes.object.isRequired,
    automatonDefinition: PropTypes.object.isRequired,
    isAutomatonValid: PropTypes.bool,
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
