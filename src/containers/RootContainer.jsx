import React from 'react';
import { useSelector } from 'react-redux';
import PageTemplate from '../components/4-templates/PageTemplate';
import MappingContainer from './MappingContainer';
import MenuContainer from './MenuContainer';
import ScriptContainer from './ScriptContainer';
import { Typography } from '@material-ui/core';

const RootContainer = () => {
    const activeMapping = useSelector((state) => state.mappings.activeMapping);
    const activeScript = useSelector((state) => state.scripts.activeScript);
    let mainContainer = (
        <Typography align="center" variant="h2">
            No mapping or script selected
        </Typography>
    );
    if (activeMapping !== '') {
        mainContainer = <MappingContainer />;
    } else if (activeScript !== '') {
        mainContainer = <ScriptContainer />;
    }
    return <PageTemplate main={mainContainer} menu={<MenuContainer />} />;
};

export default RootContainer;
