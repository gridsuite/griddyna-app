/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactNode } from 'react';
import { Box, Stack, useTheme } from '@mui/material';

type PageTemplateProps = {
    menu: ReactNode;
    main: ReactNode;
};

const PageTemplate = ({ menu, main }: Readonly<PageTemplateProps>) => {
    const theme = useTheme();
    return (
        <Stack direction="row" height="100%">
            <Box
                // menu has a scrollbar separated to the one inside the main
                sx={{
                    height: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    borderRight: `1px solid ${theme.palette.divider}`,
                }}
            >
                {menu}
            </Box>
            <Box
                sx={{
                    flex: 1,
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                {main}
            </Box>
        </Stack>
    );
};

export default PageTemplate;
