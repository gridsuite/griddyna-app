import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeGetFilter, RuleSlice } from '../redux/slices/Rule';
import {
    getOperandsOptions,
    getPropertiesOptions,
} from '../utils/optionsBuilders';
import Filter from '../components/3-molecules/Filter';
import { getProperty, getValuesOption } from '../utils/properties';
import PropTypes from 'prop-types';
import { PropertyType } from '../constants/equipmentDefinition';

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

    // Actions
    const dispatch = useDispatch();
    const setProperty = (property) =>
        dispatch(
            RuleSlice.actions.changeFilterProperty({
                ruleIndex,
                filterIndex,
                property,
            })
        );

    const setOperand = (operand) =>
        dispatch(
            RuleSlice.actions.changeFilterOperand({
                ruleIndex,
                filterIndex,
                operand,
            })
        );

    const setValue = (value) =>
        dispatch(
            RuleSlice.actions.changeFilterValue({
                ruleIndex,
                filterIndex,
                value,
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
            property={property}
            propertyType={fullProperty?.type}
            properties={properties}
            setProperty={setProperty}
            operand={operand}
            setOperand={setOperand}
            value={value}
            possibleValues={possibleValues}
            setValue={setValue}
        />
    );
};

FilterContainer.propTypes = {
    ruleIndex: PropTypes.number.isRequired,
    filterIndex: PropTypes.number.isRequired,
    equipmentType: PropTypes.string.isRequired,
};

export default FilterContainer;
