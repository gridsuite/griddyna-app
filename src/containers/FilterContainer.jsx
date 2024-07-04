/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    makeChangeFilterValueThenGetNetworkMatches,
    makeGetFilter,
    makeGetIsFilterValid,
} from '../redux/slices/Mapping';
import Filter from '../components/3-organisms/Filter';
import PropTypes from 'prop-types';
import {
    CustomFormProvider,
    EXPERT_FILTER_QUERY,
    EXPERT_FILTER_SCHEMA,
    yup,
} from '@gridsuite/commons-ui';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useFormChange from '../hooks/useFormChange';
import useFormUpdate from '../hooks/useFormUpdate';

const filterFormSchema = yup
    .object()
    .shape({
        ...EXPERT_FILTER_SCHEMA,
    })
    .required();

const FilterContainer = ({ ruleIndex, equipmentType }) => {
    // Data
    const getFilter = useMemo(makeGetFilter, []);
    const filter = useSelector((state) => getFilter(state, ruleIndex));

    const isFilterValid = useMemo(makeGetIsFilterValid, []);
    const isValid = useSelector((state) => isFilterValid(state, ruleIndex));

    // Actions
    const dispatch = useDispatch();

    const changeFilterValueThenGetNetworkMatches = useMemo(
        makeChangeFilterValueThenGetNetworkMatches,
        []
    );

    const formMethods = useForm({
        resolver: yupResolver(filterFormSchema),
    });

    const {
        formState: { errors },
    } = formMethods;

    const isValidating = errors.root?.isValidating;

    const setValue = useCallback(
        (formData) => {
            const rqbQuery = formData[EXPERT_FILTER_QUERY];
            dispatch(
                changeFilterValueThenGetNetworkMatches({
                    ruleIndex,
                    value: rqbQuery,
                })
            );
        },
        [dispatch, ruleIndex, changeFilterValueThenGetNetworkMatches]
    );

    useFormChange(formMethods, setValue);

    useFormUpdate(formMethods, filter);

    return (
        <CustomFormProvider
            {...formMethods}
            validationSchema={filterFormSchema}
        >
            <Filter isValid={isValid} equipmentType={equipmentType} />
        </CustomFormProvider>
    );
};

FilterContainer.propTypes = {
    ruleIndex: PropTypes.number.isRequired,
    equipmentType: PropTypes.string.isRequired,
};

export default FilterContainer;
