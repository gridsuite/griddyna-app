/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    automatonTabsValid as automatonTabsValidSelector,
    getAutomataNumber,
    getGroupedAutomataNumber,
    getGroupedRulesNumber,
    getRulesNumber,
    isMappingValid as isMappingValidSelector,
    isModified as isModifiedSelector,
    MappingSlice,
    postMapping,
    ruleTabsValid as ruleTabsValidSelector,
} from '../redux/slices/Mapping';
import {
    getCurrentNetworkObj,
    getNetworkNames,
    getPropertyValuesFromFile,
    getPropertyValuesFromNetworkId,
} from '../redux/slices/Network';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    FormControlLabel,
    Grid,
    List,
    Paper,
    Switch,
    Typography,
} from '@mui/material';
import RuleContainer from './RuleContainer';
import Header from '../components/2-molecules/Header';
import AttachDialog from '../components/2-molecules/AttachDialog';
import TabBar from '../components/2-molecules/TabBar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AddIconButton } from '../components/1-atoms/buttons';
import AutomatonContainer from './AutomatonContainer';
import ParametersContainer from './ParametersContainer';
import { areParametersValid as areParametersValidSelector } from '../redux/selectors';
import { AutomatonFamily } from '../constants/automatonDefinition';
import { RuleEquipmentTypes } from '../constants/equipmentType';

const styles = {
    tabBar: {
        display: 'flex',
        justifyContent: 'flex-start',
    },
};

// TODO intl
const ADD_MODEL_LABEL = 'Add a model';
const SAVE_LABEL = 'Save Mapping';
const ATTACH_LABEL = 'Attach a Network';
const MODELS_TITLE = 'Models';
const AUTOMATA_TITLE = 'Automata';
const ADD_AUTOMATON_LABEL = 'Add an automaton';
const CONTROLLED_PARAMETERS_LABEL = 'Manage model parameters';

const MappingContainer = () => {
    // TODO Add path parameter here
    const totalRulesNumber = useSelector((state) => state.mappings.rules.length);
    const rulesNumber = useSelector(getRulesNumber);
    const activeMapping = useSelector((state) => state.mappings.activeMapping);
    const isModified = useSelector(isModifiedSelector);
    const ruleTabsValid = useSelector(ruleTabsValidSelector);
    const automatonTabsValid = useSelector(automatonTabsValidSelector);
    const isMappingValid = useSelector(isMappingValidSelector);
    const networks = useSelector((state) => state.network.knownNetworks);
    const networkValues = useSelector((state) => state.network.propertyValues);
    const currentNetwork = useSelector(getCurrentNetworkObj);
    const groupedRulesNumber = useSelector(getGroupedRulesNumber);
    const filteredType = useSelector((state) => state.mappings.filteredRuleType);
    const filteredFamily = useSelector((state) => state.mappings.filteredAutomatonFamily);

    const totalAutomataNumber = useSelector((state) => state.mappings.automata.length);
    const automataNumber = useSelector(getAutomataNumber);
    const groupedAutomataNumber = useSelector(getGroupedAutomataNumber);
    const controlledParameters = useSelector((state) => state.mappings.controlledParameters);
    const areParametersValid = useSelector(areParametersValidSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        // Get known networks on start-up and update after file import
        dispatch(getNetworkNames());
    }, [networkValues, dispatch]);

    const [isAttachedModalOpen, setIsAttachedModalOpen] = useState(false);
    const [editParameters, setEditParameters] = useState(undefined);

    const filterRulesOptions = RuleEquipmentTypes.map((type) => ({
        value: type,
        // TODO: intl
        label: `${type} (${groupedRulesNumber[type]})`,
        isValid: ruleTabsValid[type],
    }));

    const filterAutomataOptions = Object.values(AutomatonFamily).map((family) => ({
        value: family,
        // TODO: intl
        label: `${family} (${groupedAutomataNumber[family]})`,
        isValid: automatonTabsValid[family],
    }));

    function addRule() {
        dispatch(MappingSlice.actions.addRule(undefined));
    }

    function saveMapping() {
        dispatch(postMapping());
    }

    function attachWithId(id) {
        dispatch(getPropertyValuesFromNetworkId(id));
    }

    function attachWithFile(file) {
        dispatch(getPropertyValuesFromFile(file));
    }

    function setFilteredType(type) {
        dispatch(MappingSlice.actions.changeFilteredType(type));
    }

    function addAutomaton() {
        dispatch(MappingSlice.actions.addAutomaton(undefined));
    }

    function setFilteredFamily(type) {
        dispatch(MappingSlice.actions.changeFilteredFamily(type));
    }

    function changeControlledParameters() {
        dispatch(MappingSlice.actions.changeControlledParameters());
    }

    function buildRules() {
        const rules = [];
        for (let i = 0; i < rulesNumber; i++) {
            rules.push(
                <RuleContainer
                    index={i}
                    editParameters={setEditParameters}
                    key={`rule-container-${activeMapping}-${filteredType}-${i}`}
                />
            );
        }
        return rules;
    }

    function buildAutomata() {
        const automata = [];
        for (let i = 0; i < automataNumber; i++) {
            automata.push(
                <AutomatonContainer
                    index={i}
                    editParameters={setEditParameters}
                    key={`automaton-container-${activeMapping}-${filteredFamily}-${i}`}
                />
            );
        }
        return automata;
    }

    return (
        <>
            <Paper>
                <Header
                    name={activeMapping}
                    currentNetwork={currentNetwork}
                    isModified={isModified}
                    isValid={isMappingValid && areParametersValid}
                    save={saveMapping}
                    saveTooltip={SAVE_LABEL}
                    attach={() => setIsAttachedModalOpen(true)}
                    attachTooltip={ATTACH_LABEL}
                />
                <Grid container justify="center">
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Switch
                                    // <Checkbox
                                    checked={controlledParameters}
                                    onChange={changeControlledParameters}
                                />
                            }
                            label={CONTROLLED_PARAMETERS_LABEL}
                        />
                    </Grid>
                </Grid>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{`${MODELS_TITLE} ${
                            totalRulesNumber ? '(' + totalRulesNumber + ')' : ''
                        }`}</Typography>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails>
                        <Grid container>
                            <Grid item xs sx={styles.tabBar}>
                                <TabBar value={filteredType} options={filterRulesOptions} setValue={setFilteredType} />
                            </Grid>
                            <Grid item xs="auto">
                                <AddIconButton onClick={addRule} tooltip={ADD_MODEL_LABEL} />
                            </Grid>
                        </Grid>
                        <List>{buildRules()}</List>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{`${AUTOMATA_TITLE} ${
                            totalAutomataNumber ? '(' + totalAutomataNumber + ')' : ''
                        }`}</Typography>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails>
                        <Grid container>
                            <Grid item xs sx={styles.tabBar}>
                                <TabBar
                                    value={filteredFamily}
                                    options={filterAutomataOptions}
                                    setValue={setFilteredFamily}
                                />
                            </Grid>
                            <Grid item xs="auto">
                                <AddIconButton onClick={addAutomaton} tooltip={ADD_AUTOMATON_LABEL} />
                            </Grid>
                        </Grid>
                        <List>{buildAutomata()}</List>
                    </AccordionDetails>
                </Accordion>
            </Paper>
            <AttachDialog
                networks={networks}
                open={isAttachedModalOpen}
                handleClose={() => setIsAttachedModalOpen(false)}
                attachWithId={attachWithId}
                attachWithFile={attachWithFile}
            />
            {editParameters && (
                <ParametersContainer
                    model={editParameters.model}
                    setGroup={editParameters.setGroup}
                    groupType={editParameters.groupType}
                    isAbsolute={editParameters.isAbsolute}
                    origin={editParameters.origin}
                    originIndex={editParameters.originIndex}
                    close={() => setEditParameters(undefined)}
                />
            )}
        </>
    );
};

export default MappingContainer;
