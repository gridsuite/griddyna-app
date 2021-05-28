/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Box, Drawer } from '@material-ui/core';

import { useStyles } from './PageTemplateStyles';

const PageTemplate = (props) => {
    const { menu, main, isMenuOpen = true } = props;
    const classes = useStyles();
    return (
        <Box className={classes.height}>
            <Box className={classes.menuBox}>
                <Drawer
                    anchor="left"
                    variant="persistent"
                    open={isMenuOpen}
                    className={classes.menu}
                >
                    {menu}
                </Drawer>
            </Box>
            <Box className={classes.mainBox}>{main}</Box>
        </Box>
    );
};

export default PageTemplate;
