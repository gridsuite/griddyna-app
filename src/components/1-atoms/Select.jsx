/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Chip,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    MenuItem,
    Select as MuiSelect,
} from '@mui/material';

import { MenuProps, styles } from './SelectStyles';

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
        fullWidth,
    } = props;

    function onChange(event) {
        const { value } = event.target;
        setValue(value);
    }

    const multipleProps = multiple
        ? {
              input: <Input />,
              multiple: true,
              renderValue: (selected) => (
                  <Box sx={styles.chips}>
                      {selected.map((value) => (
                          <Chip key={value} label={value} sx={styles.chip} />
                      ))}
                  </Box>
              ),
              MenuProps: MenuProps,
          }
        : {};

    return (
        <FormControl
            variant={outlined ? 'outlined' : undefined}
            sx={styles.form}
            error={error}
            fullWidth={fullWidth}
        >
            {label !== undefined && <InputLabel>{label}</InputLabel>}
            <MuiSelect
                size="small"
                label={label}
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
    fullWidth: PropTypes.bool,
};

export default Select;
