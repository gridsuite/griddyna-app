/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useSelector } from 'react-redux';
import { Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import PageTemplate from '../components/4-templates/PageTemplate';
import MappingContainer from './MappingContainer';
import MenuContainer from './MenuContainer';

const RootContainer = () => {
    const activeMapping = useSelector((state) => state.mappings.activeMapping);
    let mainContainer = (
        <Stack direction="column" sx={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography align="center" variant="h5" sx={{ paddingTop: 1, color: 'text.disabled' }}>
                <FormattedMessage id="noMappingSelected" />
            </Typography>
        </Stack>
    );
    if (activeMapping !== '') {
        mainContainer = <MappingContainer />;
    }
    return <PageTemplate main={mainContainer} menu={<MenuContainer />} />;
};

export default RootContainer;
