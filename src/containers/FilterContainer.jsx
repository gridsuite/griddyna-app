/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    changeFilterValueThenGetNetworkMatches,
    makeGetFilter,
    makeIsFilterValid,
    MappingSlice,
} from '../redux/slices/Mapping';
import { makeGetNetworkValues } from '../redux/slices/Network';
import { getPropertiesOptions } from '../utils/optionsBuilders';
import Filter from '../components/3-organisms/Filter';
import { getProperty, getValuesOption } from '../utils/properties';
import PropTypes from 'prop-types';
import { PropertyType } from '../constants/equipmentDefinition';
import { multipleOperands } from '../constants/operands';

const FilterContainer = ({ ruleIndex, filterIndex, equipmentType }) => {
    // Data
    const getFilter = useMemo(makeGetFilter, []);
    const filter = useSelector((state) =>
        getFilter(state, { rule: ruleIndex, filter: filterIndex })
    );
    const { id, property, operand, value } = filter;
    const fullProperty = equipmentType
        ? getProperty(equipmentType, property)
        : undefined;

    const isFilterValid = useMemo(makeIsFilterValid, []);
    const isValid = useSelector((state) =>
        isFilterValid(state, { rule: ruleIndex, filter: filterIndex })
    );

    const getNetworkValues = useMemo(makeGetNetworkValues, []);
    const networkValues = useSelector((state) =>
        getNetworkValues(state, { equipmentType, fullProperty })
    ).map((value) => ({ label: value.toString(), value }));

    // Actions
    const dispatch = useDispatch();
    const setProperty = (property) =>
        dispatch(
            MappingSlice.actions.changeFilterProperty({
                ruleIndex,
                filterIndex,
                property,
            })
        );

    const setOperand = (operand) =>
        dispatch(
            MappingSlice.actions.changeFilterOperand({
                ruleIndex,
                filterIndex,
                operand,
            })
        );

    const isUniqueSelectFilter = // is an enum
        // operands only allow one string to select
        !multipleOperands.includes(operand);

    const hasNetworkValues = networkValues.length > 0;

    const setValue = useCallback(
        (value) => {
            /*            dispatch(
    MappingSlice.actions.changeFilterValue({
        ruleIndex,
        filterIndex,
        value: isUniqueSelectFilter ? [value] : value,
    })
);
hasNetworkValues &&
    value &&
    dispatch(getNetworkMatchesFromRule(ruleIndex));*/
            dispatch(
                changeFilterValueThenGetNetworkMatches({
                    ruleIndex,
                    filterIndex,
                    value: isUniqueSelectFilter ? [value] : value,
                })
            );
        },
        [
            dispatch,
            ruleIndex,
            filterIndex,
            isUniqueSelectFilter,
            hasNetworkValues,
        ]
    );
    const deleteFilter = () =>
        dispatch(
            MappingSlice.actions.deleteFilter({
                ruleIndex,
                filterIndex,
            })
        );

    const copyFilter = () =>
        dispatch(
            MappingSlice.actions.copyFilter({
                ruleIndex,
                filterIndex,
            })
        );

    const properties = equipmentType ? getPropertiesOptions(equipmentType) : [];
    const possibleValues =
        getValuesOption(fullProperty) ??
        (fullProperty?.type === PropertyType.BOOLEAN
            ? [
                  { value: true, label: 'true' },
                  { value: false, label: 'false' },
              ]
            : undefined);

    return (
        <Filter
            id={id}
            isValid={isValid}
            property={property}
            propertyType={fullProperty?.type}
            properties={properties}
            setProperty={setProperty}
            operand={operand}
            setOperand={setOperand}
            value={isUniqueSelectFilter && value.length > 0 ? value[0] : value}
            possibleValues={possibleValues}
            networkValues={networkValues}
            setValue={setValue}
            deleteFilter={deleteFilter}
            copyFilter={copyFilter}
        />
    );
};

FilterContainer.propTypes = {
    ruleIndex: PropTypes.number.isRequired,
    filterIndex: PropTypes.number.isRequired,
    equipmentType: PropTypes.string.isRequired,
};

export default FilterContainer;
