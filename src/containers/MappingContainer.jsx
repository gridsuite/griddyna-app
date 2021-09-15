/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getRulesNumber,
    getSortedRulesNumber,
    isMappingValid as isMappingValidSelector,
    isModified as isModifiedSelector,
    MappingSlice,
    postMapping,
    getAutomataNumber,
    getSortedAutomataNumber,
} from '../redux/slices/Mapping';
import { convertScript } from '../redux/slices/Script';
import {
    getNetworkNames,
    getPropertyValuesFromFile,
    getPropertyValuesFromNetworkId,
} from '../redux/slices/Network';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    Grid,
    List,
    Paper,
    Typography,
} from '@material-ui/core';
import RuleContainer from './RuleContainer';
import Header from '../components/2-molecules/Header';
import AttachDialog from '../components/2-molecules/AttachDialog';
import FilterBar from '../components/2-molecules/FilterBar';
import {
    EquipmentType,
    AutomatonFamily,
} from '../constants/equipmentDefinition';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AddIconButton } from '../components/1-atoms/buttons';
import AutomatonContainer from './AutomatonContainer';

// TODO intl
const ADD_RULE_LABEL = 'Add a rule';
const CONVERT_LABEL = 'Convert to script';
const SAVE_LABEL = 'Save Mapping';
const ATTACH_LABEL = 'Attach a Network';
const RULES_TITLE = 'Rules';
const AUTOMATA_TITLE = 'Automata';
const ADD_AUTOMATON_LABEL = 'Add an automaton';

const MappingContainer = () => {
    // TODO Add path parameter here
    const rulesNumber = useSelector(getRulesNumber);
    const activeMapping = useSelector((state) => state.mappings.activeMapping);
    const isModified = useSelector(isModifiedSelector);
    const isMappingValid = useSelector(isMappingValidSelector);
    const networks = useSelector((state) => state.network.knownNetworks);
    const networkValues = useSelector((state) => state.network.propertyValues);
    const sortedRulesNumber = useSelector(getSortedRulesNumber);
    const filteredType = useSelector(
        (state) => state.mappings.filteredRuleType
    );
    const filteredFamily = useSelector(
        (state) => state.mappings.filteredAutomatonFamily
    );
    const automataNumber = useSelector(getAutomataNumber);
    const sortedAutomataNumber = useSelector(getSortedAutomataNumber);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getNetworkNames());
    }, [networkValues, dispatch]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const filterRulesOptions = Object.values(EquipmentType).map((type) => ({
        value: type,
        // TODO: intl
        label: `${type} (${sortedRulesNumber[type]})`,
        disabled: sortedRulesNumber[type] === 0,
    }));

    const filterAutomataOptions = Object.values(AutomatonFamily).map(
        (family) => ({
            value: family,
            // TODO: intl
            label: `${family} (${sortedAutomataNumber[family]})`,
            disabled: sortedAutomataNumber[family] === 0,
        })
    );

    function addRule() {
        dispatch(MappingSlice.actions.addRule(undefined));
    }

    function saveMapping() {
        dispatch(postMapping());
    }

    function convertToScript() {
        dispatch(convertScript(activeMapping));
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

    function buildRules() {
        const rules = [];
        for (let i = 0; i < rulesNumber; i++) {
            rules.push(<RuleContainer index={i} key={`rule-container-${i}`} />);
        }
        return rules;
    }

    function buildAutomata() {
        const automata = [];
        for (let i = 0; i < automataNumber; i++) {
            automata.push(
                <AutomatonContainer
                    index={i}
                    key={`automaton-container-${i}`}
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
                    isModified={isModified}
                    isValid={isMappingValid}
                    save={saveMapping}
                    saveTooltip={SAVE_LABEL}
                    convert={convertToScript}
                    convertTooltip={CONVERT_LABEL}
                    attach={() => setIsModalOpen(true)}
                    attachTooltip={ATTACH_LABEL}
                />
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{RULES_TITLE}</Typography>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails style={{ display: 'inherit' }}>
                        <Grid container>
                            <Grid item xs={11}>
                                <FilterBar
                                    value={filteredType}
                                    options={filterRulesOptions}
                                    setFilter={setFilteredType}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <AddIconButton
                                    onClick={addRule}
                                    tooltip={ADD_RULE_LABEL}
                                />
                            </Grid>
                        </Grid>
                        <List>{buildRules()}</List>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{AUTOMATA_TITLE}</Typography>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails style={{ display: 'inherit' }}>
                        <Grid container>
                            <Grid item xs={11}>
                                <FilterBar
                                    value={filteredFamily}
                                    options={filterAutomataOptions}
                                    setFilter={setFilteredFamily}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <AddIconButton
                                    onClick={addAutomaton}
                                    tooltip={ADD_AUTOMATON_LABEL}
                                />
                            </Grid>
                        </Grid>
                        <List>{buildAutomata()}</List>
                    </AccordionDetails>
                </Accordion>
            </Paper>
            <AttachDialog
                open={isModalOpen}
                networks={networks}
                handleClose={() => setIsModalOpen(false)}
                attachWithId={attachWithId}
                attachWithFile={attachWithFile}
            />
        </>
    );
};

export default MappingContainer;
