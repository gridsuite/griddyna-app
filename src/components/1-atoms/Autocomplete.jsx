import { Autocomplete as MuiAutocomplete } from '@material-ui/lab';
import React, { useState } from 'react';

const Autocomplete = (props) => {
    const {
        value,
        isFree = false,
        onChange,
        options = [],
        highlightOptions = [],
    } = props;
    const { inputValue, setInputValue } = useState(value);

    const onInputChange = (_event, newInputValue) =>
        setInputValue(newInputValue);

    const renderOptions = (option) =>
        highlightOptions.includes(option) ? <b>{option}</b> : option;

    return (
        <MuiAutocomplete
            freeSolo={isFree}
            value={value}
            inputValue={inputValue}
            onChange={onChange}
            onInputChange={onInputChange}
            options={options}
            renderOptions={renderOptions}
        />
    );
};

export default Autocomplete;
