/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Select from '../1-atoms/Select';
import {
    AddIconButton,
    ChangeButton,
    CopyButton,
    DeleteButton,
} from '../1-atoms/buttons';
import { Grid, Paper, TextField, Tooltip, Typography } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import { getEquipmentTypesOptions } from '../../utils/optionsBuilders';
import { useStyles } from './RuleStyle';
import ModelSelect from '../2-molecules/ModelSelect';

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
        deleteRule,
        copyRule,
        changeCompositionMode,
        isAdvancedMode,
        canUseBasicMode,
        unusedFilters = [],
        changeParameters = () => {},
        editGroup = () => {},
    } = props;
    const { type, composition, mappedModel, setGroup } = rule;
    const classes = useStyles(isRuleValid);
    // TODO intl
    const equipmentLabel = 'Each';
    const compositionLabel = 'If';
    const filterLabel = 'Where';
    const addFilterLabel = 'Add filter';
    const addFilterGroupLabel = 'Add filter group';
    const deleteRuleLabel = 'Delete rule';
    const copyRuleLabel = 'Copy Rule';
    const useBasicModeLabel = 'Use simple filters mode';
    const useAdvancedModeLabel = 'Use advanced filters mode';
    const unusedFiltersLabel = 'You have unused filter(s)';

    const onChangeComposition = (event) => {
        changeComposition(event.target.value);
    };
    return (
        <Paper elevation={0} className={classes.rulePaper}>
            <Grid container justify={'space-between'}>
                <Grid item>
                    <Grid container justify={'flex-start'}>
                        <Grid item>
                            <Typography variant="h4">
                                {equipmentLabel}
                            </Typography>
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
                        {unusedFilters.length > 0 && (
                            <Grid item className={classes.unused}>
                                <Tooltip
                                    title={`${unusedFiltersLabel}: ${unusedFilters.join(
                                        ', '
                                    )}`}
                                >
                                    <ErrorIcon />
                                </Tooltip>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid item>
                    {rule.filtersNumber > 1 && (
                        <ChangeButton
                            onClick={changeCompositionMode}
                            disabled={isAdvancedMode && !canUseBasicMode}
                            tooltip={
                                isAdvancedMode
                                    ? useBasicModeLabel
                                    : useAdvancedModeLabel
                            }
                        />
                    )}
                    <DeleteButton
                        onClick={deleteRule}
                        tooltip={deleteRuleLabel}
                    />
                    <CopyButton onClick={copyRule} tooltip={copyRuleLabel} />
                </Grid>
            </Grid>
            {rule.filtersNumber > 1 && isAdvancedMode && (
                <Grid container justify={'flex-start'}>
                    <Grid item xs={2} className={classes.label}>
                        <Typography>{`${compositionLabel} :`}</Typography>
                    </Grid>
                    <Grid item xs={8}>
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
                            tooltip={
                                isAdvancedMode
                                    ? addFilterLabel
                                    : addFilterGroupLabel
                            }
                        />
                    </Grid>
                </Grid>
            </Grid>
            {children}

            <ModelSelect
                model={mappedModel}
                setGroup={setGroup}
                models={models}
                changeModel={changeModel}
                changeGroup={changeParameters}
                editGroup={editGroup}
            />
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
    deleteRule: PropTypes.func.isRequired,
    copyRule: PropTypes.func.isRequired,
    changeCompositionMode: PropTypes.func.isRequired,
    isAdvancedMode: PropTypes.bool.isRequired,
    canUseBasicMode: PropTypes.bool.isRequired,
    unusedFilters: PropTypes.array,
    changeParameters: PropTypes.func.isRequired,
    editGroup: PropTypes.func.isRequired,
};

export default Rule;
