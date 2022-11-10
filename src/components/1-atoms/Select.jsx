/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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
} from '@mui/material';

import { MenuProps, useStyles } from './SelectStyles';

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
        disabled = false,
    } = props;
    const classes = useStyles();

    function onChange(event) {
        const { value } = event.target;
        setValue(value);
    }

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
                disabled={disabled}
                // Either mess with the style (disappearing overflow) or allow scroll while Select is open
                MenuProps={{ disableScrollLock: true }}
            >
                {options.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
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
    disabled: PropTypes.bool,
    options: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    setValue: PropTypes.func,
};

export default Select;
