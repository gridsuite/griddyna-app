/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { AddIconButton, CopyButton, DeleteButton } from '../1-atoms/buttons';
import { Grid, Paper, Tooltip, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { styles } from './RuleStyle';
import ModelSelect from '../2-molecules/ModelSelect';
import SetGroupSelect from '../2-molecules/SetGroupSelect';
import { mergeSx } from 'utils/functions';

const equipmentLabel = 'Each';
const compositionLabel = 'If';
const filterLabel = 'Where:';
const addFilterLabel = 'Add filter';
const copyFilterLabel = 'Copy filter';
const deleteFilterLabel = 'Delete filter';
const addFilterGroupLabel = 'Add filter group';
const deleteRuleLabel = 'Delete model';
const copyRuleLabel = 'Copy model';
const useBasicModeLabel = 'Use simple filters mode';
const useAdvancedModeLabel = 'Use advanced filters mode';
const unusedFiltersLabel = 'You have unused filter(s)';
const matchesLabel = 'Matched network equipments';
const noMatchesLabel = 'None';

const Rule = (props) => {
    const {
        rule,
        isRuleValid = true,
        changeType,
        changeComposition,
        changeModel,
        addFilter,
        copyFilter,
        deleteFilter,
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
        controlledParameters = false,
        isNetworkAttached = false,
    } = props;
    const {
        type,
        composition,
        mappedModel,
        setGroup,
        groupType,
        hasFilter,
        matches = [],
    } = rule;

    const onChangeComposition = (event) => {
        changeComposition(event.target.value);
    };
    return (
        <Paper
            elevation={24}
            sx={mergeSx(
                styles.rulePaper,
                !isRuleValid && styles.invalidRulePaper
            )}
        >
            <Grid container>
                <Grid
                    item
                    xs={12}
                    md={4}
                    container
                    paddingRight={1}
                    direction={'column'}
                    justifyContent={'flex-start'}
                >
                    <Grid container>
                        <Grid item xs>
                            <Grid
                                container
                                justify={'flex-start'}
                                spacing={1}
                                alignItems={'baseline'}
                            >
                                <Grid item>
                                    <Typography variant="subtitle2">
                                        {equipmentLabel}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle1">
                                        {type}
                                    </Typography>
                                    {/*                            <Select
                                options={getRuleEquipmentTypesOptions()}
                                value={type}
                                setValue={changeType}
                                error={type === ''}
                            />*/}
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle1">
                                        :
                                    </Typography>
                                </Grid>
                                {unusedFilters.length > 0 && (
                                    <Grid item sx={styles.unused}>
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
                        <Grid item xs={'auto'} paddingLeft={1}>
                            <DeleteButton
                                onClick={deleteRule}
                                tooltip={deleteRuleLabel}
                            />
                            <CopyButton
                                onClick={copyRule}
                                tooltip={copyRuleLabel}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        container
                        sx={styles.ruleModel}
                        direction="column"
                        justifyContent={'flex-start'}
                    >
                        <ModelSelect
                            model={mappedModel}
                            models={models}
                            changeModel={changeModel}
                        />
                        <SetGroupSelect
                            model={mappedModel}
                            models={models}
                            setGroup={setGroup}
                            groupType={groupType}
                            changeGroup={changeParameters}
                            editGroup={editGroup}
                            controlledParameters={controlledParameters}
                            isNetworkAttached={isNetworkAttached}
                        />
                    </Grid>
                </Grid>
                <Grid
                    item
                    container
                    xs={12}
                    md={8}
                    // sx={styles.ruleModel}
                    direction="column"
                    justifyContent={'flex-start'}
                >
                    <Grid item container justify={'flex-start'}>
                        <Grid item xs>
                            <Typography>{filterLabel}</Typography>
                        </Grid>
                        <Grid item xs={'auto'} container paddingLeft={1}>
                            <AddIconButton
                                onClick={addFilter}
                                tooltip={
                                    addFilterLabel
                                    // isAdvancedMode
                                    //     ? addFilterLabel
                                    //     : addFilterGroupLabel
                                }
                                disabled={hasFilter}
                            />
                            <DeleteButton
                                onClick={deleteFilter}
                                tooltip={deleteFilterLabel}
                                disabled={!hasFilter}
                            />
                            {/*<CopyButton*/}
                            {/*    onClick={copyFilter}*/}
                            {/*    tooltip={copyFilterLabel}*/}
                            {/*    disabled={!hasFilter}*/}
                            {/*/>*/}
                        </Grid>
                    </Grid>
                    {children}
                </Grid>
                <Grid item xs={12} md={12} paddingTop={1}>
                    {isNetworkAttached && hasFilter && (
                        <Paper sx={styles.matches}>
                            <Grid container>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle1">
                                        {`${matchesLabel} :`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>
                                        {matches.length > 0
                                            ? `${matches.join(', ')}`
                                            : noMatchesLabel}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}
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
    deleteRule: PropTypes.func.isRequired,
    copyRule: PropTypes.func.isRequired,
    changeCompositionMode: PropTypes.func.isRequired,
    isAdvancedMode: PropTypes.bool.isRequired,
    canUseBasicMode: PropTypes.bool.isRequired,
    unusedFilters: PropTypes.array,
    changeParameters: PropTypes.func.isRequired,
    editGroup: PropTypes.func.isRequired,
    controlledParameters: PropTypes.bool,
    isNetworkAttached: PropTypes.bool,
};

export default Rule;
