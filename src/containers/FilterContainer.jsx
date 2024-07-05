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
    QUERY_TEST,
    yup,
} from '@gridsuite/commons-ui';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useFormOnInit from '../hooks/useFormOnInit';
import useFormOnChange from '../hooks/useFormOnChange';

const filterFormSchema = yup
    .object()
    .shape({
        [EXPERT_FILTER_QUERY]: QUERY_TEST,
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
    const onQueryValid = useCallback(
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

    const onQueryInvalid = useCallback(
        (errors) => {
            dispatch(
                MappingSlice.actions.setFilterError({ ruleIndex, errors })
            );
        },
        [dispatch, ruleIndex]
    );

    // RHF
    const formMethods = useForm({
        resolver: yupResolver(filterFormSchema),
    });
    const { handleSubmit } = formMethods;

    useFormOnInit(formMethods, { [EXPERT_FILTER_QUERY]: query }, [
        filteredRuleType,
        activeMapping,
    ]);

    useFormOnChange(formMethods, onQueryValid, onQueryInvalid);

    return (
        <CustomFormProvider
            {...formMethods}
            validationSchema={filterFormSchema}
            removeOptional
        >
            <Filter
                isValid={isValid}
                equipmentType={equipmentType}
                newFilter={newFilter}
                validateFilter={handleSubmit(onQueryValid, onQueryInvalid)}
                deleteFilter={deleteFilter}
                hasFilter={!!filter}
            />
        </CustomFormProvider>
    );
};

FilterContainer.propTypes = {
    ruleIndex: PropTypes.number.isRequired,
    equipmentType: PropTypes.string.isRequired,
};

export default FilterContainer;
