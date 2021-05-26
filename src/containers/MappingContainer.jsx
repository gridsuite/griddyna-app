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
import Header from '../components/2-molecules/Header';

// TODO intl
const ADD_LABEL = 'Add a rule';
const CONVERT_LABEL = 'Convert to script';
const SAVE_LABEL = 'Save Mapping';

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
            <Header
                name={activeMapping}
                isModified={isModified}
                save={saveMapping}
                savePopOver={SAVE_LABEL}
                addElement={addRule}
                addPopOver={ADD_LABEL}
                convert={convertToScript}
                convertPopOver={CONVERT_LABEL}
            />
            <List>{buildRules()}</List>
        </Paper>
    );
};

export default MappingContainer;
