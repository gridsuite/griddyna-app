/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { List, ListItem } from '@mui/material';
import { useStyles } from './FiltersTemplateStyles';

const FiltersTemplate = (props) => {
    const { children } = props;
    const classes = useStyles();
    return (
        <List className={classes.filters}>
            {children.map((filter, index) => {
                return <ListItem key={`filter-${index}`}>{filter}</ListItem>;
            })}
        </List>
    );
};

export default FiltersTemplate;
