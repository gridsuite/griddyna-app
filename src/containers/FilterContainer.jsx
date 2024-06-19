/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    makeChangeFilterValueThenGetNetworkMatches,
    makeGetFilter,
    makeIsFilterValid,
    MappingSlice,
} from '../redux/slices/Mapping';
import Filter from '../components/3-organisms/Filter';
import PropTypes from 'prop-types';
import {
    CustomFormProvider,
    EXPERT_FILTER_QUERY,
    EXPERT_FILTER_SCHEMA,
    importExpertRules,
    yup,
} from '@gridsuite/commons-ui';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const filterFormSchema = yup
    .object()
    .shape({
        ...EXPERT_FILTER_SCHEMA,
    })
    .required();

const FilterContainer = ({ ruleIndex, /*filterIndex,*/ equipmentType }) => {
    // Data
    const getFilter = useMemo(makeGetFilter, []);
    const filter = useSelector((state) =>
        getFilter(state, { rule: ruleIndex /*filter: filterIndex */ })
    );

    console.log('filter', { filter });
    const { id, rules: rootFilterRule } = filter;
    // const fullProperty = equipmentType
    //     ? getProperty(equipmentType, property)
    //     : undefined;

    const isFilterValid = useMemo(makeIsFilterValid, []);
    const isValid = useSelector((state) =>
        isFilterValid(state, { rule: ruleIndex /*filter: filterIndex */ })
    );

    // const getNetworkValues = useMemo(makeGetNetworkValues, []);
    // const networkValues = useSelector((state) =>
    //     getNetworkValues(state, { equipmentType, fullProperty })
    // ).map((value) => ({ label: value.toString(), value }));

    // Actions
    const dispatch = useDispatch();

    const setFilter = (newFilter) =>
        dispatch(
            MappingSlice.actions.changeFilter({
                ruleIndex,
                newFilter,
            })
        );

    // const setProperty = (property) =>
    //     dispatch(
    //         MappingSlice.actions.changeFilterProperty({
    //             ruleIndex,
    //             filterIndex,
    //             property,
    //         })
    //     );

    // const setOperand = (operand) =>
    //     dispatch(
    //         MappingSlice.actions.changeFilterOperand({
    //             ruleIndex,
    //             filterIndex,
    //             operand,
    //         })
    //     );

    // const isUniqueSelectFilter = // is an enum
    //     // operands only allow one string to select
    //     !multipleOperands.includes(operand);

    const changeFilterValueThenGetNetworkMatches = useMemo(
        makeChangeFilterValueThenGetNetworkMatches,
        []
    );
    const setValue = useCallback(
        (value) => {
            dispatch(
                changeFilterValueThenGetNetworkMatches({
                    ruleIndex,
                    /*filterIndex,*/
                    //value: isUniqueSelectFilter ? [value] : value,
                    value,
                })
            );
        },
        [
            dispatch,
            ruleIndex,
            // filterIndex,
            // isUniqueSelectFilter,
            changeFilterValueThenGetNetworkMatches,
        ]
    );

    // const properties = equipmentType ? getPropertiesOptions(equipmentType) : [];
    // const possibleValues =
    //     getValuesOption(fullProperty) ??
    //     (fullProperty?.type === PropertyType.BOOLEAN
    //         ? [
    //               { value: true, label: 'true' },
    //               { value: false, label: 'false' },
    //           ]
    //         : undefined);

    // --- begin new code --- //
    const [filterDataReady, setFilterDataReady] = useState(false);

    // how to set default values from useSelector and via reset???
    const formMethods = useForm({
        resolver: yupResolver(filterFormSchema),
    });

    const {
        reset,
        formState: { errors },
    } = formMethods;

    const isValidating = errors.root?.isValidating;

    useEffect(() => {
        const query = importExpertRules(filter[EXPERT_FILTER_QUERY]);

        console.log('query in effect', { query });

        reset({
            [EXPERT_FILTER_QUERY]: query,
        });
        setFilterDataReady(true);
    }, [reset, filter]);

    // --- end new code --- //

    return (
        <CustomFormProvider
            {...formMethods}
            validationSchema={filterFormSchema}
        >
            {filterDataReady && (
                <Filter
                    id={id}
                    isValid={isValid}
                    //            property={property}
                    //            propertyType={fullProperty?.type}
                    //            properties={properties}
                    //             setProperty={setProperty}
                    //            operand={operand}
                    // setOperand={setOperand}
                    //            value={isUniqueSelectFilter && value.length > 0 ? value[0] : value}
                    //            possibleValues={possibleValues}
                    //            networkValues={networkValues}
                    setValue={setValue}
                    // new code props
                    equipmentType={equipmentType}
                />
            )}
        </CustomFormProvider>
    );
};

FilterContainer.propTypes = {
    ruleIndex: PropTypes.number.isRequired,
    filterIndex: PropTypes.number.isRequired,
    equipmentType: PropTypes.string.isRequired,
};

export default FilterContainer;
