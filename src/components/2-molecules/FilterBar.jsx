/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';

const FilterBar = (props) => {
    const { options, value, setFilter } = props;
    const onChange = (_event, value) => setFilter(value);

    return (
        <Tabs value={value} onChange={onChange} centered>
            {options.map((option) => (
                <Tab
                    key={option.value}
                    label={option.label ?? option.value}
                    value={option.value}
                    disabled={option.disabled}
                />
            ))}
            <Tab style={{ display: 'none' }} value="" />
        </Tabs>
    );
};

FilterBar.propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    setFilter: PropTypes.func.isRequired,
};

export default FilterBar;
