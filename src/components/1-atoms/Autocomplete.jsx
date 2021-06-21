import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete as MuiAutocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

const Autocomplete = (props) => {
    const {
        value,
        isFree = false,
        onChange,
        options = [],
        highlightOptions = [],
        type,
        error,
        isMultiple = false,
    } = props;

    function matchMultipleOptions(options, values) {
        const matchedOptions = [];
        values.forEach((value) => {
            let foundOption = options.find((option) => option.value === value);
            if (foundOption) {
                matchedOptions.push(foundOption);
            }
        });
        return matchedOptions;
    }

    const selectedOption = useMemo(
        () =>
            isMultiple
                ? matchMultipleOptions(options, value)
                : options.find((option) => option.value === value) || {
                      label: value.toString(),
                      value,
                  },
        [options, value]
    );
    const [inputValue, setInputValue] = useState(
        isMultiple ? '' : value.toString()
    );
    const onInputChange = (event, newInputValue) => {
        let valueToSend = newInputValue;
        if (isFree && !isMultiple) {
            if (type === 'number') {
                valueToSend = Number(newInputValue);
            }
            if (!Number.isNaN(valueToSend)) {
                setInputValue(valueToSend.toString());
                onChange(valueToSend);
            }
        } else {
            setInputValue(newInputValue);
        }
    };

    const onValueChange = (_event, newValue) => {
        if (!isMultiple) {
            if (newValue !== null) {
                let valueToSend = newValue.value;
                if (type === 'number') {
                    valueToSend = Number(valueToSend);
                }
                onChange(valueToSend);
            } else {
                onChange('');
            }
        } else {
            onChange(
                newValue.map((valueItem) => {
                    let formattedValue = valueItem.value;
                    if (type === 'number') {
                        formattedValue = Number(formattedValue);
                    }
                    return formattedValue;
                })
            );
        }
    };

    const renderOption = (option) =>
        highlightOptions
            .map((option) => option.value)
            .includes(option.value) ? (
            <b>{option.label}</b>
        ) : (
            option.label
        );

    return (
        <MuiAutocomplete
            freeSolo={isFree}
            multiple={isMultiple}
            value={selectedOption}
            inputValue={inputValue}
            onChange={onValueChange}
            onInputChange={onInputChange}
            options={options}
            getOptionLabel={(option) => option.label ?? ''}
            autoHighlight
            renderOption={renderOption}
            renderInput={(params) => (
                <TextField
                    {...params}
                    type={type === 'number' ? type : undefined}
                    error={error}
                />
            )}
        />
    );
};

Autocomplete.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.array,
    ]).isRequired,
    isFree: PropTypes.bool,
    isMultiple: PropTypes.bool,
    onChange: PropTypes.func,
    options: PropTypes.array,
    highlightOptions: PropTypes.array,
    type: PropTypes.string,
    error: PropTypes.bool,
};

export default Autocomplete;
