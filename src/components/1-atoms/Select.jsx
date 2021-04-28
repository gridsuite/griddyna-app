import React from 'react';
import PropTypes from 'prop-types';
import {
    Chip,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    makeStyles,
    MenuItem,
    Select as MuiSelect,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

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
            className={classes.formControl}
            error={error}
        >
            {label !== undefined && <InputLabel>{label}</InputLabel>}
            <MuiSelect value={value} onChange={onChange} {...multipleProps}>
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
