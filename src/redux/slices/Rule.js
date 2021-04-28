import { createSelector, createSlice } from '@reduxjs/toolkit';
import { EnumOperands } from '../../constants/operands';

const initialState = {
    rules: [], // if alone, state as array directly
};

const DEFAULT_RULE = {
    type: '',
    composition: '',
    mappedModel: '',
    filters: [],
    filterCounter: 1,
};

// Selectors

export const getRulesNumber = (state) => state.rules.rules.length;

export const makeGetRule = () =>
    createSelector(
        (state) => state.rules.rules,
        (_, index) => index,
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
        (state) => state.rules.rules,
        (_, indexes) => indexes,
        (rules, indexes) => rules[indexes.rule].filters[indexes.filter]
    );

//// makeGetFilterValidity(ruleIndex,filterIndex)

//// makeGetRuleValidity(index)

// Reducers

const reducers = {
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
};

const extraReducers = {
    /* TODO
    [SAVE_MAPPING]
    [DELETE_MAPPING]
    [EXPORT_SCRIPT]
    [EXPORT_MAPPING]
     */
};

export const RuleSlice = createSlice({
    name: 'Rule',
    initialState,
    reducers,
    extraReducers,
});

export const RuleReducer = RuleSlice.reducer;
