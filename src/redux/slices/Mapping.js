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
import * as networkAPI from '../../rest/networkAPI';
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
    mappedModel: '',
    setGroup: '',
    groupType: 'FIXED',
    filter: undefined,
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
        rule['type'] = rule.equipmentType;
        delete rule.equipmentType;
        rule['matches'] = [];
        if (rule.filter) {
            rule['filter']['rules'] = importExpertRules(
                // RQB need an id for each rule/group to avoid re-create a new component
                // even the same input => lost focus while typing
                // This solution can be removed when the back-end returns id persisted for each rule in the db (round-trip)
                enrichIdQuery(rule.filter.rules, false)
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

// Base selectors that used in create selector, must not create new array or object
// in order to make memorization effectively
export const getRules = (state) => state.mappings.rules;
export const getFilteredRuleType = (state) => state.mappings.filteredRuleType;
export const getAutomata = (state) => state.mappings.automata;
export const getFilteredAutomatonFamily = (state) =>
    state.mappings.filteredAutomatonFamily;

// Selectors
export const getGroupedRulesNumber = (state) => {
    const groupedRulesNumber = {};
    RuleEquipmentTypes.forEach((type) => {
        groupedRulesNumber[type] = 0;
    });

    state.mappings.rules.forEach((rule) => {
        if (rule.type !== '') {
            groupedRulesNumber[rule.type]++;
        }
    });
    return groupedRulesNumber;
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

export const getGroupedAutomataNumber = (state) => {
    const groupedAutomataNumber = {};
    Object.values(AutomatonFamily).forEach((family) => {
        groupedAutomataNumber[family] = 0;
    });

    state.mappings.automata.forEach((automaton) => {
        if (automaton.family !== '') {
            groupedAutomataNumber[automaton.family]++;
        }
    });
    return groupedAutomataNumber;
};

export const makeGetRule = () =>
    createSelector(
        getRules,
        getFilteredRuleType,
        (_state, ruleIndex) => ruleIndex,
        (rules, filteredRuleType, ruleIndex) => {
            const filteredRules = filterRulesByType(rules, filteredRuleType);
            const foundRule = filteredRules[ruleIndex];
            const { type, mappedModel, setGroup, groupType, matches } =
                foundRule;
            // Filter fetched separately to avoid re-renders
            return {
                type,
                mappedModel,
                setGroup,
                groupType,
                matches,
                hasFilter: !!foundRule.filter,
            };
        }
    );

export const makeGetAutomaton = () =>
    createSelector(
        getAutomata,
        getFilteredAutomatonFamily,
        (_state, automatonIndex) => automatonIndex,
        (automata, filteredAutomatonFamily, automatonIndex) => {
            const filteredAutomata = filterAutomataByFamily(
                automata,
                filteredAutomatonFamily
            );
            return filteredAutomata[automatonIndex];
        }
    );

export const makeGetFilter = () =>
    createSelector(
        getRules,
        getFilteredRuleType,
        (_state, ruleIndex) => ruleIndex,
        (rules, filteredRuleType, ruleIndex) => {
            const filteredRules = filterRulesByType(rules, filteredRuleType);
            return filteredRules[ruleIndex].filter;
        }
    );

const checkFilterValidity = (filter) => {
    if (!filter) {
        return true;
    }
};
// filter.property !== '' && filter.operafilteredAutomatonFamilynd !== '' && filter.value !== '';

export const makeGetIsFilterValid = () =>
    createSelector(
        getRules,
        getFilteredRuleType,
        (_state, ruleIndex) => ruleIndex,
        (rules, filteredRuleType, ruleIndex) => {
            const filteredRules = filterRulesByType(rules, filteredRuleType);
            return checkFilterValidity(filteredRules[ruleIndex].filter);
        }
    );

const checkRuleValidity = (rule) => {
    return (
        rule.type !== '' &&
        rule.composition !== '' &&
        rule.mappedModel !== '' &&
        rule.setGroup !== '' &&
        rule.groupType !== '' &&
        checkFilterValidity(rule.filter)
    );
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
        getRules,
        getFilteredRuleType,
        (_state, ruleIndex) => ruleIndex,
        (rules, filteredRuleType, ruleIndex) => {
            const filteredRules = filterRulesByType(rules, filteredRuleType);
            return checkRuleValidity(filteredRules[ruleIndex]);
        }
    );

export const isMappingValid = createSelector(
    (state) => state.mappings.activeMapping,
    getRules,
    getAutomata,
    (name, rules, automata) =>
        name !== '' &&
        rules.reduce((acc, rule) => acc && checkRuleValidity(rule), true) &&
        automata.reduce(
            (acc, automaton) => acc && checkAutomatonValidity(automaton),
            true
        )
);

export const makeIsAutomatonValid = () =>
    createSelector(
        getAutomata,
        getFilteredAutomatonFamily,
        (state) => state.models.automatonDefinitions,
        (_state, automatonIndex) => automatonIndex,
        (
            automata,
            filteredAutomatonFamily,
            automatonDefinitions,
            automatonIndex
        ) => {
            const filteredAutomata = filterAutomataByFamily(
                automata,
                filteredAutomatonFamily
            );
            return checkAutomatonValidity(
                filteredAutomata[automatonIndex],
                automatonDefinitions[filteredAutomata[automatonIndex].model]
            );
        }
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
const augmentFilter = (filter, equipmentType) => ({
    ...filter,
    equipmentType: equipmentType,
    type: 'EXPERT',
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

        const augmentedRules = rules.map((rule) => {
            let augmentedRule = _.cloneDeep(rule);
            augmentedRule.equipmentType = rule.type.toUpperCase();

            if (augmentedRule.filter) {
                augmentedRule.filter = augmentFilter(
                    augmentedRule.filter,
                    augmentedRule.equipmentType
                );
            }

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
            equipmentType: foundRule.type,
            filter: augmentFilter(foundRule.filter, foundRule.type),
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
    const getIsFilterValid = makeGetIsFilterValid();

    return ({ ruleIndex, value }) => {
        return (dispatch, getState) => {
            dispatch(
                MappingSlice.actions.changeFilterQuery({
                    ruleIndex,
                    value,
                })
            );

            // --- Fail-fast check conditions to fire the next action --- //
            const state = getState();

            // network should be attached
            if (!state?.network.currentNetwork) {
                return;
            }

            // filter in the rule must be valid
            const isFilterValid = getIsFilterValid(state, ruleIndex);
            if (!isFilterValid) {
                return;
            }

            // Other checks can be added to avoid unnecessary async dispatch

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

        // unset id for rule
        ruleToCopy.id = undefined;
        // if filter exists must unset filter id and provide all new ids for rule/group inside the filter
        if (ruleToCopy.filter?.id) {
            ruleToCopy.filter.id = undefined;
            // force set new ids for the whole query
            enrichIdQuery(ruleToCopy.filter.rules, true);
        }
        state.rules.push(ruleToCopy);
    },
    // Filter
    newFilter: (state, action) => {
        const { ruleIndex } = action.payload;

        // create an empty expert filter
        const newFilter = getExpertFilterEmptyFormData();

        const selectedRule = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[ruleIndex];
        selectedRule.matches = DEFAULT_RULE.matches;
        selectedRule.filter = newFilter;
    },
    changeFilterQuery: (state, action) => {
        const { ruleIndex, value } = action.payload;
        const modifiedFilter = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[ruleIndex].filter;
        console.log('ChangeFilterValue', { value });
        modifiedFilter.rules = value;
    },
    deleteFilter: (state, action) => {
        const { ruleIndex } = action.payload;
        const ruleToModify = filterRulesByType(
            state.rules,
            state.filteredRuleType
        )[ruleIndex];
        ruleToModify.filter = undefined;
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
