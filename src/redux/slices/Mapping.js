/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSelector, createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as mappingsAPI from '../../rest/mappingsAPI';
import * as _ from 'lodash';
import RequestStatus from '../../constants/RequestStatus';
import { getProperty } from '../../utils/properties';
import { multipleOperands } from '../../constants/operands';
import { EquipmentType } from '../../constants/equipmentDefinition';

const initialState = {
    mappings: [],
    activeMapping: '',
    rules: [],
    status: RequestStatus.IDLE,
    filteredType: '',
};

const DEFAULT_RULE = {
    type: '',
    composition: 'true',
    mappedModel: '',
    filters: [],
    filterCounter: 1,
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

    return mapping;
};

const filterRulesByType = (rules, type) =>
    rules.filter(
        (rule) => type === '' || rule.type === '' || rule.type === type
    );

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
            state.mappings.filteredType === '' ||
            rule.type === '' ||
            rule.type === state.mappings.filteredType
    ).length;

export const makeGetRule = () =>
    createSelector(
        (state) =>
            filterRulesByType(
                state.mappings.rules,
                state.mappings.filteredType
            ),
        (_state, index) => index,
        (rules, index) => {
            const foundRule = rules[index];
            const { type, composition, mappedModel } = foundRule;
            // Filters fetched separately to avoid re-renders
            return {
                type,
                composition,
                mappedModel,
                filtersNumber: foundRule.filters.length,
            };
        }
    );

export const makeGetFilter = () =>
    createSelector(
        (state) =>
            filterRulesByType(
                state.mappings.rules,
                state.mappings.filteredType
            ),
        (_state, indexes) => indexes,
        (rules, indexes) => rules[indexes.rule].filters[indexes.filter]
    );

const checkFilterValidity = (filter) =>
    filter.property !== '' && filter.operand !== '' && filter.value !== '';

export const makeIsFilterValid = () =>
    createSelector(
        (state) =>
            filterRulesByType(
                state.mappings.rules,
                state.mappings.filteredType
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
export const makeIsRuleValid = () =>
    createSelector(
        (state) =>
            filterRulesByType(
                state.mappings.rules,
                state.mappings.filteredType
            ),
        (_state, index) => index,
        (rules, index) => checkRuleValidity(rules[index])
    );

export const isMappingValid = createSelector(
    (state) => state.mappings.activeMapping,
    (state) => state.mappings.rules,
    (name, rules) =>
        name !== '' &&
        rules.reduce((acc, rule) => acc && checkRuleValidity(rule), true)
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
    (state) => state.mappings.rules,
    (state) => state.mappings.mappings,
    (activeName, activeRules, savedMappings) => {
        const foundMapping = savedMappings.find(
            (mapping) => mapping.name === activeName
        );
        function ignoreFilterCounterRule(rule) {
            const ruleToTest = _.cloneDeep(rule);
            delete ruleToTest.filterCounter;
            return ruleToTest;
        }
        return !_.isEqual(
            activeRules.map(ignoreFilterCounterRule),
            foundMapping.rules.map(ignoreFilterCounterRule)
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
        const response = await mappingsAPI.postMapping(
            mappingName,
            augmentedRules,
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
        const filteredType = action.payload;
        state.filteredType =
            state.filteredType === filteredType ? '' : filteredType;
    },
    addRule: (state) => {
        const newRule = _.cloneDeep(DEFAULT_RULE);
        newRule.type = state.filteredType;
        state.rules.push(newRule);
    },
    changeRuleType: (state, action) => {
        const { index, equipmentType } = action.payload;
        const selectedRule = filterRulesByType(state.rules, state.filteredType)[
            index
        ];
        selectedRule.type = equipmentType;
        selectedRule.composition = DEFAULT_RULE.composition;
        selectedRule.filters = DEFAULT_RULE.filters;
        selectedRule.mappedModel = DEFAULT_RULE.mappedModel;
        selectedRule.filterCounter = DEFAULT_RULE.filterCounter;
    },
    changeRuleComposition: (state, action) => {
        const { index, composition } = action.payload;
        filterRulesByType(state.rules, state.filteredType)[index].composition =
            composition;
    },
    changeRuleModel: (state, action) => {
        const { index, mappedModel } = action.payload;
        filterRulesByType(state.rules, state.filteredType)[index].mappedModel =
            mappedModel;
    },
    addFilter: (state, action) => {
        const { index } = action.payload;
        const newId = `filter${filterRulesByType(
            state.rules,
            state.filteredType
        )[index].filterCounter++}`;
        const newFilter = {
            id: newId,
            property: '',
            operand: '',
            value: '',
        };
        const selectedRule = filterRulesByType(state.rules, state.filteredType)[
            index
        ];
        selectedRule.filters.push(newFilter);
        selectedRule.composition =
            selectedRule.filters.length === 1
                ? newId
                : `${selectedRule.composition} &&  ${newId}`;
    },
    changeFilterProperty: (state, action) => {
        const { ruleIndex, filterIndex, property } = action.payload;
        const modifiedFilter = filterRulesByType(
            state.rules,
            state.filteredType
        )[ruleIndex].filters[filterIndex];
        modifiedFilter.property = property;
        modifiedFilter.operand = '';
        modifiedFilter.value = '';
    },
    changeFilterOperand: (state, action) => {
        const { ruleIndex, filterIndex, operand } = action.payload;
        const modifiedFilter = filterRulesByType(
            state.rules,
            state.filteredType
        )[ruleIndex].filters[filterIndex];
        const multiple = multipleOperands.includes(operand);
        modifiedFilter.operand = operand;
        modifiedFilter.value = multiple ? [] : '';
    },
    changeFilterValue: (state, action) => {
        const { ruleIndex, filterIndex, value } = action.payload;
        const modifiedFilter = filterRulesByType(
            state.rules,
            state.filteredType
        )[ruleIndex].filters[filterIndex];
        modifiedFilter.value = value;
    },
    deleteFilter: (state, action) => {
        const { ruleIndex, filterIndex } = action.payload;
        const ruleToModify = filterRulesByType(state.rules, state.filteredType)[
            ruleIndex
        ];
        const filterIdToDelete = ruleToModify.filters[filterIndex].id;
        const newFilters = ruleToModify.filters.filter(
            (value, index) => index !== filterIndex
        );
        ruleToModify.filters = newFilters;
        ruleToModify.composition = ruleToModify.composition.replaceAll(
            filterIdToDelete,
            'true'
        );
    },
    copyFilter: (state, action) => {
        const { ruleIndex, filterIndex } = action.payload;
        const selectedRule = filterRulesByType(state.rules, state.filteredType)[
            ruleIndex
        ];
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
    // Mappings
    createMapping: (state, _action) => {
        const mappings = state.mappings;
        if (canCreateNewMappingCheck(mappings)) {
            mappings.push({
                name: DEFAULT_NAME,
                rules: [],
            });
            state.activeMapping = DEFAULT_NAME;
            state.rules = [];
        }
    },
    selectMapping: (state, action) => {
        const { name } = action.payload;
        const mappingToUse = state.mappings.find(
            (mapping) => mapping.name === name
        );
        if (mappingToUse) {
            state.rules = mappingToUse.rules;
            state.activeMapping = name;
        }
    },
    deselectMapping: (state, _action) => {
        state.rules = [];
        state.activeMapping = '';
    },
};

const extraReducers = {
    [postMapping.fulfilled]: (state, action) => {
        state.status = RequestStatus.SUCCESS;
        const receivedMapping = transformMapping(action.payload);
        const foundMapping = state.mappings.find(
            (script) => script.name === receivedMapping.name
        );
        if (foundMapping) {
            foundMapping.rules = receivedMapping.rules;
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
