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
                    classes={classes.menuRoot}
                    open={isMenuOpen}
                    className={classes.menu}
                >
                    {menu}
                </Drawer>
            </Box>
            <Box item xs={10} className={classes.mainBox}>
                {main}
            </Box>
        </Box>
    );
};

export default PageTemplate;
