/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    FormControlLabel,
    Grid2 as Grid,
    List,
    Paper,
    Switch,
    Typography,
} from '@mui/material';
import { useIntl } from 'react-intl';
import { useSnackMessage } from '@gridsuite/commons-ui';
import {
    activeMappingName as activeMappingNameSelector,
    automatonTabsValid as automatonTabsValidSelector,
    getAutomataNumber,
    getGroupedAutomataNumber,
    getGroupedRulesNumber,
    getRulesNumber,
    isMappingValid as isMappingValidSelector,
    isModified as isModifiedSelector,
    MappingSlice,
    ruleTabsValid as ruleTabsValidSelector,
    updateMapping,
} from '../redux/slices/Mapping';
import { getCurrentStudyInfos, getPropertyValuesFromStudyId, getStudies } from '../redux/slices/Network';
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
import { addFavoriteStudies, getFavoriteStudies, removeFavoriteStudies } from '../redux/slices/Config.ts';

const styles = {
    tabBar: {
        display: 'flex',
        justifyContent: 'flex-start',
    },
};

// TODO intl
const ADD_MODEL_LABEL = 'Add a model';
const SAVE_LABEL = 'Save Mapping';
const MODELS_TITLE = 'Models';
const AUTOMATA_TITLE = 'Automata';
const ADD_AUTOMATON_LABEL = 'Add an automaton';
const CONTROLLED_PARAMETERS_LABEL = 'Manage model parameters';

const MappingContainer = () => {
    const { snackError } = useSnackMessage();
    const intl = useIntl();

    // TODO Add path parameter here
    const totalRulesNumber = useSelector((state) => state.mappings.rules.length);
    const rulesNumber = useSelector(getRulesNumber);
    const activeMapping = useSelector((state) => state.mappings.activeMapping);
    const activeMappingName = useSelector(activeMappingNameSelector);
    const isModified = useSelector(isModifiedSelector);
    const ruleTabsValid = useSelector(ruleTabsValidSelector);
    const automatonTabsValid = useSelector(automatonTabsValidSelector);
    const isMappingValid = useSelector(isMappingValidSelector);
    const studies = useSelector((state) => state.network.knownStudies);
    const favoriteStudies = useSelector(getFavoriteStudies);
    const currentStudy = useSelector(getCurrentStudyInfos);
    const groupedRulesNumber = useSelector(getGroupedRulesNumber);
    const filteredType = useSelector((state) => state.mappings.filteredRuleType);
    const filteredFamily = useSelector((state) => state.mappings.filteredAutomatonFamily);

    const totalAutomataNumber = useSelector((state) => state.mappings.automata.length);
    const automataNumber = useSelector(getAutomataNumber);
    const groupedAutomataNumber = useSelector(getGroupedAutomataNumber);
    const controlledParameters = useSelector((state) => state.mappings.controlledParameters);
    const areParametersValid = useSelector(areParametersValidSelector);
    const dispatch = useDispatch();

    // but we fetch the names of the studies to display them in the attachment dialog.
    useEffect(() => {
        if (!favoriteStudies) {
            return;
        }
        // Get known studies on start-up and update after attach a new study
        dispatch(getStudies({ ids: favoriteStudies }))
            .unwrap()
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'getStudiesError', messageId: error.message });
            });
    }, [dispatch, snackError, favoriteStudies]);

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
        dispatch(updateMapping());
    }

    function attachKnownStudy(id) {
        dispatch(getPropertyValuesFromStudyId(id))
            .unwrap()
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'getPropertyValuesFromStudyIdError', messageId: error.message });
            });
    }

    function attachNewStudy(id) {
        dispatch(addFavoriteStudies({ studyId: id }))
            .unwrap()
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'addFavoriteStudiesError', messageId: error.message });
            });
        dispatch(getPropertyValuesFromStudyId(id))
            .unwrap()
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'getPropertyValuesFromStudyIdError', messageId: error.message });
            });
    }

    function deleteKnownStudy(id) {
        dispatch(removeFavoriteStudies({ studyId: id }))
            .unwrap()
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'removeFavoriteStudiesError', messageId: error.message });
            });
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
            {activeMapping && (
                <Paper>
                    <Header
                        name={activeMappingName}
                        currentStudy={currentStudy}
                        isModified={isModified}
                        isValid={isMappingValid && areParametersValid}
                        save={saveMapping}
                        saveTooltip={SAVE_LABEL}
                        attach={() => setIsAttachedModalOpen(true)}
                        attachTooltip={intl.formatMessage({ id: 'attachStudyDialogTitle' })}
                    />
                    <Grid container justifyContent="flex-start">
                        <Grid size={12}>
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
                                <Grid size="grow" sx={styles.tabBar}>
                                    <TabBar
                                        value={filteredType}
                                        options={filterRulesOptions}
                                        setValue={setFilteredType}
                                    />
                                </Grid>
                                <Grid size="auto">
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
                                <Grid size="grow" sx={styles.tabBar}>
                                    <TabBar
                                        value={filteredFamily}
                                        options={filterAutomataOptions}
                                        setValue={setFilteredFamily}
                                    />
                                </Grid>
                                <Grid size="auto">
                                    <AddIconButton onClick={addAutomaton} tooltip={ADD_AUTOMATON_LABEL} />
                                </Grid>
                            </Grid>
                            <List>{buildAutomata()}</List>
                        </AccordionDetails>
                    </Accordion>
                </Paper>
            )}
            <AttachDialog
                studies={studies}
                open={isAttachedModalOpen}
                handleClose={() => setIsAttachedModalOpen(false)}
                attachKnownStudy={attachKnownStudy}
                attachNewStudy={attachNewStudy}
                deleteKnownStudy={deleteKnownStudy}
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
