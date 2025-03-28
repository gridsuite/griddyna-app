/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Drawer } from '@mui/material';
import { styles } from './PageTemplateStyles';

const PageTemplate = (props) => {
    const { menu, main, isMenuOpen = true } = props;
    return (
        <Box sx={styles.height}>
            <Box sx={styles.menuBox}>
                <Drawer anchor="left" variant="persistent" open={isMenuOpen} sx={styles.menu}>
                    {menu}
                </Drawer>
            </Box>
            <Box sx={styles.mainBox}>{main}</Box>
        </Box>
    );
};

export default PageTemplate;
