/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';
import { styles } from './TabBarStyles';

const TabBar = (props) => {
    const { options, value, setValue } = props;
    const onChange = (_event, value) => setValue(value);

    return (
        <Tabs value={value || false} onChange={onChange} centered>
            {options.map((option) => (
                <Tab
                    key={option.value}
                    label={option.label ?? option.value}
                    value={option.value}
                    sx={
                        option.value === value || option.isValid === undefined
                            ? undefined
                            : !option.isValid
                            ? styles.tabWithError
                            : undefined
                    }
                />
            ))}
        </Tabs>
    );
};

TabBar.propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
};

export default TabBar;
