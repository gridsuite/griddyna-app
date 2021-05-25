import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Typography } from '@material-ui/core';

import { CopyButton, DeleteButton } from '../1-atoms/buttons';
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
        deleteFilter,
        copyFilter,
    } = props;
    const onValueChange = (event) => {
        const rawValue = event.target.value;
        let value = rawValue;
        if (propertyType && propertyType === PropertyType.NUMBER) {
            value = Number(rawValue);
        }
        setValue(value);
    };
    const operands = propertyType ? getOperandsOptions(propertyType) : [];

    const multiple = [EnumOperands.IN, EnumOperands.NOT_IN].includes(operand);
    const classes = useStyles(multiple);

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
            </Grid>
            <Grid item xs={2}>
                <Grid container justify="center">
                    <Grid item xs="auto">
                        <DeleteButton onClick={deleteFilter} />
                    </Grid>
                    <Grid item xs="auto">
                        <CopyButton onClick={copyFilter} />
                    </Grid>
                </Grid>
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
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.number,
        PropTypes.bool,
    ]).isRequired,
    possibleValues: PropTypes.array,
    setValue: PropTypes.func.isRequired,
    deleteFilter: PropTypes.func.isRequired,
    copyFilter: PropTypes.func.isRequired,
};

export default Filter;
