/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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
