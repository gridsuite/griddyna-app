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
import { getProperty } from '../../utils/properties';
import { multipleOperands } from '../../constants/operands';
import {
    AutomatonFamily,
    AutomatonProperties,
    EquipmentType,
} from '../../constants/equipmentDefinition';
import {
    checkCompositionArrayValidity,
    convertCompositionArrayToString,
    convertCompositionStringToArray,
    getMaxDepthParentheses,
} from '../../utils/composition';

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
    composition: 'true',
    mappedModel: '',
    setGroup: '',
    filters: [],
    filterCounter: 1,
};

const DEFAULT_AUTOMATON = {
    family: '',
    watchedElement: '',
    model: '',
    setGroup: '',
    properties: [],
};

export const DEFAULT_NAME = 'default';

//utils

const transformMapping = (receivedMapping) => {
    let mapping = _.cloneDeep(receivedMapping);
    mapping.rules = mapping.rules.map((rule) => {
        let filterCounterList = [];
        rule['type'] = rule.equipmentType;
        delete rule.equipmentType;
        rule.filters.forEach((filter) => {
            filterCounterList.push(Number(filter.filterId.slice(6)));
            filter['id'] = filter.filterId;
            delete filter.filterId;
            delete filter.type;
        });
        rule['filterCounter'] =
            filterCounterList.reduce((max, val) => Math.max(max, val), 0) + 1;
        return rule;
    });

    // Avoid versions discrepancies
    if (!mapping['automata']) {
        mapping['automata'] = [];
    } else {
        mapping['automata'] = receivedMapping.automata.map(
            (receivedAutomaton) => {
                const {
                    family,
                    watchedElement,
                    model,
                    setGroup,
                    ...additionalProperties
                } = receivedAutomaton;
                return {
                    family,
                    watchedElement,
                    model,
                    setGroup,
                    properties: Object.keys(additionalProperties).map(
                        (propertyKey) => ({
                            name: propertyKey,
                            value: additionalProperties[propertyKey],
                        })
                    ),
                };
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

// Selectors

export const getSortedRulesNumber = (state) => {
    let sortedRulesNumber = {};
    Object.values(EquipmentType).forEach((type) => {
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
        (state) =>
            filterRulesByType(
                state.mappings.rules,
                state.mappings.filteredRuleType
            ),
        (_state, index) => index,
        (rules, index) => {
            const foundRule = rules[index];
            const { type, composition, mappedModel, setGroup } = foundRule;
            // Filters fetched separately to avoid re-renders
            return {
                type,
                composition,
                mappedModel,
                setGroup,
                filtersNumber: foundRule.filters.length,
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
        (state) =>
            filterRulesByType(
                state.mappings.rules,
                state.mappings.filteredRuleType
            ),
        (_state, indexes) => indexes,
        (rules, indexes) => rules[indexes.rule].filters[indexes.filter]
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

const checkFilterValidity = (filter) =>
    filter.property !== '' && filter.operand !== '' && filter.value !== '';

export const makeIsFilterValid = () =>
    createSelector(
        (state) =>
            filterRulesByType(
                state.mappings.rules,
                state.mappings.filteredRuleType
            ),
        (_state, indexes) => indexes,
        (rules, indexes) =>
            checkFilterValidity(rules[indexes.rule].filters[indexes.filter])
    );

const checkRuleValidity = (rule) => {
    return (
        rule.type !== '' &&
        rule.composition !== '' &&
        rule.mappedModel !== '' &&
        rule.filters.reduce(
            (acc, filter) => acc && checkFilterValidity(filter),
            true
        )
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

const checkAutomatonValidity = (automaton) =>
    automaton.family !== '' &&
    automaton.watchedElement !== '' &&
    automaton.model !== '' &&
    (automaton.properties.length === 0 ||
        automaton.properties.reduce(
            (acc, property) => acc && property.value !== '',
            true
        ));

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
        (_state, index) => index,
        (automata, index) => checkAutomatonValidity(automata[index])
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

        function ignoreFilterCounterRule(rule) {
            const ruleToTest = _.cloneDeep(rule);
            delete ruleToTest.filterCounter;
            return ruleToTest;
        }

        return !(
            _.isEqual(
                activeRules.map(ignoreFilterCounterRule),
                foundMapping.rules.map(ignoreFilterCounterRule)
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

// Reducers

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
            augmentedRule.composition = postProcessComposition(
                rule.composition
            );
            augmentedRule.filters = augmentedRule.filters.map((filter) => ({
                ...filter,
                filterId: filter.id,
                type: getProperty(rule.type, filter.property).type,
            }));
            if (augmentedRule.filters.length === 0) {
                // Even if it should be true anyway, avoid "true && true" in case of filter deletion
                augmentedRule.composition = 'true';
            }
            return augmentedRule;
        });

        const automata =
            name && name !== state?.mappings.activeMapping
                ? state?.mappings.mappings.find(
                      (mapping) => mapping.name === name
                  )?.automata
                : state?.mappings.automata;
        const formattedAutomata = automata.map((automaton) => {
            const { family, watchedElement, model, setGroup, properties } =
                automaton;
            const formattedAutomaton = {
                family,
                watchedElement,
                model,
                setGroup,
            };
            properties.forEach((property) => {
                formattedAutomaton[property.name] = property.value;
            });
            return formattedAutomaton;
        });

        const controlledParameters =
            name && name !== state?.mappings.activeMapping
                ? state?.mappings.mappings.find(
                      (mapping) => mapping.name === name
                  )?.controlledParameters
                : state?.mappings.controlledParameters;

        const response = await mappingsAPI.postMapping(
            mappingName,
            augmentedRules,
            formattedAutomata,
            controlledParameters,
            token
        );
        return response.json();
    }
);

export const getMappings = createAsyncThunk(
    'mappings/get',
    async (_arg, { getState }) => {
        const token = getState()?.user.user?.id_token;
        const response = await mappingsAPI.getMappings(token);
        return response.json();
    }
);

export const deleteMapping = createAsyncThunk(
    'mappings/delete',
    async (mappingName, { getState }) => {
        const token = getState()?.user.user?.id_token;
        const response = await mappingsAPI.deleteMapping(mappingName, token);
        return response.text();
    }
);

export const renameMapping = createAsyncThunk(
    'mappings/rename',
    async ({ nameToReplace, newName }, { getState }) => {
        const token = getState()?.user.user?.id_token;
        const response = await mappingsAPI.renameMapping(
            nameToReplace,
            newName,
            token
        );
        return response.json();
    }
);

export const copyMapping = createAsyncThunk(
    'mappings/copy',
    async ({ originalName, copyName }, { getState }) => {
        const token = getState()?.user.user?.id_token;
        const response = await mappingsAPI.copyMapping(
            originalName,
            copyName,
            token
        );
        return response.json();
    }
);

const reducers = {
    // Active Mapping

    changeFilteredType: (state, action) => {
        const filteredRuleType = action.payload;
        state.filteredRuleType =
            state.filteredRuleType === filteredRuleType ? '' : filteredRuleType;
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
        selectedRule.composition = DEFAULT_RULE.composition;
        selectedRule.filters = DEFAULT_RULE.filters;
        selectedRule.mappedModel = DEFAULT_RULE.mappedModel;
        selectedRule.filterCounter = DEFAULT_RULE.filterCounter;
    },
    changeRuleComposition: (state, action) => {
        const { index, composition } = action.payload;
        filterRulesByType(state.rules, state.filteredRuleType)[
            index
        ].composition = composition;
    },
    changeRuleModel: (state, action) => {
        const { index, mappedModel } = action.payload;
        filterRulesByType(state.rules, state.filteredRuleType)[
            index
        ].mappedModel = mappedModel;
    },
    changeRuleParameters: (state, action) => {
        const { index, parameters } = action.payload;
        filterRulesByType(state.rules, state.filteredRuleType)[index].setGroup =
            parameters;
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
        const { ruleIndex, groupIndex, groupOperator = '||' } = action.payload;
        const newId = `filter${filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[ruleIndex].filterCounter++}`;
        const newFilter = {
            id: newId,
            property: '',
            operand: '',
            value: '',
        };
        const selectedRule = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[ruleIndex];
        selectedRule.filters.push(newFilter);
        if (groupIndex !== undefined) {
            try {
                const newCompositionArray = convertCompositionStringToArray(
                    selectedRule.composition
                );
                newCompositionArray[groupIndex].push(groupOperator);
                newCompositionArray[groupIndex].push(newId);
                const newComposition =
                    convertCompositionArrayToString(newCompositionArray);
                selectedRule.composition = newComposition;
            } catch (e) {
                console.error(e);
            }
        } else {
            selectedRule.composition =
                selectedRule.filters.length === 1
                    ? newId
                    : `${selectedRule.composition} && ${newId}`;
        }
    },
    changeFilterProperty: (state, action) => {
        const { ruleIndex, filterIndex, property } = action.payload;
        const modifiedFilter = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[ruleIndex].filters[filterIndex];
        modifiedFilter.property = property;
        modifiedFilter.operand = '';
        modifiedFilter.value = '';
    },
    changeFilterOperand: (state, action) => {
        const { ruleIndex, filterIndex, operand } = action.payload;
        const modifiedFilter = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[ruleIndex].filters[filterIndex];
        const multiple = multipleOperands.includes(operand);
        modifiedFilter.operand = operand;
        modifiedFilter.value = multiple ? [] : '';
    },
    changeFilterValue: (state, action) => {
        const { ruleIndex, filterIndex, value } = action.payload;
        const modifiedFilter = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[ruleIndex].filters[filterIndex];
        modifiedFilter.value = value;
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
        selectedAutomaton.watchedElement = DEFAULT_AUTOMATON.watchedElement;
        selectedAutomaton.properties = Object.keys(
            AutomatonProperties[family] ?? {}
        ).map((propertyName) => ({
            name: propertyName,
            value: '',
        }));
    },
    changeAutomatonModel: (state, action) => {
        const { index, model } = action.payload;
        const selectedAutomaton = filterAutomataByFamily(
            state.automata,
            state.filteredAutomatonFamily
        )[index];
        selectedAutomaton.model = model;
    },
    changeAutomatonParameters: (state, action) => {
        const { index, parameters } = action.payload;
        const selectedAutomaton = filterAutomataByFamily(
            state.automata,
            state.filteredAutomatonFamily
        )[index];
        selectedAutomaton.setGroup = parameters;
    },
    changeAutomatonWatchedElement: (state, action) => {
        const { index, watchedElement } = action.payload;
        const selectedAutomaton = filterAutomataByFamily(
            state.automata,
            state.filteredAutomatonFamily
        )[index];
        selectedAutomaton.watchedElement = watchedElement;
    },
    changeAutomatonPropertyValue: (state, action) => {
        const { index, property } = action.payload;
        const selectedAutomaton = filterAutomataByFamily(
            state.automata,
            state.filteredAutomatonFamily
        )[index];
        const modifiedProperty = selectedAutomaton.properties.find(
            (automatonProperty) => automatonProperty.name === property.name
        );
        if (modifiedProperty) {
            modifiedProperty.value = property.value;
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

const extraReducers = {
    [postMapping.fulfilled]: (state, action) => {
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
    },
    [postMapping.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [postMapping.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
    [getMappings.fulfilled]: (state, action) => {
        state.mappings = action.payload.map(transformMapping);
        state.status = RequestStatus.SUCCESS;
    },
    [getMappings.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [getMappings.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
    [deleteMapping.fulfilled]: (state, action) => {
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
    },
    [deleteMapping.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [deleteMapping.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
    [renameMapping.fulfilled]: (state, action) => {
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
    },
    [renameMapping.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [renameMapping.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
    [copyMapping.fulfilled]: (state, action) => {
        const copiedMapping = transformMapping(action.payload);

        state.mappings.push(copiedMapping);
        state.status = RequestStatus.SUCCESS;
    },
    [copyMapping.rejected]: (state, _action) => {
        state.status = RequestStatus.ERROR;
    },
    [copyMapping.pending]: (state, _action) => {
        state.status = RequestStatus.PENDING;
    },
};

export const MappingSlice = createSlice({
    name: 'Mapping',
    initialState,
    reducers,
    extraReducers,
});

export const MappingReducer = MappingSlice.reducer;
