/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getNetworkMatchesFromRule,
    makeGetFilterIndexes,
    makeGetRule,
    makeIsRuleValid,
    MappingSlice,
} from '../redux/slices/Mapping';
import { makeGetModels } from '../redux/slices/Model';
import Rule from '../components/3-organisms/Rule';
import FilterContainer from './FilterContainer';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { GroupEditionOrigin } from '../constants/models';
import { getCurrentNetworkId } from '../redux/slices/Network';

const RuleContainer = ({ index, editParameters }) => {
    const getRule = useMemo(makeGetRule, []);
    const rule = useSelector((state) => getRule(state, index));
    const {
        type,
        hasFilter,
        mappedModel,
        setGroup,
        groupType,
        //composition,
    } = rule;
    console.log('rule', { rule });
    const isRuleValidSelector = useMemo(makeIsRuleValid, []);
    const isRuleValid = useSelector((state) =>
        isRuleValidSelector(state, index)
    );
    const getModels = useMemo(makeGetModels, []);
    const models = useSelector((state) => getModels(state, rule.type));
    const getFilterIndexes = useMemo(makeGetFilterIndexes, []);
    // const filterIds = Array.from(
    //     composition.matchAll(/filter\d+\b/g),
    //     (m) => m[0]
    // );
    // const filtersIndex = useSelector((state) =>
    //     getFilterIndexes(state, { ruleIndex: index, filterIds })
    // );
    // let filtersIndexMap = {};
    // filterIds.forEach((filterId, filterIndex) => {
    //     filtersIndexMap[filterId] = filtersIndex[filterIndex];
    // });
    // const getCanUseBasicMode = useMemo(makeCanUseBasicMode, []);
    // const canUseBasicMode = useSelector((state) =>
    //     getCanUseBasicMode(state, index)
    // );

    // const getUnusedFilters = useMemo(makeGetUnusedFilters, []);
    // const unusedFilters = useSelector((state) =>
    //     getUnusedFilters(state, index)
    // );
    const controlledParameters = useSelector(
        (state) => state.mappings.controlledParameters
    );

    const currentNetworkId = useSelector(getCurrentNetworkId);
    const dispatch = useDispatch();
    // const [isAdvancedComposition, setIsAdvancedComposition] = useState(
    //     !canUseBasicMode
    // );

    // const compositionArray = canUseBasicMode
    //     ? convertCompositionStringToArray(composition)
    //     : [];

    // const changeCompositionMode = () =>
    //     setIsAdvancedComposition(!isAdvancedComposition);

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

    // const changeCompositionFromArray =
    //     (outerIndex) => (newOperator, innerIndexes) => {
    //         let newCompositionArray = _.cloneDeep(compositionArray);
    //         if (innerIndexes) {
    //             innerIndexes.forEach((innerIndex) => {
    //                 newCompositionArray[outerIndex][innerIndex] = newOperator;
    //             });
    //         } else {
    //             newCompositionArray[outerIndex] = newOperator;
    //         }
    //         changeComposition(
    //             convertCompositionArrayToString(newCompositionArray)
    //         );
    //     };

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
        (group) =>
            dispatch(
                MappingSlice.actions.changeRuleParameters({
                    index,
                    parameters: group?.name,
                    type: group?.type,
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

    // const addFilterInGroup = (groupIndex, groupOperator) => () =>
    //     dispatch(
    //         MappingSlice.actions.addFilter({
    //             ruleIndex: index,
    //             groupIndex,
    //             groupOperator,
    //         })
    //     );

    const deleteFilter = () =>
        dispatch(
            MappingSlice.actions.deleteFilter({
                index,
                // filterIndex,
            })
        );

    const copyFilter = () =>
        dispatch(
            MappingSlice.actions.copyFilter({
                index,
                // filterIndex,
            })
        );

    const editGroup = (isAbsolute) => () =>
        editParameters({
            model: mappedModel,
            setGroup,
            groupType,
            isAbsolute,
            origin: GroupEditionOrigin.RULE,
            originIndex: index,
        });

    // function buildFilters() {
    //     const filters = [];
    //     for (let i = 0; i < filtersNumber; i++) {
    //         filters.push(
    //             <FilterContainer
    //                 key={`filter-container-${i}`}
    //                 ruleIndex={index}
    //                 // filterIndex={i}
    //                 equipmentType={type}
    //             />
    //         );
    //     }
    //     return filters;
    // }

    // function buildFiltersGroup(groupArray, groupIndex) {
    //     const groupOperator = groupArray[1] ?? '||';
    //     const filters = groupArray
    //         .filter((elt, index) => index % 2 === 0 && elt !== 'true')
    //         .map((filterId) => (
    //             <FilterContainer
    //                 key={`filter-container-${filtersIndexMap[filterId]}`}
    //                 ruleIndex={index}
    //                 filterIndex={filtersIndexMap[filterId]}
    //                 equipmentType={type}
    //             />
    //         ));
    //     const changeGroupOperator = (newValue) => {
    //         let operatorIndexes = [];
    //         for (let i = 0; i < groupArray.length / 2 - 1; i++) {
    //             operatorIndexes.push(2 * i + 1);
    //         }
    //         changeCompositionFromArray(groupIndex)(newValue, operatorIndexes);
    //     };
    //
    //     return (
    //         <FiltersGroup
    //             filters={filters}
    //             groupOperator={groupOperator}
    //             changeGroupOperator={changeGroupOperator}
    //             addFilter={addFilterInGroup(groupIndex, groupOperator)}
    //             key={`group-${groupIndex}`}
    //         />
    //     );
    // }

    // TODO intl
    const noFilterLabel = 'No other rule applies';

    useEffect(() => {
        // If selected model is not in the list
        if (!models.map((model) => model.name).includes(mappedModel)) {
            if (models.length === 1) {
                // Replace selected model with the only one available
                changeModel(models[0].id);
            } else {
                changeModel('');
            }
        }
    }, [type, models, changeModel, mappedModel]);

    // const showAdvanced = isAdvancedComposition || filtersNumber === 1;
    useEffect(() => {
        if (!!currentNetworkId && isRuleValid) {
            dispatch(getNetworkMatchesFromRule(index));
        }
    }, [currentNetworkId, isRuleValid, index, /*composition,*/ dispatch]);

    return (
        <Rule
            rule={rule}
            isRuleValid={isRuleValid}
            changeType={changeType}
            changeComposition={changeComposition}
            changeModel={changeModel}
            changeParameters={changeParameters}
            addFilter={addFilter}
            copyFilter={copyFilter}
            deleteFilter={deleteFilter}
            models={models}
            deleteRule={deleteRule}
            copyRule={copyRule}
            // changeCompositionMode={changeCompositionMode}
            // isAdvancedMode={isAdvancedComposition}
            // canUseBasicMode={canUseBasicMode}
            // unusedFilters={unusedFilters}
            editGroup={editGroup}
            controlledParameters={controlledParameters}
            isNetworkAttached={!!currentNetworkId}
        >
            {hasFilter ? (
                <>
                    {
                        /*showAdvanced &&  <FiltersTemplate>
                            {buildFilters()}
                        </FiltersTemplate> */
                        <FilterContainer
                            ruleIndex={index}
                            equipmentType={type}
                        />
                    }
                    {/*                    {!showAdvanced &&
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
                        })}*/}
                </>
            ) : (
                <Typography
                    variant="subtitle2"
                    style={{ textAlign: 'left' }}
                    color={'info.main'}
                >
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
