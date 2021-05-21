import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Typography } from '@material-ui/core';

import Select from '../1-atoms/Select';
import { getOperandsOptions } from '../../utils/optionsBuilders';
import { PropertyType } from '../../constants/equipmentDefinition';
import { EnumOperands } from '../../constants/operands';
import { useStyles } from './FilterStyle';

const Filter = (props) => {
    const {
        id = 'Filter',
        properties,
        property,
        propertyType,
        setProperty,
        operand,
        setOperand,
        value,
        setValue,
        possibleValues,
    } = props;
    const classes = useStyles();
    const onValueChange = (event) => {
        setValue(event.target.value);
    };
    const operands = propertyType ? getOperandsOptions(propertyType) : [];

    const multiple = [EnumOperands.IN, EnumOperands.NOT_IN].includes(operand);
    return (
        <Grid container justify="center">
            <Grid item xs="auto" className={classes.label}>
                <Typography> {`${id} :`}</Typography>
            </Grid>
            <Grid item xs="auto">
                <Select
                    options={properties}
                    value={property}
                    setValue={setProperty}
                />
            </Grid>
            <Grid item xs="auto">
                <Select
                    options={operands}
                    value={operand}
                    setValue={setOperand}
                />
            </Grid>
            <Grid item xs="auto" className={classes.value}>
                {possibleValues && possibleValues.length > 0 ? (
                    <Select
                        options={possibleValues}
                        value={value === '' ? [] : value}
                        setValue={setValue}
                        multiple={multiple}
                    />
                ) : (
                    <TextField
                        value={value}
                        onChange={onValueChange}
                        type={
                            propertyType === PropertyType.NUMBER
                                ? 'number'
                                : undefined
                        }
                    />
                )}
            </Grid>
        </Grid>
    );
};

Filter.propTypes = {
    id: PropTypes.string,
    properties: PropTypes.array.isRequired,
    property: PropTypes.string.isRequired,
    propertyType: PropTypes.string,
    setProperty: PropTypes.func.isRequired,
    operand: PropTypes.string.isRequired,
    setOperand: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    possibleValues: PropTypes.array,
    setValue: PropTypes.func.isRequired,
};

export default Filter;
