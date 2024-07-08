/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getActiveMapping,
    getFilteredRuleType,
    makeChangeFilterValueThenGetNetworkMatches,
    makeGetFilter,
    makeGetIsFilterValid,
    MappingSlice,
} from '../redux/slices/Mapping';
import Filter from '../components/3-organisms/Filter';
import PropTypes from 'prop-types';
import {
    CustomFormProvider,
    EXPERT_FILTER_QUERY,
    yup,
} from '@gridsuite/commons-ui';
import useDataForm from '../hooks/react-hook-form/form/useDataForm';

// we do not need detail schema with all validation test for rqb filter
// the test in done in the redux layer by selectors isValidXXX
const filterFormSchema = yup
    .object()
    .shape({
        [EXPERT_FILTER_QUERY]: yup.object(),
    })
    .required();

const FilterContainer = ({ ruleIndex, equipmentType }) => {
    // Data
    const getFilter = useMemo(makeGetFilter, []);
    const filter = useSelector((state) => getFilter(state, ruleIndex));

    const { rules: query } = filter ?? {};

    const filteredRuleType = useSelector(getFilteredRuleType);
    const activeMapping = useSelector(getActiveMapping);

    const isFilterValid = useMemo(makeGetIsFilterValid, []);
    const isValid = useSelector((state) => isFilterValid(state, ruleIndex));

    // Actions
    const dispatch = useDispatch();

    const newFilter = useCallback(
        () =>
            dispatch(
                MappingSlice.actions.newFilter({
                    ruleIndex,
                })
            ),
        [dispatch, ruleIndex]
    );

    const deleteFilter = useCallback(
        () =>
            dispatch(
                MappingSlice.actions.deleteFilter({
                    ruleIndex,
                })
            ),
        [dispatch, ruleIndex]
    );

    const changeFilterValueThenGetNetworkMatches = useMemo(
        makeChangeFilterValueThenGetNetworkMatches,
        []
    );
    const onFormValid = useCallback(
        (formData) => {
            const newQuery = formData[EXPERT_FILTER_QUERY];
            dispatch(
                changeFilterValueThenGetNetworkMatches({
                    ruleIndex,
                    value: newQuery,
                })
            );
        },
        [dispatch, ruleIndex, changeFilterValueThenGetNetworkMatches]
    );

    // RHF
    const { initialized, formMethods } = useDataForm(
        filterFormSchema,
        {
            [EXPERT_FILTER_QUERY]: query,
        },
        [activeMapping, filteredRuleType], // only reset form when mapping or type changed
        onFormValid,
        undefined
    );

    return (
        <CustomFormProvider
            {...formMethods}
            validationSchema={filterFormSchema}
            removeOptional
        >
            {initialized && (
                <Filter
                    isValid={isValid}
                    equipmentType={equipmentType}
                    newFilter={newFilter}
                    deleteFilter={deleteFilter}
                    hasFilter={!!filter}
                />
            )}
        </CustomFormProvider>
    );
};

FilterContainer.propTypes = {
    ruleIndex: PropTypes.number.isRequired,
    equipmentType: PropTypes.string.isRequired,
};

export default FilterContainer;
