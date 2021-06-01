/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Select from '../1-atoms/Select';
import { AddIconButton } from '../1-atoms/buttons';
import { Grid, Paper, TextField, Typography } from '@material-ui/core';
import {
    getEquipmentTypesOptions,
    getModelsOptions,
} from '../../utils/optionsBuilders';
import { useStyles } from './RuleStyle';

const Rule = (props) => {
    const {
        rule,
        isRuleValid = true,
        changeType,
        changeComposition,
        changeModel,
        addFilter,
        models,
        children,
    } = props;
    const { type, composition, mappedModel } = rule;
    const classes = useStyles(isRuleValid);
    // TODO intl
    const equipmentLabel = 'Each';
    const compositionLabel = 'If';
    const filterLabel = 'Where';
    const modelLabel = 'should be mapped to';
    const addFilterLabel = 'Add filter';

    const onChangeComposition = (event) => {
        changeComposition(event.target.value);
    };
    return (
        <Paper elevation={0} className={classes.rulePaper}>
            <Grid container justify={'flex-start'}>
                <Grid item>
                    <Typography variant="h4">{equipmentLabel}</Typography>
                </Grid>
                <Grid item className={classes.titleSelect}>
                    <Select
                        options={getEquipmentTypesOptions()}
                        value={type}
                        setValue={changeType}
                        error={type === ''}
                    />
                </Grid>
                <Grid item>
                    <Typography variant="h4">:</Typography>
                </Grid>
            </Grid>
            {rule.filtersNumber > 1 && (
                <Grid container justify={'flex-start'}>
                    <Grid item xs={2} className={classes.label}>
                        <Typography>{`${compositionLabel} :`}</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <TextField
                            fullWidth
                            onChange={onChangeComposition}
                            value={composition}
                            error={composition === ''}
                        />
                    </Grid>
                </Grid>
            )}

            <Grid container justify={'space-between'}>
                <Grid item xs={3} className={classes.filterLabel}>
                    <Typography>{`${filterLabel} :`}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Grid container justify="center">
                        <AddIconButton
                            onClick={addFilter}
                            tooltip={addFilterLabel}
                        />
                    </Grid>
                </Grid>
            </Grid>
            {children}
            <Grid container justify={'center'}>
                <Grid item xs="auto">
                    <Typography variant="h4">{`${modelLabel} :`}</Typography>
                </Grid>
                <Grid item xs="auto" className={classes.titleSelect}>
                    <Select
                        options={getModelsOptions(models)}
                        value={mappedModel}
                        setValue={changeModel}
                        error={mappedModel === ''}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};
Rule.propTypes = {
    rule: PropTypes.object.isRequired,
    isRuleValid: PropTypes.bool,
    changeType: PropTypes.func.isRequired,
    changeComposition: PropTypes.func.isRequired,
    changeModel: PropTypes.func.isRequired,
    addFilter: PropTypes.func.isRequired,
    models: PropTypes.array.isRequired,
};

export default Rule;
