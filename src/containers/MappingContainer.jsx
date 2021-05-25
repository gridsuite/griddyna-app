import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    MappingSlice,
    getRulesNumber,
    isModified as isModifiedSelector,
    postMapping,
} from '../redux/slices/Mapping';
import { convertScript } from '../redux/slices/Script';
import { List, Paper } from '@material-ui/core';
import RuleContainer from './RuleContainer';
import MappingHeader from '../components/2-molecules/MappingHeader';

const MappingContainer = () => {
    // TODO Add path parameter here
    const rulesNumber = useSelector(getRulesNumber);
    const activeMapping = useSelector((state) => state.mappings.activeMapping);
    const isModified = useSelector(isModifiedSelector);
    const dispatch = useDispatch();

    function addRule() {
        dispatch(MappingSlice.actions.addRule(undefined));
    }

    function saveMapping() {
        dispatch(postMapping());
    }

    function convertToScript() {
        dispatch(convertScript(activeMapping));
    }

    function buildRules() {
        const rules = [];
        for (let i = 0; i < rulesNumber; i++) {
            rules.push(<RuleContainer index={i} key={`rule-container-${i}`} />);
        }
        return rules;
    }
    return (
        <Paper>
            <MappingHeader
                mappingName={activeMapping}
                isModified={isModified}
                saveMapping={saveMapping}
                addRule={addRule}
                convertToScript={convertToScript}
            />
            <List>{buildRules()}</List>
        </Paper>
    );
};

export default MappingContainer;
