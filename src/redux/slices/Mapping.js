/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    createAsyncThunk,
    createSelector,
    createSlice,
} from '@reduxjs/toolkit';
import * as mappingsAPI from '../../rest/mappingsAPI';
import * as _ from 'lodash';
import RequestStatus from '../../constants/RequestStatus';
import {
    checkCompositionArrayValidity,
    convertCompositionArrayToString,
    convertCompositionStringToArray,
    getMaxDepthParentheses,
} from '../../utils/composition';
import * as networkAPI from '../../rest/networkAPI';
import { makeGetNetworkValues } from './Network';
import { createParameterSelector } from '../selectorUtil';
import { AutomatonFamily } from '../../constants/automatonDefinition';
import { RuleEquipmentTypes } from '../../constants/equipmentType';
import {
    exportExpertRules,
    getExpertFilterEmptyFormData,
    importExpertRules,
} from '@gridsuite/commons-ui';
import { enrichIdQuery } from '../../utils/rqb-utils';

const initialState = {
    mappings: [],
    activeMapping: '',
    rules: [],
    automata: [],
    status: RequestStatus.IDLE,
    filteredRuleType: '',
    filteredAutomatonFamily: '',
    controlledParameters: false,
};

const DEFAULT_RULE = {
    type: '',
    // composition: 'true',
    mappedModel: '',
    setGroup: '',
    groupType: 'FIXED',
    filter: undefined, //    filters: [],
    // filterCounter: 1,
    matches: [],
};

const DEFAULT_AUTOMATON = {
    family: '',
    model: '',
    setGroup: '',
};

export const DEFAULT_NAME = 'default';

//utils

const transformMapping = (receivedMapping) => {
    const mapping = _.cloneDeep(receivedMapping);
    mapping.rules = mapping.rules.map((rule) => {
        // let filterCounterList = [];
        rule['type'] = rule.equipmentType;
        delete rule.equipmentType;
        // rule.filters.forEach((filter) => {
        //     filterCounterList.push(Number(filter.filterId.slice(6)));
        //     filter['id'] = filter.filterId;
        //     delete filter.filterId;
        //     delete filter.type;
        // });
        // rule['filterCounter'] =
        //     filterCounterList.reduce((max, val) => Math.max(max, val), 0) + 1;
        rule['matches'] = [];
        if (rule.filter) {
            rule['filter']['rules'] = importExpertRules(
                // RQB need an id for each rule/group to avoid re-create a new component
                // even the same input => lost focus while typing
                // This solution can be removed when the back-end returns id persisted for each rule in the db (round-trip)
                enrichIdQuery(rule.filter.rules)
            );
        }
        return rule;
    });

    // Avoid versions discrepancies
    if (!mapping['automata']) {
        mapping['automata'] = [];
    } else {
        mapping['automata'] = receivedMapping.automata.map(
            (receivedAutomaton) => {
                const { family, model, setGroup, properties } =
                    receivedAutomaton;

                const automaton = {
                    family,
                    model,
                    setGroup,
                    properties: properties
                        ? properties.map((elem) => ({
                              name: elem.name,
                              value: elem.value,
                              type: elem.type,
                          }))
                        : [],
                };
                return automaton;
            }
        );
    }

    return mapping;
};

const filterRulesByType = (rules, type) =>
    rules.filter(
        (rule) => type === '' || rule.type === '' || rule.type === type
    );

const filterAutomataByFamily = (automata, family) =>
    automata.filter(
        (automaton) =>
            family === '' ||
            automaton.family === '' ||
            automaton.family === family
    );

const postProcessComposition = (composition) =>
    composition
        // remove bordering spaces
        .trim()
        // replace multiple spaces by single ones
        .replaceAll(/ +(?= )/g, '')
        // remove parentheses bordering one element
        .replaceAll(/\((filter\d+)\)/g, '$1')
        // remove useless parentheses around the whole string
        .replace(/^\(([^(]+)\)$/g, '$1');

// base selectors
export const getRules = (state) => state.mappings.rules;
export const getFilteredRuleType = (state) => state.mappings.filteredRuleType;

// parameter selectors
// filter param object {rule, filter, ..}
const getRuleIndexParam = createParameterSelector(({ rule }) => rule);
//const getFilterIndexParam = createParameterSelector(({ filter }) => filter);

// Selectors

export const getSortedRulesNumber = (state) => {
    let sortedRulesNumber = {};
    RuleEquipmentTypes.forEach((type) => {
        sortedRulesNumber[type] = 0;
    });

    state.mappings.rules.forEach((rule) => {
        if (rule.type !== '') {
            sortedRulesNumber[rule.type]++;
        }
    });
    return sortedRulesNumber;
};

export const getRulesNumber = (state) =>
    state.mappings.rules.filter(
        (rule) =>
            state.mappings.filteredRuleType === '' ||
            rule.type === '' ||
            rule.type === state.mappings.filteredRuleType
    ).length;

export const getAutomataNumber = (state) =>
    state.mappings.automata.filter(
        (automaton) =>
            state.mappings.filteredAutomatonFamily === '' ||
            automaton.family === '' ||
            automaton.family === state.mappings.filteredAutomatonFamily
    ).length;

export const getSortedAutomataNumber = (state) => {
    let sortedAutomataNumber = {};
    Object.values(AutomatonFamily).forEach((family) => {
        sortedAutomataNumber[family] = 0;
    });

    state.mappings.automata.forEach((automaton) => {
        if (automaton.family !== '') {
            sortedAutomataNumber[automaton.family]++;
        }
    });
    return sortedAutomataNumber;
};

export const makeGetRule = () =>
    createSelector(
        getRules,
        getFilteredRuleType,
        (_state, index) => index,
        (rules, filteredRuleType, ruleIndex) => {
            const filteredRules = filterRulesByType(rules, filteredRuleType);
            const foundRule = filteredRules[ruleIndex];
            const {
                type,
                //composition,
                mappedModel,
                setGroup,
                groupType,
                matches,
            } = foundRule;
            // Filters fetched separately to avoid re-renders
            return {
                type,
                //composition,
                mappedModel,
                setGroup,
                groupType,
                matches,
                // filtersNumber: foundRule.filters.length,
                hasFilter: !!foundRule.filter,
            };
        }
    );

export const makeGetAutomaton = () =>
    createSelector(
        (state) =>
            filterAutomataByFamily(
                state.mappings.automata,
                state.mappings.filteredAutomatonFamily
            ),
        (_state, index) => index,
        (automata, index) => {
            return automata[index];
        }
    );

export const makeGetUnusedFilters = () =>
    createSelector(
        (state) =>
            filterRulesByType(
                state.mappings.rules,
                state.mappings.filteredRuleType
            ),
        (_state, index) => index,
        (rules, index) => {
            const selectedRule = rules[index];
            const usedFilters = Array.from(
                selectedRule.composition.matchAll(/filter\d+\b/g),
                (m) => m[0]
            );
            const ruleFilters = selectedRule.filters.map((filter) => filter.id);
            return ruleFilters.filter(
                (filterToTest) => !usedFilters.includes(filterToTest)
            );
        }
    );

export const makeGetFilter = () =>
    createSelector(
        getRules,
        getFilteredRuleType,
        (_state, index) => index,
        // getRuleIndexParam,
        //getFilterIndexParam,
        (rules, filteredRuleType, ruleIndex /*, filterIndex*/) => {
            const filteredRules = filterRulesByType(rules, filteredRuleType);
            // return filteredRules[ruleIndex].filters[filterIndex];
            return filteredRules[ruleIndex].filter;
        }
    );

export const makeGetFilterIndexes = () =>
    createSelector(
        (state) =>
            filterRulesByType(
                state.mappings.rules,
                state.mappings.filteredRuleType
            ),
        (_state, args) => args,
        (rules, { ruleIndex, filterIds }) => {
            const filters = rules[ruleIndex].filters;
            return filterIds.map((id) =>
                filters.findIndex((filter) => filter.id === id)
            );
        }
    );

const checkFilterValidity = (filter) => true;
// filter.property !== '' && filter.operand !== '' && filter.value !== '';

export const makeIsFilterValid = () =>
    createSelector(
        (state) =>
            filterRulesByType(
                state.mappings.rules,
                state.mappings.filteredRuleType
            ),
        (_state, indexes) => indexes,
        (rules, indexes) =>
            //checkFilterValidity(rules[indexes.rule].filters[indexes.filter])
            checkFilterValidity(rules[indexes.rule].filter)
    );

const checkAllFiltersValidity = (rule) => {
    // return rule.filters.every((filter) => checkFilterValidity(filter));
    return checkFilterValidity(rule.filter);
};

export const makeGetIsAllFiltersValid = () =>
    createSelector(
        getRules,
        getFilteredRuleType,
        (_state, ruleIndex) => ruleIndex,
        (rules, filteredRuleType, ruleIndex) => {
            return checkAllFiltersValidity(
                filterRulesByType(rules, filteredRuleType)[ruleIndex]
            );
        }
    );

const checkRuleValidity = (rule) => {
    return (
        rule.type !== '' &&
        rule.composition !== '' &&
        rule.mappedModel !== '' &&
        rule.setGroup !== '' &&
        rule.groupType !== '' &&
        checkAllFiltersValidity(rule)
    );
};

const checkCanUseBasicMode = (inputComposition) => {
    const composition = postProcessComposition(inputComposition);
    const maxDepthComposition = getMaxDepthParentheses(composition);
    if (maxDepthComposition < 2) {
        try {
            const compositionArray =
                convertCompositionStringToArray(composition);
            return (
                composition === 'true' ||
                (composition ===
                    convertCompositionArrayToString(compositionArray) &&
                    checkCompositionArrayValidity(compositionArray))
            );
        } catch {
            return false;
        }
    }
    return false;
};

const checkAutomatonValidity = (automaton, automatonDefinition = {}) =>
    automaton.family !== '' &&
    automaton.model !== '' &&
    automaton.setGroup !== '' &&
    // check empty
    Object.keys(automatonDefinition).reduce(
        (acc, propertyName) =>
            acc &&
            (automatonDefinition[propertyName].isRequired
                ? automaton.properties.find(
                      (elem) => elem.name === propertyName
                  )?.value !== ''
                : true),
        true
    );

export const makeIsRuleValid = () =>
    createSelector(
        (state) =>
            filterRulesByType(
                state.mappings.rules,
                state.mappings.filteredRuleType
            ),
        (_state, index) => index,
        (rules, index) => checkRuleValidity(rules[index])
    );

export const makeCanUseBasicMode = () =>
    createSelector(
        (state) =>
            filterRulesByType(
                state.mappings.rules,
                state.mappings.filteredRuleType
            ),
        (_state, index) => index,
        (rules, index) => checkCanUseBasicMode(rules[index].composition)
    );

export const makeIsAutomatonValid = () =>
    createSelector(
        (state) =>
            filterAutomataByFamily(
                state.mappings.automata,
                state.mappings.filteredAutomatonFamily
            ),
        (state) => state.models.automatonDefinitions,
        (_state, index) => index,
        (automata, automatonDefinitions, index) =>
            checkAutomatonValidity(
                automata[index],
                automatonDefinitions[automata[index].model]
            )
    );

export const isMappingValid = createSelector(
    (state) => state.mappings.activeMapping,
    (state) => state.mappings.rules,
    (state) => state.mappings.automata,
    (name, rules, automata) =>
        name !== '' &&
        rules.reduce((acc, rule) => acc && checkRuleValidity(rule), true) &&
        automata.reduce(
            (acc, automaton) => acc && checkAutomatonValidity(automaton),
            true
        )
);

export const getMappingsInfo = createSelector(
    (state) => state.mappings.mappings,
    (mappings) =>
        mappings.map((mapping) => ({
            name: mapping.name,
        }))
);

export const isModified = createSelector(
    (state) => state.mappings.activeMapping,
    (state) => state.mappings.controlledParameters,
    (state) => state.mappings.rules,
    (state) => state.mappings.automata,
    (state) => state.mappings.mappings,

    (
        activeName,
        controlledParameters,
        activeRules,
        activeAutomata,
        savedMappings
    ) => {
        const foundMapping = savedMappings.find(
            (mapping) => mapping.name === activeName
        );

        function ignoreInternalProperties(rule) {
            const ruleToTest = _.cloneDeep(rule);
            delete ruleToTest.filterCounter;
            delete ruleToTest.matches;
            return ruleToTest;
        }

        return !(
            _.isEqual(
                activeRules.map(ignoreInternalProperties),
                foundMapping.rules.map(ignoreInternalProperties)
            ) &&
            _.isEqual(activeAutomata, foundMapping.automata) &&
            _.isEqual(controlledParameters, foundMapping.controlledParameters)
        );
    }
);

const canCreateNewMappingCheck = (mappings) =>
    !mappings.some((mapping) => mapping.name === DEFAULT_NAME);

export const canCreateNewMapping = (state) =>
    canCreateNewMappingCheck(state.mappings.mappings);

export const makeGetMatches = () =>
    createSelector(
        getRules,
        getFilteredRuleType,
        (_state, { isRule, index }) => (isRule ? index : -1),
        (rules, filteredRuleType, index) =>
            filterRulesByType(rules, filteredRuleType)[index]?.matches ?? []
    );

// Reducers
const augmentFilter = (ruleType) => (filter) => ({
    ...filter,
    // filterId: filter.id,
    equipmentType: ruleType,
    type: 'EXPERT',
    // type: getProperty(ruleType, filter.property).type,
    rules: exportExpertRules(filter.rules),
});
export const postMapping = createAsyncThunk(
    'mappings/post',
    async (name, { getState }) => {
        const state = getState();
        const token = state?.user.user?.id_token;
        const mappingName = name ?? state?.mappings.activeMapping;
        const rules =
            name && name !== state?.mappings.activeMapping
                ? state?.mappings.mappings.find(
                      (mapping) => mapping.name === name
                  )?.rules
                : state?.mappings.rules;

        let augmentedRules = rules.map((rule) => {
            let augmentedRule = _.cloneDeep(rule);
            augmentedRule.equipmentType = rule.type.toUpperCase();
            // augmentedRule.composition = postProcessComposition(
            //     rule.composition
            // );
            // augmentedRule.filters = augmentedRule.filters.map(
            //     augmentFilter(rule.type)
            // );
            // FIX ME may be not need augment filter
            if (augmentedRule.filter) {
                augmentedRule.filter = augmentFilter(
                    augmentedRule.equipmentType
                )(augmentedRule.filter);
            }

            // if (augmentedRule.filters.length === 0) {
            //     // Even if it should be true anyway, avoid "true && true" in case of filter deletion
            //     augmentedRule.composition = 'true';
            // }
            delete augmentedRule.matches;
            return augmentedRule;
        });

        const automata =
            name && name !== state?.mappings.activeMapping
                ? state?.mappings.mappings.find(
                      (mapping) => mapping.name === name
                  )?.automata
                : state?.mappings.automata;
        const formattedAutomata = automata.map((automaton) => {
            const { family, model, setGroup, properties } = automaton;
            const formattedAutomaton = {
                family,
                model,
                setGroup,
                properties: properties
                    ? properties.map((elem) => ({
                          name: elem.name,
                          value: elem.value,
                          type: elem.type,
                      }))
                    : [],
            };
            return formattedAutomaton;
        });

        const controlledParameters =
            name && name !== state?.mappings.activeMapping
                ? state?.mappings.mappings.find(
                      (mapping) => mapping.name === name
                  )?.controlledParameters
                : state?.mappings.controlledParameters;

        return await mappingsAPI.postMapping(
            mappingName,
            augmentedRules,
            formattedAutomata,
            controlledParameters,
            token
        );
    }
);

export const getMappings = createAsyncThunk(
    'mappings/get',
    async (_arg, { getState }) => {
        const token = getState()?.user.user?.id_token;
        return await mappingsAPI.getMappings(token);
    }
);

export const deleteMapping = createAsyncThunk(
    'mappings/delete',
    async (mappingName, { getState }) => {
        const token = getState()?.user.user?.id_token;
        return await mappingsAPI.deleteMapping(mappingName, token);
    }
);

export const renameMapping = createAsyncThunk(
    'mappings/rename',
    async ({ nameToReplace, newName }, { getState }) => {
        const token = getState()?.user.user?.id_token;
        return await mappingsAPI.renameMapping(nameToReplace, newName, token);
    }
);

export const copyMapping = createAsyncThunk(
    'mappings/copy',
    async ({ originalName, copyName }, { getState }) => {
        const token = getState()?.user.user?.id_token;
        return await mappingsAPI.copyMapping(originalName, copyName, token);
    }
);

export const getNetworkMatchesFromRule = createAsyncThunk(
    'mappings/matchNetwork',
    async (ruleIndex, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state?.user.user?.id_token;
        const { rules, filteredRuleType } = state?.mappings;
        const networkId = state?.network.currentNetwork;
        const foundRule = filterRulesByType(rules, filteredRuleType)[ruleIndex];
        const ruleToMatch = {
            ruleIndex,
            // composition: foundRule.composition,
            equipmentType: foundRule.type,
            filter: augmentFilter(foundRule.type)(foundRule.filter),
        };
        return await networkAPI.getNetworkMatchesFromRule(
            networkId,
            ruleToMatch,
            token
        );
    }
);

// daisy-chain action creators
export const makeChangeFilterValueThenGetNetworkMatches = () => {
    // create memorizing selectors for this action creator
    const getRule = makeGetRule();
    const getFilter = makeGetFilter();
    const getNetworkValues = makeGetNetworkValues();
    const getIsAllFiltersValid = makeGetIsAllFiltersValid();

    return ({ ruleIndex, /*filterIndex,*/ value }) => {
        return (dispatch, getState) => {
            dispatch(
                // MappingSlice.actions.changeFilterValue({
                //     ruleIndex,
                //     filterIndex,
                //     value,
                // })
                MappingSlice.actions.changeFilterValue({
                    ruleIndex,
                    /*filterIndex,*/
                    value,
                })
            );

            // --- Fail-fast check conditions to fire the next action --- //
            const state = getState();
            // // network values must be present
            // // get type
            // const rule = getRule(state, ruleIndex);
            // const { type } = rule;
            //
            // // get full property
            // const filter = getFilter(state, {
            //     rule: ruleIndex,
            //     //filter: filterIndex,
            // });
            // const { property } = filter;
            // const fullProperty = type ? getProperty(type, property) : undefined;
            //
            // // get network value from filter
            // const networkValues = getNetworkValues(state, {
            //     equipmentType: type,
            //     fullProperty: fullProperty,
            // });
            //
            // const hasNetworkValues = networkValues.length > 0;
            // if (!hasNetworkValues) {
            //     return;
            // }

            // every filter in the same rule must be valid
            const isAllFiltersValid = getIsAllFiltersValid(state, ruleIndex);
            if (!isAllFiltersValid) {
                return;
            }

            // --- All conditions passed => dispatch the next action --- //
            dispatch(getNetworkMatchesFromRule(ruleIndex));
        };
    };
};

const reducers = {
    // Active Mapping

    changeFilteredType: (state, action) => {
        const filteredRuleType = action.payload;
        state.filteredRuleType = filteredRuleType;
    },
    changeFilteredFamily: (state, action) => {
        const filteredAutomatonFamily = action.payload;
        state.filteredAutomatonFamily =
            state.filteredAutomatonFamily === filteredAutomatonFamily
                ? ''
                : filteredAutomatonFamily;
    },
    changeControlledParameters: (state) => {
        state.controlledParameters = !state.controlledParameters;
    },
    // Rule
    addRule: (state) => {
        const newRule = _.cloneDeep(DEFAULT_RULE);
        newRule.type = state.filteredRuleType;
        state.rules.push(newRule);
    },
    changeRuleType: (state, action) => {
        const { index, equipmentType } = action.payload;
        const selectedRule = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[index];
        selectedRule.type = equipmentType;
        // selectedRule.composition = DEFAULT_RULE.composition;
        selectedRule.filter = DEFAULT_RULE.filter;
        selectedRule.mappedModel = DEFAULT_RULE.mappedModel;
        selectedRule.setGroup = DEFAULT_RULE.setGroup;
        selectedRule.groupType = DEFAULT_RULE.groupType;
        //selectedRule.filterCounter = DEFAULT_RULE.filterCounter;
        selectedRule.matches = DEFAULT_RULE.matches;
    },
    changeRuleComposition: (state, action) => {
        const { index, composition } = action.payload;
        const selectedRule = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[index];
        // selectedRule.composition = composition;
        selectedRule.matches = DEFAULT_RULE.matches;
    },
    changeRuleModel: (state, action) => {
        const { index, mappedModel } = action.payload;
        const selectedRule = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[index];
        selectedRule.mappedModel = mappedModel;
    },
    changeRuleParameters: (state, action) => {
        const { index, parameters, type } = action.payload;
        const selectedRule = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[index];
        selectedRule.setGroup = parameters;
        selectedRule.groupType = type;
    },
    deleteRule: (state, action) => {
        const { index } = action.payload;
        const ruleToDelete = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[index];
        state.rules = state.rules.filter((rule) => rule !== ruleToDelete);
    },
    copyRule: (state, action) => {
        const { index } = action.payload;
        const ruleToCopy = _.cloneDeep(
            filterRulesByType(state.rules, state.filteredRuleType)[index]
        );
        state.rules.push(ruleToCopy);
    },
    // Filter
    addFilter: (state, action) => {
        const { ruleIndex /*, groupIndex, groupOperator = '||' */ } =
            action.payload;
        // const newId = `filter${filterRulesByType(
        //     state.rules,
        //     state.filteredRuleType
        // )[ruleIndex].filterCounter++}`;
        // create an empty expert filter
        const newFilter = getExpertFilterEmptyFormData();

        // {
        //     // id: newId,
        //     // property: '',
        //     // operand: '',
        //     // value: '',
        // };
        const selectedRule = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[ruleIndex];
        selectedRule.matches = DEFAULT_RULE.matches;
        selectedRule.filter = newFilter;
        // if (groupIndex !== undefined) {
        //     try {
        //         const newCompositionArray = convertCompositionStringToArray(
        //             selectedRule.composition
        //         );
        //         newCompositionArray[groupIndex].push(groupOperator);
        //         newCompositionArray[groupIndex].push(newId);
        //         selectedRule.composition =
        //             convertCompositionArrayToString(newCompositionArray);
        //     } catch (e) {
        //         console.error(e);
        //     }
        // } else {
        //     selectedRule.composition =
        //         selectedRule.filters.length === 1
        //             ? newId
        //             : `${selectedRule.composition} && ${newId}`;
        // }
    },
    changeFilter: (state, action) => {
        const { ruleIndex, newFilter /* filterIndex, property */ } =
            action.payload;
        const modifiedRule = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[ruleIndex];
        modifiedRule.filter = newFilter;
    },
    // FIXME to remove below action
    // changeFilterProperty: (state, action) => {
    //     const { ruleIndex, filterIndex, property } = action.payload;
    //     const modifiedFilter = filterRulesByType(
    //         state.rules,
    //         state.filteredRuleType
    //     )[ruleIndex].filters[filterIndex];
    //     modifiedFilter.property = property;
    //     modifiedFilter.operand = '';
    //     modifiedFilter.value = '';
    // },
    // changeFilterOperand: (state, action) => {
    //     const { ruleIndex, filterIndex, operand } = action.payload;
    //     const modifiedFilter = filterRulesByType(
    //         state.rules,
    //         state.filteredRuleType
    //     )[ruleIndex].filters[filterIndex];
    //     const multiple = multipleOperands.includes(operand);
    //     modifiedFilter.operand = operand;
    //     modifiedFilter.value = multiple ? [] : '';
    // },
    changeFilterValue: (state, action) => {
        const { ruleIndex, value } = action.payload;
        const modifiedFilter = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[ruleIndex].filter;
        console.log('ChangeFilterValue', { value });
        modifiedFilter.rules = value;
    },
    deleteFilter: (state, action) => {
        const { ruleIndex, filterIndex } = action.payload;
        const ruleToModify = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[ruleIndex];
        const filterIdToDelete = ruleToModify.filters[filterIndex].id;
        const newFilters = ruleToModify.filters.filter(
            (value, index) => index !== filterIndex
        );
        ruleToModify.filters = newFilters;
        const modifiedComposition = ruleToModify.composition
            .replaceAll(filterIdToDelete, 'true')
            .replaceAll('(true)', 'true')
            .replaceAll(/ (?:&&|\|\|) true/g, '')
            .replaceAll(/true (?:&&|\|\|) /g, '');
        ruleToModify.composition = modifiedComposition;
    },
    copyFilter: (state, action) => {
        const { ruleIndex, filterIndex } = action.payload;
        const selectedRule = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[ruleIndex];
        let filters = selectedRule.filters;
        const filterToCopy = _.cloneDeep(filters[filterIndex]);
        const newId = `filter${selectedRule.filterCounter++}`;
        filterToCopy.id = newId;
        selectedRule.filters.push(filterToCopy);
        selectedRule.composition =
            selectedRule.filters.length === 1
                ? newId
                : `${selectedRule.composition} &&  ${newId}`;
    },
    // Automaton
    addAutomaton: (state) => {
        const newAutomaton = _.cloneDeep(DEFAULT_AUTOMATON);
        newAutomaton.family = state.filteredAutomatonFamily;
        state.automata.push(newAutomaton);
    },
    changeAutomatonFamily: (state, action) => {
        const { index, family } = action.payload;
        const selectedAutomaton = filterAutomataByFamily(
            state.automata,
            state.filteredAutomatonFamily
        )[index];
        selectedAutomaton.family = family;
        selectedAutomaton.model = DEFAULT_AUTOMATON.model;
    },
    changeAutomatonModel: (state, action) => {
        const { index, model } = action.payload;
        const selectedAutomaton = filterAutomataByFamily(
            state.automata,
            state.filteredAutomatonFamily
        )[index];
        selectedAutomaton.model = model;

        // clean all others automaton model properties
        selectedAutomaton.setGroup = DEFAULT_AUTOMATON.setGroup;
        selectedAutomaton.properties = [];
    },
    changeAutomatonParameters: (state, action) => {
        const { index, parameters } = action.payload;
        const selectedAutomaton = filterAutomataByFamily(
            state.automata,
            state.filteredAutomatonFamily
        )[index];
        selectedAutomaton.setGroup = parameters;
    },
    changeAutomatonPropertyValue: (state, action) => {
        const { index, property } = action.payload;
        const selectedAutomaton = filterAutomataByFamily(
            state.automata,
            state.filteredAutomatonFamily
        )[index];

        const foundIndex = selectedAutomaton.properties.findIndex(
            (elem) => elem.name === property.name
        );

        if (foundIndex !== -1) {
            selectedAutomaton.properties[foundIndex].value = property.value;
        } else {
            selectedAutomaton.properties.push({ ...property });
        }
    },
    deleteAutomaton: (state, action) => {
        const { index } = action.payload;
        const automatonToDelete = filterAutomataByFamily(
            state.automata,
            state.filteredAutomatonFamily
        )[index];
        state.automata = state.automata.filter(
            (automaton) => automaton !== automatonToDelete
        );
    },
    copyAutomaton: (state, action) => {
        const { index } = action.payload;
        const automatonToCopy = _.cloneDeep(
            filterAutomataByFamily(
                state.automata,
                state.filteredAutomatonFamily
            )[index]
        );
        state.automata.push(automatonToCopy);
    },
    // Mappings
    createMapping: (state, _action) => {
        const mappings = state.mappings;
        if (canCreateNewMappingCheck(mappings)) {
            mappings.push({
                name: DEFAULT_NAME,
                rules: [],
                automata: [],
            });
            state.activeMapping = DEFAULT_NAME;
            state.rules = [];
            state.automata = [];
            state.controlledParameters = false;
        }
    },
    selectMapping: (state, action) => {
        const { name } = action.payload;
        const mappingToUse = state.mappings.find(
            (mapping) => mapping.name === name
        );
        if (mappingToUse) {
            state.rules = mappingToUse.rules;
            state.automata = mappingToUse.automata;
            state.activeMapping = name;
            state.controlledParameters = mappingToUse.controlledParameters;
        }
    },
    deselectMapping: (state, _action) => {
        state.rules = [];
        state.automata = [];
        state.activeMapping = '';
        state.controlledParameters = false;
    },
};

const extraReducers = (builder) => {
    builder.addCase(postMapping.fulfilled, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        const receivedMapping = transformMapping(action.payload);
        const foundMapping = state.mappings.find(
            (mapping) => mapping.name === receivedMapping.name
        );
        if (foundMapping) {
            foundMapping.rules = receivedMapping.rules;
            foundMapping.automata = receivedMapping.automata;
            foundMapping.controlledParameters =
                receivedMapping.controlledParameters;
            if (receivedMapping.name === state.activeMapping) {
                state.rules = receivedMapping.rules;
                state.automata = receivedMapping.automata;
                state.controlledParameters =
                    receivedMapping.controlledParameters;
            }
        }
    });
    builder.addCase(postMapping.rejected, (state, _action) => {
        state.status = RequestStatus.ERROR;
    });
    builder.addCase(postMapping.pending, (state, _action) => {
        state.status = RequestStatus.PENDING;
    });
    builder.addCase(getMappings.fulfilled, (state, action) => {
        state.mappings = action.payload.map(transformMapping);
        state.status = RequestStatus.SUCCESS;
    });
    builder.addCase(getMappings.rejected, (state, _action) => {
        state.status = RequestStatus.ERROR;
    });
    builder.addCase(getMappings.pending, (state, _action) => {
        state.status = RequestStatus.PENDING;
    });
    builder.addCase(deleteMapping.fulfilled, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        const name = action.payload;
        state.mappings = state.mappings.filter(
            (mapping) => mapping.name !== name
        );
        if (name === state.activeMapping) {
            state.rules = [];
            state.automata = [];
            state.activeMapping = '';
        }
    });
    builder.addCase(deleteMapping.rejected, (state, _action) => {
        state.status = RequestStatus.ERROR;
    });
    builder.addCase(deleteMapping.pending, (state, _action) => {
        state.status = RequestStatus.PENDING;
    });
    builder.addCase(renameMapping.fulfilled, (state, action) => {
        const { oldName, newName } = action.payload;
        const mappingToRename = state.mappings.find(
            (mapping) => mapping.name === oldName
        );
        if (mappingToRename) {
            mappingToRename.name = newName;
        }
        if (state.activeMapping === oldName) {
            state.activeMapping = newName;
        }
        state.status = RequestStatus.SUCCESS;
    });
    builder.addCase(renameMapping.rejected, (state, _action) => {
        state.status = RequestStatus.ERROR;
    });
    builder.addCase(renameMapping.pending, (state, _action) => {
        state.status = RequestStatus.PENDING;
    });
    builder.addCase(copyMapping.fulfilled, (state, action) => {
        const copiedMapping = transformMapping(action.payload);

        state.mappings.push(copiedMapping);
        state.status = RequestStatus.SUCCESS;
    });
    builder.addCase(copyMapping.rejected, (state, _action) => {
        state.status = RequestStatus.ERROR;
    });
    builder.addCase(copyMapping.pending, (state, _action) => {
        state.status = RequestStatus.PENDING;
    });
    builder.addCase(getNetworkMatchesFromRule.fulfilled, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        const { ruleIndex, matchedIds } = action.payload;
        if (ruleIndex === undefined) {
            return;
        }

        const foundRule = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[ruleIndex];
        foundRule.matches = matchedIds;
    });
    builder.addCase(getNetworkMatchesFromRule.rejected, (state, _action) => {
        state.status = RequestStatus.ERROR;
    });
    builder.addCase(getNetworkMatchesFromRule.pending, (state, _action) => {
        state.status = RequestStatus.PENDING;
    });
};

export const MappingSlice = createSlice({
    name: 'Mapping',
    initialState,
    reducers,
    extraReducers,
});

export const MappingReducer = MappingSlice.reducer;
