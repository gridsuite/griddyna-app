/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete as MuiAutocomplete } from '@material-ui/lab';
import { Popper, TextField } from '@material-ui/core';
import { useStyles } from './AutocompleteStyles';

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
        [options, value, isMultiple]
    );
    const [inputValue, setInputValue] = useState(
        isMultiple ? '' : value.toString()
    );

    const classes = useStyles({
        labelLength:
            inputValue.length +
            (isMultiple
                ? selectedOption.reduce(
                      (accLength, currentValue) =>
                          accLength + currentValue.label.length,
                      0
                  )
                : 0),
        selectedOptions: isMultiple ? value.length : 0,
    });

    const [updateFlag, setUpdateFlag] = useState(false);

    useEffect(() => {
        if (updateFlag && inputValue !== '') {
            if (isFree && !isMultiple) {
                let valueToSend = inputValue;
                if (type === 'number') {
                    valueToSend = Number(valueToSend);
                }
                if (!Number.isNaN(valueToSend)) {
                    onChange(valueToSend);
                }
            }
            setUpdateFlag(false);
        }
    }, [updateFlag, isFree, isMultiple, inputValue, onChange, type]);

    const onInputChange = (event, newInputValue) => {
        if (type !== 'number') {
            console.log('input', newInputValue);
            setInputValue(newInputValue.toString());
        } else {
            // Avoid locale misinterpretation
            const inputToSend = newInputValue.replace(',', '.');
            if (!Number.isNaN(Number(inputToSend))) {
                console.log('input', inputToSend);
                setInputValue(inputToSend.toString());
            }
        }
    };

    const onPopupClose = () => {
        console.log('close', inputValue);
        setUpdateFlag(true);
    };

    const onValueChange = (_event, newValue) => {
        console.log('newValue', newValue);
        if (!isMultiple) {
            if (newValue !== null) {
                // In case of manual addition, valueItem will be a string and not an option
                let valueToSend = newValue?.value ?? newValue;
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
                    // In case of manual addition, valueItem will be a string and not an option
                    let formattedValue = valueItem?.value ?? valueItem;
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
            onClose={onPopupClose}
            multiple={isMultiple}
            value={selectedOption}
            inputValue={inputValue}
            onChange={onValueChange}
            onInputChange={onInputChange}
            options={options}
            getOptionLabel={(option) => option?.label ?? ''}
            autoHighlight={!isFree}
            renderOption={renderOption}
            className={classes.inputWidth}
            renderInput={(params) => <TextField {...params} error={error} />}
            PopperComponent={(props) => (
                <Popper
                    {...props}
                    placement="bottom-start"
                    style={{ width: 'fit-content' }}
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
