import React from 'react';
import PropTypes from 'prop-types';
import {
    Chip,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    MenuItem,
    Select as MuiSelect,
} from '@material-ui/core';

import { useStyles, MenuProps } from './SelectStyles';

const Select = (props) => {
    const {
        label,
        helperText,
        value,
        options,
        setValue,
        multiple,
        outlined,
        error = false,
    } = props;
    const classes = useStyles();

    function onChange(event) {
        const { value } = event.target;
        setValue(value);
    }

    // function onMultipleChange(event) {
    //     console.log(event);
    //     const { options } = event.target;
    //     const values = [];
    //     options.forEach((option) => {
    //         if (option.selected) {
    //             values.push(option.value);
    //         }
    //     });
    //     setValue(values);
    // }

    // const onChange = multiple ? onMultipleChange : onSimpleChange;

    const multipleProps = multiple
        ? {
              input: <Input />,
              multiple: true,
              renderValue: (selected) => (
                  <div className={classes.chips}>
                      {selected.map((value) => (
                          <Chip
                              key={value}
                              label={value}
                              className={classes.chip}
                          />
                      ))}
                  </div>
              ),
              MenuProps: MenuProps,
          }
        : {};

    return (
        <FormControl
            variant={outlined ? 'outlined' : undefined}
            className={classes.form}
            error={error}
        >
            {label !== undefined && <InputLabel>{label}</InputLabel>}
            <MuiSelect
                value={value}
                onChange={onChange}
                {...multipleProps}
                // Either mess with the style (disappearing overflow) or allow scroll while Select is open
                MenuProps={{ disableScrollLock: true }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </MuiSelect>
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    );
};

Select.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    helperText: PropTypes.string,
    outlined: PropTypes.bool,
    error: PropTypes.bool,
    options: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    setValue: PropTypes.func,
};

export default Select;
