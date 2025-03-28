/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useSelector } from 'react-redux';
import PageTemplate from '../components/4-templates/PageTemplate';
import MappingContainer from './MappingContainer';
import MenuContainer from './MenuContainer';
import { Typography } from '@mui/material';

const RootContainer = () => {
    const activeMapping = useSelector((state) => state.mappings.activeMapping);
    let mainContainer = (
        <Typography align="center" variant="h5">
            No mapping selected
        </Typography>
    );
    if (activeMapping !== '') {
        mainContainer = <MappingContainer />;
    }
    return <PageTemplate main={mainContainer} menu={<MenuContainer />} />;
};

export default RootContainer;
