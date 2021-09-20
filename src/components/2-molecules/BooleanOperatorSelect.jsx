import React from 'react';
import PropTypes from 'prop-types';
import Select from '../1-atoms/Select';

const BooleanOperatorSelect = (props) => {
    const { value, setValue } = props;
    return (
        <Select
            options={[
                {
                    label: 'AND',
                    value: '&&',
                },
                {
                    label: 'OR',
                    value: '||',
                },
            ]}
            value={value}
            setValue={setValue}
        />
    );
};

BooleanOperatorSelect.propTypes = {
    value: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
};

export default BooleanOperatorSelect;
