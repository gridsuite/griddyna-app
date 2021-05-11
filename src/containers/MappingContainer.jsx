import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RuleSlice, getRulesNumber, postMapping } from '../redux/slices/Rule';
import { convertScript } from '../redux/slices/Script';
import { Grid, List, Paper, Typography } from '@material-ui/core';
import RuleContainer from './RuleContainer';
import AddButton from '../components/1-atoms/AddButton';
import SaveButton from '../components/1-atoms/SaveButton';
import ConvertButton from '../components/1-atoms/ConvertButton';

const MappingContainer = () => {
    // TODO Add path parameter here
    const rulesNumber = useSelector(getRulesNumber);
    const dispatch = useDispatch();

    function addRule() {
        dispatch(RuleSlice.actions.addRule(undefined));
    }

    function saveMapping() {
        dispatch(postMapping());
    }

    function convertToScript() {
        // TODO
        dispatch(convertScript('mappingName'));
    }

    const rulesLabel = 'Rules';

    function buildRules() {
        const rules = [];
        for (let i = 0; i < rulesNumber; i++) {
            rules.push(<RuleContainer index={i} key={`rule-container-${i}`} />);
        }
        return rules;
    }
    return (
        <Paper>
            <Grid container justify="space-between">
                <Grid item>
                    <Typography variant="h1">{`${rulesLabel} :`}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <ConvertButton onClick={convertToScript} />
                </Grid>
                <Grid item xs={2}>
                    <SaveButton onClick={saveMapping} />
                </Grid>
                <Grid item xs={2}>
                    <AddButton onClick={addRule} />
                </Grid>
            </Grid>
            <List>{buildRules()}</List>
        </Paper>
    );
};

export default MappingContainer;
