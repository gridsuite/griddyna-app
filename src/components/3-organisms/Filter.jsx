/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import * as _ from 'lodash';
import { CopyButton, DeleteButton } from '../1-atoms/buttons';
import Select from '../1-atoms/Select';
import { getOperandsOptions } from '../../utils/optionsBuilders';
import { multipleOperands } from '../../constants/operands';
import { useStyles } from './FilterStyle';
import Autocomplete from '../1-atoms/Autocomplete';
import { PropertyType } from '../../constants/equipmentType';

const COPY_FILTER_LABEL = 'Copy filter';
const DELETE_FILTER_LABEL = 'Delete filter';
const PRECISION = 10e-8;

const Filter = (props) => {
    const {
        id = 'Filter',
        isValid = true,
        properties,
        property,
        propertyType,
        setProperty,
        operand,
        setOperand,
        value,
        setValue,
        possibleValues = [],
        networkValues,
        deleteFilter,
        copyFilter,
    } = props;

    const handleAutocompleteChange = useCallback(
        (newValue) => setValue(newValue),
        [setValue]
    );

    const operands = propertyType ? getOperandsOptions(propertyType) : [];

    const multiple = multipleOperands.includes(operand);
    const isSelect = possibleValues.length > 0;
    const classes = useStyles({ isValid, isSelect });

    const joinOptions = _.uniqWith(
        [
            // Values known as possible
            ...possibleValues,
            // Values received from network
            // (should be a subset of possibleValues,
            // here to avoid versions mismatch)
            ...networkValues,
            // Additional user created values
            ...(multiple
                ? value.map((value) => ({
                      label: value.toString(),
                      value,
                  }))
                : []),
        ],
        (option1, option2) => {
            const type = autocompleteType(propertyType);
            if (type === 'number') {
                // Filtering identical number (float comparison issues)
                return Math.abs(option1.value - option2.value) < PRECISION;
            } else {
                return option1.value === option2.value;
            }
        }
    );

    function autocompleteType(type) {
        switch (type) {
            case PropertyType.NUMBER:
                return 'number';
            case PropertyType.BOOLEAN:
                return 'boolean';
            default:
                return undefined;
        }
    }

    return (
        <Grid container justify="space-between">
            <Grid item xs={10}>
                <Grid container justify="center">
                    <Grid item xs="auto" className={classes.label}>
                        <Typography> {`${id} :`}</Typography>
                    </Grid>
                    <Grid item xs="auto">
                        <Select
                            options={properties}
                            value={property}
                            setValue={setProperty}
                            error={property === ''}
                        />
                    </Grid>
                    <Grid item xs="auto">
                        <Select
                            options={operands}
                            value={operand}
                            setValue={setOperand}
                            error={operand === ''}
                        />
                    </Grid>
                    <Grid item xs="auto" className={classes.value}>
                        <Autocomplete
                            isFree={!isSelect}
                            isMultiple={multiple}
                            value={value === '' ? [] : value}
                            onChange={handleAutocompleteChange}
                            options={joinOptions}
                            highlightOptions={networkValues}
                            type={autocompleteType(propertyType)}
                            error={value === '' || value === []}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={2}>
                <Grid container justify="center">
                    <Grid item xs="auto">
                        <DeleteButton
                            onClick={deleteFilter}
                            tooltip={DELETE_FILTER_LABEL}
                        />
                    </Grid>
                    <Grid item xs="auto">
                        <CopyButton
                            onClick={copyFilter}
                            tooltip={COPY_FILTER_LABEL}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

Filter.propTypes = {
    id: PropTypes.string,
    isValid: PropTypes.bool,
    properties: PropTypes.array.isRequired,
    property: PropTypes.string.isRequired,
    propertyType: PropTypes.string,
    setProperty: PropTypes.func.isRequired,
    operand: PropTypes.string.isRequired,
    setOperand: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.number,
        PropTypes.bool,
    ]).isRequired,
    possibleValues: PropTypes.array,
    networkValues: PropTypes.array,
    setValue: PropTypes.func.isRequired,
    deleteFilter: PropTypes.func.isRequired,
    copyFilter: PropTypes.func.isRequired,
};

export default Filter;
