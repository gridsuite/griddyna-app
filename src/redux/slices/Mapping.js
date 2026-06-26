/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { formatQuery } from 'react-querybuilder';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import * as mappingsAPI from '../../rest/mappingsAPI';
import * as _ from 'lodash';
import RequestStatus from '../../constants/RequestStatus';
import * as networkAPI from '../../rest/networkAPI';
import { AutomatonFamily } from '../../constants/automatonDefinition';
import { RuleEquipmentTypes } from '../../constants/equipmentType';
import {
    expertFilterSchema,
    exportExpertRules,
    getExpertFilterEmptyFormData,
    importExpertRules,
} from '@gridsuite/commons-ui';
import { v4 as uuid4 } from 'uuid';
import { enrichIdRqbQuery } from '../../utils/rqb-utils';
import { assignArray } from '../../utils/functions';
import { downloadBlob, extractFilename, readFileAsText } from '../../utils/file-utils.ts';
import { OperationType } from '../../utils/types.ts';

const initialState = {
    mappings: [],
    activeMapping: '',
    rules: [],
    automata: [],
    status: RequestStatus.IDLE,
    filteredRuleType: '',
    filteredAutomatonFamily: '',
    controlledParameters: false,
    exportError: null,
    addError: null,
};

const DEFAULT_RULE = {
    id: undefined,
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

// rules are matched by id
const ruleMatcher = (rule1) => (rule2) => rule1?.id === rule2?.id;

const transformMapping = (receivedMapping) => {
    const mapping = _.cloneDeep(receivedMapping);
    mapping.rules = mapping.rules.map((rule) => {
        rule['type'] = rule.equipmentType;
        delete rule.equipmentType;
        rule['matches'] = [];
        if (rule.filter) {
            rule['filter']['rules'] = importExpertRules(
                // SOLUTION 1 : CustomReactQueryBuilder mounted BEFORE first reset rhf form =>
                // Need to provide id for each rule/group to avoid re-create new components in controlled mode
                // which lead to lost focus while typing in rqb value editor
                // enrichIdRqbQuery(rule.filter.rules, false)

                // SOLUTION 2 : CustomReactQueryBuilder mounted AFTER first reset rhf form =>
                // Do not need to provide id for each rule/group, QueryBuilder will provide ids while initializing
                rule.filter.rules

                // SOLUTION 3 : CustomReactQueryBuilder mounted BEFORE first reset rhf form
                // Return persisted ids of each rule/group from the backend
            );
        }
        return rule;
    });

    // Avoid versions discrepancies
    if (!mapping['automata']) {
        mapping['automata'] = [];
    } else {
        mapping['automata'] = receivedMapping.automata.map((receivedAutomaton) => {
            const { family, model, setGroup, properties } = receivedAutomaton;

            return {
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
        });
    }

    return mapping;
};

const filterRulesByType = (rules, type) =>
    rules.filter((rule) => type === '' || rule.type === '' || rule.type === type);

const filterAutomataByFamily = (automata, family) =>
    automata.filter((automaton) => family === '' || automaton.family === '' || automaton.family === family);

// Base selectors that used in create selector, IMPORTANT base selectors must not create new array or object
// in order to make memorization effectively
export const getRules = (state) => state.mappings.rules;
export const getFilteredRuleType = (state) => state.mappings.filteredRuleType;
export const getAutomata = (state) => state.mappings.automata;
export const getFilteredAutomatonFamily = (state) => state.mappings.filteredAutomatonFamily;

// Selectors
export const getGroupedRulesNumber = createSelector(getRules, (rules) => {
    const groupedRulesNumber = {};
    RuleEquipmentTypes.forEach((type) => {
        groupedRulesNumber[type] = 0;
    });

    rules.forEach((rule) => {
        if (rule.type !== '') {
            groupedRulesNumber[rule.type] += 1;
        }
    });
    return groupedRulesNumber;
});

export const getRulesNumber = createSelector(getRules, getFilteredRuleType, (rules, filteredRuleType) => {
    return rules.filter((rule) => filteredRuleType === '' || rule.type === '' || rule.type === filteredRuleType).length;
});

export const getAutomataNumber = createSelector(
    getAutomata,
    getFilteredAutomatonFamily,
    (automata, filteredAutomatonFamily) => {
        return automata.filter(
            (automaton) =>
                filteredAutomatonFamily === '' ||
                automaton.family === '' ||
                automaton.family === filteredAutomatonFamily
        ).length;
    }
);

export const getGroupedAutomataNumber = createSelector(getAutomata, (automata) => {
    const groupedAutomataNumber = {};
    Object.values(AutomatonFamily).forEach((family) => {
        groupedAutomataNumber[family] = 0;
    });

    automata.forEach((automaton) => {
        if (automaton.family !== '') {
            groupedAutomataNumber[automaton.family] += 1;
        }
    });
    return groupedAutomataNumber;
});

export const makeGetRule = () =>
    createSelector(
        getRules,
        getFilteredRuleType,
        (_state, ruleIndex) => ruleIndex,
        (rules, filteredRuleType, ruleIndex) => {
            const filteredRules = filterRulesByType(rules, filteredRuleType);
            const foundRule = filteredRules[ruleIndex];
            const { type, mappedModel, setGroup, groupType, matches } = foundRule;
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
            const filteredAutomata = filterAutomataByFamily(automata, filteredAutomatonFamily);
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

const checkFilterValidity = (filter, isLast) => {
    if (!filter) {
        // only last rule allows empty filter
        return !!isLast;
    }
    const isQueryExist = !_.isEmpty(filter.rules);
    const isQueryValid = isQueryExist && expertFilterSchema.rules.isValidSync(filter.rules);
    return isQueryValid;
};

export const makeGetIsFilterValid = () =>
    createSelector(
        getRules,
        getFilteredRuleType,
        (_state, ruleIndex) => ruleIndex,
        (rules, filteredRuleType, ruleIndex) => {
            const filteredRules = filterRulesByType(rules, filteredRuleType);
            return checkFilterValidity(
                filteredRules[ruleIndex].filter,
                filteredRules.length && ruleIndex === filteredRules.length - 1
            );
        }
    );

const checkRuleValidity = (rule, isLast) => {
    return (
        !!rule.type &&
        !!rule.mappedModel &&
        !!rule.setGroup &&
        !!rule.groupType &&
        checkFilterValidity(rule.filter, isLast)
    );
};

const checkAutomatonValidity = (automaton, automatonDefinition = {}) => {
    const result =
        !!automaton.family &&
        !!automaton.model &&
        !!automaton.setGroup &&
        // check empty
        Object.keys(automatonDefinition).reduce(
            (acc, propertyName) =>
                acc &&
                (automatonDefinition[propertyName].isRequired
                    ? !!automaton.properties.find((elem) => elem.name === propertyName)?.value
                    : true),
            true
        );
    return result;
};

const indexingRuleByType = (rules) => {
    return rules.reduce((accMap, rule) => {
        if (!accMap[rule.type]) {
            accMap[rule.type] = [];
        }
        accMap[rule.type].push(rule);
        return accMap;
    }, {});
};

const indexingAutomatonByFamily = (automata) => {
    return automata.reduce((accMap, automaton) => {
        if (!accMap[automaton.family]) {
            accMap[automaton.family] = [];
        }
        accMap[automaton.family].push(automaton);
        return accMap;
    }, {});
};

const getRuleTabsValid = (rules) => {
    const ruleTabsValidMap = {};
    const rulesByTypeMap = indexingRuleByType(rules);
    Object.keys(rulesByTypeMap).forEach((type) => {
        ruleTabsValidMap[type] = rulesByTypeMap[type].reduce(
            (acc, rule, index, origin) => acc && checkRuleValidity(rule, index === origin.length - 1),
            true
        );
    });
    return ruleTabsValidMap;
};

const getAutomatonTabsValid = (automata, automatonDefinitions) => {
    const automatonTabsValidMap = {};
    const automataByTypeMap = indexingAutomatonByFamily(automata);
    Object.keys(automataByTypeMap).forEach((family) => {
        automatonTabsValidMap[family] = automataByTypeMap[family].reduce(
            (acc, automaton) => acc && checkAutomatonValidity(automaton, automatonDefinitions[automaton.model]),
            true
        );
    });
    return automatonTabsValidMap;
};

export const makeIsRuleValid = () =>
    createSelector(
        getRules,
        getFilteredRuleType,
        (_state, ruleIndex) => ruleIndex,
        (rules, filteredRuleType, ruleIndex) => {
            const filteredRules = filterRulesByType(rules, filteredRuleType);
            return checkRuleValidity(
                filteredRules[ruleIndex],
                filteredRules.length && ruleIndex === filteredRules.length - 1
            );
        }
    );

export const makeIsAutomatonValid = () =>
    createSelector(
        getAutomata,
        getFilteredAutomatonFamily,
        (state) => state.models.automatonDefinitions,
        (_state, automatonIndex) => automatonIndex,
        (automata, filteredAutomatonFamily, automatonDefinitions, automatonIndex) => {
            const filteredAutomata = filterAutomataByFamily(automata, filteredAutomatonFamily);
            return checkAutomatonValidity(
                filteredAutomata[automatonIndex],
                automatonDefinitions[filteredAutomata[automatonIndex].model]
            );
        }
    );

export const ruleTabsValid = createSelector(getRules, (rules) => {
    return getRuleTabsValid(rules);
});

export const automatonTabsValid = createSelector(
    (state) => state.models.automatonDefinitions,
    getAutomata,
    (automatonDefinitions, automata) => {
        return getAutomatonTabsValid(automata, automatonDefinitions);
    }
);
export const isMappingValid = createSelector(
    (state) => state.mappings.activeMapping,
    (state) => state.models.automatonDefinitions,
    getRules,
    getAutomata,
    (id, automatonDefinitions, rules, automata) => {
        const ruleTabsValid = getRuleTabsValid(rules);
        const automatonTabsValid = getAutomatonTabsValid(automata, automatonDefinitions);
        return (
            !!id &&
            Object.keys(ruleTabsValid).reduce((acc, type) => acc && ruleTabsValid[type], true) &&
            Object.keys(automatonTabsValid).reduce((acc, family) => acc && automatonTabsValid[family], true)
        );
    }
);

export const getMappingsInfo = createSelector(
    (state) => state.mappings.mappings,
    (mappings) =>
        mappings.map((mapping) => ({
            name: mapping.name,
            id: mapping.id,
        }))
);

export const activeMappingName = createSelector(
    (state) => state.mappings.activeMapping,
    (state) => state.mappings.mappings,
    (activeMapping, mappings) => {
        const foundMapping = mappings.find((mapping) => mapping.id === activeMapping);
        return foundMapping?.name;
    }
);

export const isModified = createSelector(
    (state) => state.mappings.activeMapping,
    (state) => state.mappings.controlledParameters,
    (state) => state.mappings.rules,
    (state) => state.mappings.automata,
    (state) => state.mappings.mappings,

    (activeMapping, controlledParameters, activeRules, activeAutomata, savedMappings) => {
        const foundMapping = savedMappings.find((mapping) => mapping.id === activeMapping);
        if (!foundMapping) {
            // no longer active mapping
            return false;
        }
        function ignoreInternalProperties(rule) {
            const ruleToTest = _.cloneDeep(rule);

            delete ruleToTest.matches; // ignore matches which is used for matched equipment ids
            delete ruleToTest.filterDirty; // ignore the derived field

            // for filter with rqb query, need to transform to json 'json_without_ids'
            // because the query fetched from back does not contain id in query
            if (rule?.filter?.rules) {
                const queryJson = formatQuery(rule?.filter?.rules, 'json_without_ids');
                delete ruleToTest.filter.rules;
                ruleToTest.filter.queryJson = queryJson;
            }

            return ruleToTest;
        }

        return !(
            _.isEqual(activeRules.map(ignoreInternalProperties), foundMapping.rules.map(ignoreInternalProperties)) &&
            _.isEqual(activeAutomata, foundMapping.automata) &&
            _.isEqual(controlledParameters, foundMapping.controlledParameters)
        );
    }
);

export const getExportError = (state) => state.mappings.exportError;
export const getAddError = (state) => state.mappings.addError;

export const makeGetMatches = () =>
    createSelector(
        getRules,
        getFilteredRuleType,
        (_state, { isRule, index }) => (isRule ? index : -1),
        (rules, filteredRuleType, index) => filterRulesByType(rules, filteredRuleType)[index]?.matches ?? []
    );

// Reducers
const augmentFilter = (filter, equipmentType) => ({
    ...filter,
    equipmentType: equipmentType,
    type: 'EXPERT',
    rules: exportExpertRules(filter.rules),
});
export const updateMapping = createAsyncThunk('mappings/update', async (id, { getState }) => {
    const state = getState();
    const token = state?.user.user?.id_token;
    const mappingId = id ?? state?.mappings.activeMapping;
    const rules =
        id && id !== state?.mappings.activeMapping
            ? state?.mappings.mappings.find((mapping) => mapping.id === id)?.rules
            : state?.mappings.rules;

    const augmentedRules = rules.map((rule) => {
        let augmentedRule = _.cloneDeep(rule);
        augmentedRule.equipmentType = rule.type.toUpperCase();

        if (augmentedRule.filter) {
            augmentedRule.filter = augmentFilter(augmentedRule.filter, augmentedRule.equipmentType);
        }

        delete augmentedRule.matches;
        return augmentedRule;
    });

    const automata =
        id && id !== state?.mappings.activeMapping
            ? state?.mappings.mappings.find((mapping) => mapping.id === id)?.automata
            : state?.mappings.automata;
    const formattedAutomata = automata.map((automaton) => {
        const { family, model, setGroup, properties } = automaton;
        return {
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
    });

    const controlledParameters =
        id && id !== state?.mappings.activeMapping
            ? state?.mappings.mappings.find((mapping) => mapping.id === id)?.controlledParameters
            : state?.mappings.controlledParameters;

    const mapping = {
        rules: augmentedRules,
        automata: formattedAutomata,
        controlledParameters,
    };

    await mappingsAPI.updateMapping(mappingId, mapping, token);

    return await mappingsAPI.getMapping(mappingId, token);
});

export const getMappings = createAsyncThunk('mappings/get', async (_arg, { getState }) => {
    const token = getState()?.user.user?.id_token;
    return await mappingsAPI.getMappings(token);
});

export const deleteMapping = createAsyncThunk('mappings/delete', async (id, { getState }) => {
    const token = getState()?.user.user?.id_token;
    return await mappingsAPI.deleteMapping(id, token).then(() => id);
});

export const renameMapping = createAsyncThunk('mappings/rename', async ({ id, newName }, { getState }) => {
    const token = getState()?.user.user?.id_token;
    await mappingsAPI.renameMapping(id, newName, token);
    return await mappingsAPI.getMapping(id, token);
});

export const copyMapping = createAsyncThunk('mappings/copy', async ({ originalId }, { getState }) => {
    const token = getState()?.user.user?.id_token;
    const newMappingId = await mappingsAPI.copyMapping(originalId, token);
    return await mappingsAPI.getMapping(newMappingId, token);
});

export const exportMapping = createAsyncThunk('mappings/export', async ({ id, name }, { getState }) => {
    const token = getState()?.user.user?.id_token;
    const response = await mappingsAPI.exportMapping(id, name, token);

    const filename = extractFilename(response.headers.get('Content-Disposition'), `dynamic-mapping.json`);

    const blob = await response.blob();
    downloadBlob(blob, filename);

    return filename;
});

export const addMapping = createAsyncThunk(
    'mappings/add',
    async ({ operationType, file, name, description, parentDirectoryUuid }, { getState }) => {
        const token = getState()?.user.user?.id_token;

        let mapping = null;
        if (operationType === OperationType.IMPORT) {
            const mappingJson = await readFileAsText(file);
            mapping = JSON.parse(mappingJson);
        } else {
            // OperationType.NEW => create an empty
            mapping = {
                rules: [],
                automata: [],
                controlledParameters: false,
            };
        }

        const newMappingId = await mappingsAPI.createMapping(name, description, mapping, parentDirectoryUuid, token);

        return await mappingsAPI.getMapping(newMappingId, token);
    }
);
export const getNetworkMatchesFromRule = createAsyncThunk('mappings/matchNetwork', async (ruleIndex, { getState }) => {
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
    return await networkAPI.getNetworkMatchesFromRule(networkId, ruleToMatch, token);
});

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
            if (!state.network.currentNetwork) {
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
        state.filteredRuleType = action.payload;
    },
    changeFilteredFamily: (state, action) => {
        state.filteredAutomatonFamily = action.payload;
    },
    changeControlledParameters: (state) => {
        state.controlledParameters = !state.controlledParameters;
    },
    // Rule
    addRule: (state) => {
        const newRule = _.cloneDeep(DEFAULT_RULE);
        // provide an id for new rule
        newRule.id = uuid4();
        newRule.type = state.filteredRuleType;
        state.rules.push(newRule);
    },
    changeRuleModel: (state, action) => {
        const { index, mappedModel } = action.payload;
        const selectedRule = filterRulesByType(state.rules, state.filteredRuleType)[index];
        selectedRule.mappedModel = mappedModel;
    },
    changeRuleParameters: (state, action) => {
        const { index, parameters, type } = action.payload;
        const selectedRule = filterRulesByType(state.rules, state.filteredRuleType)[index];
        selectedRule.setGroup = parameters;
        selectedRule.groupType = type;
    },
    deleteRule: (state, action) => {
        const { index } = action.payload;
        const ruleToDelete = filterRulesByType(state.rules, state.filteredRuleType)[index];
        state.rules = state.rules.filter((rule) => rule !== ruleToDelete);
    },
    copyRule: (state, action) => {
        const { index } = action.payload;
        const ruleToCopy = _.cloneDeep(filterRulesByType(state.rules, state.filteredRuleType)[index]);

        // force reset rule with new id
        ruleToCopy.id = uuid4();
        // if filter exists must unset filter id and provide all new ids for rule/group inside the filter
        if (ruleToCopy.filter?.id) {
            // force reset filter with new id
            ruleToCopy.filter.id = uuid4();
            // force reset with new ids for the whole query
            enrichIdRqbQuery(ruleToCopy.filter.rules, true);
        }

        state.rules.push(ruleToCopy);
    },
    // Filter
    newFilter: (state, action) => {
        const { ruleIndex } = action.payload;

        // create an empty expert filter
        const newFilter = getExpertFilterEmptyFormData();
        // provide an id for new filter
        newFilter.id = uuid4();

        const selectedRule = filterRulesByType(state.rules, state.filteredRuleType)[ruleIndex];
        selectedRule.matches = DEFAULT_RULE.matches;
        selectedRule.filter = newFilter;
    },
    changeFilterQuery: (state, action) => {
        const { ruleIndex, value: newQuery } = action.payload;
        const modifiedRule = filterRulesByType(state.rules, state.filteredRuleType)[ruleIndex];
        const modifiedFilter = modifiedRule.filter;
        if (modifiedFilter) {
            // set with new query value
            modifiedFilter.rules = newQuery;

            // check whether query is modified by comparing to the query in original rule
            const activeMapping = state.activeMapping;
            const savedMappings = state.mappings;
            const foundMapping = savedMappings.find((mapping) => mapping.id === activeMapping);

            const foundRule = foundMapping.rules?.find((rule) => rule?.filter?.id === modifiedFilter?.id);

            const oldQuery = foundRule?.filter?.rules;
            const isDirty = formatQuery(oldQuery, 'json_without_ids') !== formatQuery(newQuery, 'json_without_ids');
            modifiedRule.filterDirty = isDirty;
        }
    },
    deleteFilter: (state, action) => {
        const { ruleIndex } = action.payload;
        const ruleToModify = filterRulesByType(state.rules, state.filteredRuleType)[ruleIndex];
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
        const selectedAutomaton = filterAutomataByFamily(state.automata, state.filteredAutomatonFamily)[index];
        selectedAutomaton.family = family;
        selectedAutomaton.model = DEFAULT_AUTOMATON.model;
    },
    changeAutomatonModel: (state, action) => {
        const { index, model } = action.payload;
        const selectedAutomaton = filterAutomataByFamily(state.automata, state.filteredAutomatonFamily)[index];
        selectedAutomaton.model = model;

        // clean all others automaton model properties
        selectedAutomaton.setGroup = DEFAULT_AUTOMATON.setGroup;
        selectedAutomaton.properties = [];
    },
    changeAutomatonParameters: (state, action) => {
        const { index, parameters } = action.payload;
        const selectedAutomaton = filterAutomataByFamily(state.automata, state.filteredAutomatonFamily)[index];
        selectedAutomaton.setGroup = parameters;
    },
    changeAutomatonPropertyValue: (state, action) => {
        const { index, property } = action.payload;
        const selectedAutomaton = filterAutomataByFamily(state.automata, state.filteredAutomatonFamily)[index];

        const foundIndex = selectedAutomaton.properties.findIndex((elem) => elem.name === property.name);

        if (foundIndex !== -1) {
            selectedAutomaton.properties[foundIndex].value = property.value;
        } else {
            selectedAutomaton.properties.push({ ...property });
        }
    },
    deleteAutomaton: (state, action) => {
        const { index } = action.payload;
        const automatonToDelete = filterAutomataByFamily(state.automata, state.filteredAutomatonFamily)[index];
        state.automata = state.automata.filter((automaton) => automaton !== automatonToDelete);
    },
    copyAutomaton: (state, action) => {
        const { index } = action.payload;
        const automatonToCopy = _.cloneDeep(
            filterAutomataByFamily(state.automata, state.filteredAutomatonFamily)[index]
        );
        state.automata.push(automatonToCopy);
    },
    selectMapping: (state, action) => {
        const { id } = action.payload;
        const mappingToUse = state.mappings.find((mapping) => mapping.id === id);
        if (mappingToUse) {
            state.rules = mappingToUse.rules;
            state.automata = mappingToUse.automata;
            state.activeMapping = id;
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
    builder.addCase(updateMapping.fulfilled, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        const receivedMapping = transformMapping(action.payload);
        const foundMapping = state.mappings.find((mapping) => mapping.id === receivedMapping.id);
        if (foundMapping) {
            // --- reset the original mapping --- //
            foundMapping.rules = receivedMapping.rules;
            foundMapping.automata = receivedMapping.automata;
            foundMapping.controlledParameters = receivedMapping.controlledParameters;
            if (receivedMapping.id === state.activeMapping) {
                // --- reset the active mapping --- //
                state.rules = assignArray(
                    receivedMapping.rules,
                    state.rules,
                    ruleMatcher,
                    ['matches'] // keep previous matches for active rules when assigning with new received mapping rules
                );
                state.automata = receivedMapping.automata;
                state.controlledParameters = receivedMapping.controlledParameters;
            }
        }
    });
    builder.addCase(updateMapping.rejected, (state, _action) => {
        state.status = RequestStatus.ERROR;
    });
    builder.addCase(updateMapping.pending, (state, _action) => {
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
        const id = action.payload;
        state.mappings = state.mappings.filter((mapping) => mapping.id !== id);
        if (id === state.activeMapping) {
            state.rules = [];
            state.automata = [];
            state.activeMapping = undefined;
        }
    });
    builder.addCase(deleteMapping.rejected, (state, _action) => {
        state.status = RequestStatus.ERROR;
    });
    builder.addCase(deleteMapping.pending, (state, _action) => {
        state.status = RequestStatus.PENDING;
    });
    builder.addCase(renameMapping.fulfilled, (state, action) => {
        const { id, name } = action.payload;
        const mappingToRename = state.mappings.find((mapping) => mapping.id === id);
        if (mappingToRename) {
            mappingToRename.name = name;
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
        const newMapping = transformMapping(action.payload);
        // Add the copied mapping to the list
        state.mappings = [...state.mappings, newMapping];
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

        const foundRule = filterRulesByType(state.rules, state.filteredRuleType)[ruleIndex];
        foundRule.matches = matchedIds;
    });
    builder.addCase(getNetworkMatchesFromRule.rejected, (state, _action) => {
        state.status = RequestStatus.ERROR;
    });
    builder.addCase(getNetworkMatchesFromRule.pending, (state, _action) => {
        state.status = RequestStatus.PENDING;
    });

    // --- exportMapping ---
    builder.addCase(exportMapping.pending, (state) => {
        state.exportError = null;
    });
    builder.addCase(exportMapping.fulfilled, (state) => {
        state.exportError = null;
    });
    builder.addCase(exportMapping.rejected, (state, action) => {
        state.exportError = action.error.message;
    });

    // --- addMapping ---
    builder.addCase(addMapping.pending, (state) => {
        state.addError = null;
    });
    builder.addCase(addMapping.fulfilled, (state, action) => {
        state.addError = null;
        const newMapping = transformMapping(action.payload);
        // Add the new mapping to the list
        state.mappings = [...state.mappings, newMapping];
        // switch to current mapping
        state.activeMapping = newMapping.id;
        state.rules = newMapping.rules;
        state.automata = newMapping.automata;
        state.controlledParameters = newMapping.controlledParameters;
    });
    builder.addCase(addMapping.rejected, (state, action) => {
        state.addError = action.error.message;
    });
};

export const MappingSlice = createSlice({
    name: 'Mapping',
    initialState,
    reducers,
    extraReducers,
});

export const MappingReducer = MappingSlice.reducer;
