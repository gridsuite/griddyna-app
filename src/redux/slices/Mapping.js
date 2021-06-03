/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSelector, createSlice } from '@reduxjs/toolkit';
import { EnumOperands } from '../../constants/operands';
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as mappingsAPI from '../../rest/mappingsAPI';
import * as _ from 'lodash';
import RequestStatus from '../../constants/RequestStatus';
import { getProperty } from '../../utils/properties';
const initialState = {
    mappings: [],
    activeMapping: '',
    rules: [],
    status: RequestStatus.IDLE,
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

// Selectors

export const getRulesNumber = (state) => state.mappings.rules.length;

export const makeGetRule = () =>
    createSelector(
        (state) => state.mappings.rules,
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
        (state) => state.mappings.rules,
        (_state, indexes) => indexes,
        (rules, indexes) => rules[indexes.rule].filters[indexes.filter]
    );

const checkFilterValidity = (filter) =>
    filter.property !== '' && filter.operand !== '' && filter.value !== '';

export const makeIsFilterValid = () =>
    createSelector(
        (state) => state.mappings.rules,
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
        (state) => state.mappings.rules,
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
            augmentedRules
        );
        return response.json();
    }
);

export const getMappings = createAsyncThunk('mappings/get', async (_arg) => {
    const response = await mappingsAPI.getMappings();
    return response.json();
});

export const deleteMapping = createAsyncThunk(
    'mappings/delete',
    async (mappingName) => {
        const response = await mappingsAPI.deleteMapping(mappingName);
        return response.text();
    }
);

export const renameMapping = createAsyncThunk(
    'mappings/rename',
    async ({ nameToReplace, newName }) => {
        const response = await mappingsAPI.renameMapping(
            nameToReplace,
            newName
        );
        return response.json();
    }
);

export const copyMapping = createAsyncThunk(
    'mappings/copy',
    async ({ originalName, copyName }) => {
        const response = await mappingsAPI.copyMapping(originalName, copyName);
        return response.json();
    }
);

const reducers = {
    // Active Mapping

    addRule: (state) => {
        state.rules.push(DEFAULT_RULE);
    },
    changeRuleType: (state, action) => {
        const { index, equipmentType } = action.payload;
        state.rules[index] = {
            ...DEFAULT_RULE,
            type: equipmentType,
        };
    },
    changeRuleComposition: (state, action) => {
        const { index, composition } = action.payload;
        state.rules[index].composition = composition;
    },
    changeRuleModel: (state, action) => {
        const { index, mappedModel } = action.payload;
        state.rules[index].mappedModel = mappedModel;
    },
    addFilter: (state, action) => {
        const { index } = action.payload;
        const newId = `filter${state.rules[index].filterCounter++}`;
        const newFilter = {
            id: newId,
            property: '',
            operand: '',
            value: '',
        };
        const selectedRule = state.rules[index];
        selectedRule.filters.push(newFilter);
        selectedRule.composition =
            selectedRule.filters.length === 1
                ? newId
                : `${selectedRule.composition} &&  ${newId}`;
    },
    changeFilterProperty: (state, action) => {
        const { ruleIndex, filterIndex, property } = action.payload;
        const modifiedFilter = state.rules[ruleIndex].filters[filterIndex];
        modifiedFilter.property = property;
        modifiedFilter.operand = '';
        modifiedFilter.value = '';
    },
    changeFilterOperand: (state, action) => {
        const { ruleIndex, filterIndex, operand } = action.payload;
        const modifiedFilter = state.rules[ruleIndex].filters[filterIndex];
        const multiple = [EnumOperands.IN, EnumOperands.NOT_IN].includes(
            operand
        );
        modifiedFilter.operand = operand;
        modifiedFilter.value = multiple ? [] : '';
    },
    changeFilterValue: (state, action) => {
        const { ruleIndex, filterIndex, value } = action.payload;
        const modifiedFilter = state.rules[ruleIndex].filters[filterIndex];
        modifiedFilter.value = value;
    },
    deleteFilter: (state, action) => {
        const { ruleIndex, filterIndex } = action.payload;
        const ruleToModify = state.rules[ruleIndex];
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
        let filters = state.rules[ruleIndex].filters;
        const filterToCopy = _.cloneDeep(filters[filterIndex]);
        const newId = `filter${state.rules[ruleIndex].filterCounter++}`;
        filterToCopy.id = newId;
        const selectedRule = state.rules[ruleIndex];
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
    renameDefault: (state, action) => {
        const newName = action.payload;
        const foundDefaultMapping = state.mappings.find(
            (mapping) => mapping.name === DEFAULT_NAME
        );
        foundDefaultMapping.name = newName;
        if (state.activeMapping === DEFAULT_NAME) {
            state.activeMapping = newName;
        }
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
