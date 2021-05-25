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
