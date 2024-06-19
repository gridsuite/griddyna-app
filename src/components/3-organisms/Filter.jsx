/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { getOperandsOptions } from '../../utils/optionsBuilders';
import { multipleOperands } from '../../constants/operands';
import { useFormContext } from 'react-hook-form';
import {
    CustomReactQueryBuilder,
    EXPERT_FILTER_FIELDS,
    EXPERT_FILTER_QUERY,
} from '@gridsuite/commons-ui';
import { useIntl } from 'react-intl';

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
        // setProperty,
        operand,
        // setOperand,
        value,
        setValue,
        possibleValues = [],
        networkValues,
        // new code props
        equipmentType,
    } = props;

    // --- begin new code rqb --- //
    const intl = useIntl();

    const { getValues, setValue: setValueForm } = useFormContext();

    const translatedFields = useMemo(() => {
        return EXPERT_FILTER_FIELDS[equipmentType]?.map((field) => {
            return {
                ...field,
                label: intl.formatMessage({ id: field.label }),
            };
        });
    }, [intl, equipmentType]);
    // --- end new code rqb --- //
    const handleAutocompleteChange = useCallback(
        (newValue) => setValue(newValue),
        [setValue]
    );

    const operands = propertyType ? getOperandsOptions(propertyType) : [];

    const multiple = multipleOperands.includes(operand);
    const isSelect = possibleValues.length > 0;

    // const joinOptions = _.uniqWith(
    //     [
    //         // Values known as possible
    //         ...possibleValues,
    //         // Values received from network
    //         // (should be a subset of possibleValues,
    //         // here to avoid versions mismatch)
    //         ...networkValues,
    //         // Additional user created values
    //         ...(multiple
    //             ? value.map((value) => ({
    //                   label: value.toString(),
    //                   value,
    //               }))
    //             : []),
    //     ],
    //     (option1, option2) => {
    //         const type = autocompleteType(propertyType);
    //         if (type === 'number') {
    //             // Filtering identical number (float comparison issues)
    //             return Math.abs(option1.value - option2.value) < PRECISION;
    //         } else {
    //             return option1.value === option2.value;
    //         }
    //     }
    // );
    //
    // function autocompleteType(type) {
    //     switch (type) {
    //         case PropertyType.NUMBER:
    //             return 'number';
    //         case PropertyType.BOOLEAN:
    //             return 'boolean';
    //         default:
    //             return undefined;
    //     }
    // }

    return (
        <Grid container justify="space-between">
            <CustomReactQueryBuilder
                name={EXPERT_FILTER_QUERY}
                fields={translatedFields}
            />
            {/*                <Grid container justify="center">
                    <Grid
                        item
                        xs="auto"
                        sx={mergeSx(
                            styles.label,
                            !isValid && styles.invalidLabel
                        )}
                    >
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
                    <Grid item xs="auto" sx={styles.value}>
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
                </Grid>*/}
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
