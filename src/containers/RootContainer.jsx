import React from 'react';
import { useSelector } from 'react-redux';
import PageTemplate from '../components/4-templates/PageTemplate';
import MappingContainer from './MappingContainer';
import MenuContainer from './MenuContainer';
import { Typography } from '@material-ui/core';

const RootContainer = () => {
    const activeMapping = useSelector((state) => state.mappings.activeMapping);
    let mainContainer = (
        <Typography align="center" variant="h2">
            No mapping selected
        </Typography>
    );
    if (activeMapping !== '') {
        mainContainer = <MappingContainer />;
    }
    return <PageTemplate main={mainContainer} menu={<MenuContainer />} />;
};

export default RootContainer;
