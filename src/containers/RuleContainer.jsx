/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    makeCanUseBasicMode,
    makeGetFilterIndexes,
    makeGetRule,
    makeGetUnusedFilters,
    makeIsRuleValid,
    MappingSlice,
} from '../redux/slices/Mapping';
import { makeGetModels } from '../redux/slices/Model';
import Rule from '../components/3-organisms/Rule';
import FiltersTemplate from '../components/4-templates/FiltersTemplate';
import FilterContainer from './FilterContainer';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import {
    convertCompositionArrayToString,
    convertCompositionStringToArray,
} from '../utils/composition';
import BooleanOperatorSelect from '../components/2-molecules/BooleanOperatorSelect';
import FiltersGroup from '../components/3-organisms/FiltersGroup';
import { GroupEditionOrigin } from '../constants/models';

const RuleContainer = ({ index, editParameters }) => {
    const getRule = useMemo(makeGetRule, []);
    const rule = useSelector((state) => getRule(state, index));
    const { type, filtersNumber, mappedModel, setGroup, composition } = rule;
    const isRuleValidSelector = useMemo(makeIsRuleValid, []);
    const isRuleValid = useSelector((state) =>
        isRuleValidSelector(state, index)
    );
    const getModels = useMemo(makeGetModels, []);
    const models = useSelector((state) => getModels(state, rule.type));
    const getFilterIndexes = useMemo(makeGetFilterIndexes, []);
    const filterIds = Array.from(
        composition.matchAll(/filter\d+\b/g),
        (m) => m[0]
    );
    const filtersIndex = useSelector((state) =>
        getFilterIndexes(state, { ruleIndex: index, filterIds })
    );
    let filtersIndexMap = {};
    filterIds.forEach((filterId, filterIndex) => {
        filtersIndexMap[filterId] = filtersIndex[filterIndex];
    });
    const getCanUseBasicMode = useMemo(makeCanUseBasicMode, []);
    const canUseBasicMode = useSelector((state) =>
        getCanUseBasicMode(state, index)
    );

    const getUnusedFilters = useMemo(makeGetUnusedFilters, []);
    const unusedFilters = useSelector((state) =>
        getUnusedFilters(state, index)
    );
    const controlledParameters = useSelector(
        (state) => state.mappings.controlledParameters
    );
    const dispatch = useDispatch();
    const [isAdvancedComposition, setIsAdvancedComposition] = useState(
        !canUseBasicMode
    );

    const compositionArray = canUseBasicMode
        ? convertCompositionStringToArray(composition)
        : [];

    const changeCompositionMode = () =>
        setIsAdvancedComposition(!isAdvancedComposition);

    const changeType = (newType) =>
        dispatch(
            MappingSlice.actions.changeRuleType({
                index,
                equipmentType: newType,
            })
        );
    const changeComposition = (newComposition) =>
        dispatch(
            MappingSlice.actions.changeRuleComposition({
                index,
                composition: newComposition,
            })
        );

    const changeCompositionFromArray =
        (outerIndex) => (newOperator, innerIndexes) => {
            let newCompositionArray = _.cloneDeep(compositionArray);
            if (innerIndexes) {
                innerIndexes.forEach((innerIndex) => {
                    newCompositionArray[outerIndex][innerIndex] = newOperator;
                });
            } else {
                newCompositionArray[outerIndex] = newOperator;
            }
            changeComposition(
                convertCompositionArrayToString(newCompositionArray)
            );
        };

    const changeModel = useCallback(
        (newModel) =>
            dispatch(
                MappingSlice.actions.changeRuleModel({
                    index,
                    mappedModel: newModel,
                })
            ),
        [dispatch, index]
    );

    const changeParameters = useCallback(
        (parameters) =>
            dispatch(
                MappingSlice.actions.changeRuleParameters({
                    index,
                    parameters: parameters,
                })
            ),
        [dispatch, index]
    );

    const deleteRule = () =>
        dispatch(
            MappingSlice.actions.deleteRule({
                index,
            })
        );

    const copyRule = () =>
        dispatch(
            MappingSlice.actions.copyRule({
                index,
            })
        );

    const addFilter = () =>
        dispatch(
            MappingSlice.actions.addFilter({
                ruleIndex: index,
            })
        );

    const addFilterInGroup = (groupIndex, groupOperator) => () =>
        dispatch(
            MappingSlice.actions.addFilter({
                ruleIndex: index,
                groupIndex,
                groupOperator,
            })
        );

    const editGroup = () =>
        editParameters({
            model: mappedModel,
            setGroup,
            origin: GroupEditionOrigin.RULE,
            originIndex: index,
        });

    function buildFilters() {
        const filters = [];
        for (let i = 0; i < filtersNumber; i++) {
            filters.push(
                <FilterContainer
                    key={`filter-container-${i}`}
                    ruleIndex={index}
                    filterIndex={i}
                    equipmentType={type}
                />
            );
        }
        return filters;
    }

    function buildFiltersGroup(groupArray, groupIndex) {
        const groupOperator = groupArray[1] ?? '||';
        const filters = groupArray
            .filter((elt, index) => index % 2 === 0 && elt !== 'true')
            .map((filterId) => (
                <FilterContainer
                    key={`filter-container-${filtersIndexMap[filterId]}`}
                    ruleIndex={index}
                    filterIndex={filtersIndexMap[filterId]}
                    equipmentType={type}
                />
            ));
        const changeGroupOperator = (newValue) => {
            let operatorIndexes = [];
            for (let i = 0; i < groupArray.length / 2 - 1; i++) {
                operatorIndexes.push(2 * i + 1);
            }
            changeCompositionFromArray(groupIndex)(newValue, operatorIndexes);
        };

        return (
            <FiltersGroup
                filters={filters}
                groupOperator={groupOperator}
                changeGroupOperator={changeGroupOperator}
                addFilter={addFilterInGroup(groupIndex, groupOperator)}
                key={`group-${groupIndex}`}
            />
        );
    }

    // TODO intl
    const noFilterLabel = 'no other rule applies';

    useEffect(() => {
        if (!models.map((model) => model.name).includes(mappedModel)) {
            if (models.length === 1) {
                changeModel(models[0].id);
            } else {
                changeModel('');
            }
        }
    }, [type, models, changeModel, mappedModel]);

    const showAdvanced = isAdvancedComposition || filtersNumber === 1;
    return (
        <Rule
            rule={rule}
            isRuleValid={isRuleValid}
            changeType={changeType}
            changeComposition={changeComposition}
            changeModel={changeModel}
            changeParameters={changeParameters}
            addFilter={addFilter}
            models={models}
            deleteRule={deleteRule}
            copyRule={copyRule}
            changeCompositionMode={changeCompositionMode}
            isAdvancedMode={isAdvancedComposition}
            canUseBasicMode={canUseBasicMode}
            unusedFilters={unusedFilters}
            editGroup={editGroup}
            controlledParameters={controlledParameters}
        >
            {rule.filtersNumber > 0 ? (
                <>
                    {showAdvanced && (
                        <FiltersTemplate>{buildFilters()}</FiltersTemplate>
                    )}
                    {!showAdvanced &&
                        compositionArray.map((element, index) => {
                            if (Array.isArray(element)) {
                                return buildFiltersGroup(element, index);
                            } else {
                                return (
                                    <Grid container key={`operator-${index}`}>
                                        <Grid item>
                                            <BooleanOperatorSelect
                                                value={element}
                                                setValue={changeCompositionFromArray(
                                                    index
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                );
                            }
                        })}
                </>
            ) : (
                <Typography variant="subtitle2" style={{ textAlign: 'center' }}>
                    {noFilterLabel}
                </Typography>
            )}
        </Rule>
    );
};

RuleContainer.propTypes = {
    index: PropTypes.number.isRequired,
    editParameters: PropTypes.func.isRequired,
};

export default RuleContainer;
