/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FolderOutlined } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Divider,
    FormControlLabel,
    Grid,
    List,
    Stack,
    Switch,
    Typography,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { fetchDirectoryElementPath, snackWithFallback, useSnackMessage } from '@gridsuite/commons-ui';
import {
    activeMappingName as activeMappingNameSelector,
    automatonTabsValid as automatonTabsValidSelector,
    getAutomataNumber,
    getCurrentStudy,
    getGroupedAutomataNumber,
    getGroupedRulesNumber,
    getRulesNumber,
    isMappingValid as isMappingValidSelector,
    isModified as isModifiedSelector,
    MappingSlice,
    ruleTabsValid as ruleTabsValidSelector,
    updateMapping,
    updateMappingStudy,
} from '../redux/slices/Mapping';
import { getPropertyValuesFromStudyId, getStudies } from '../redux/slices/Network';
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
import { addFavoriteStudies, getFavoriteStudies, removeFavoriteStudies } from '../redux/slices/Config';
import DetachButton from '../components/1-atoms/buttons/DetachButton';
import AttachButton from '../components/1-atoms/buttons/AttachButton';
import { breadCrumb } from '../utils/directory-utils';

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
    const currentStudy = useSelector(getCurrentStudy);
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

    const [currentStudyBreadCrumb, setCurrentStudyBreadCrumb] = useState();
    const [loadingBreadCrumb, setLoadingBreadCrumb] = useState(false);

    // fetch breadCrumb the current study
    useEffect(() => {
        if (currentStudy) {
            setLoadingBreadCrumb(true);
            fetchDirectoryElementPath(currentStudy)
                .then((path) => {
                    const itemName = path.map((elem) => elem.elementName).join('/');
                    setCurrentStudyBreadCrumb(breadCrumb(itemName));
                })
                .catch((error) => {
                    snackWithFallback(snackError, error, { headerId: 'fetchDirectoryElementPathError' });
                })
                .finally(() => {
                    setLoadingBreadCrumb(false);
                });
        } else {
            setCurrentStudyBreadCrumb(undefined);
        }
    }, [currentStudy, snackError]);

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

    function attachStudy() {
        setIsAttachedModalOpen(true);
    }

    function detachStudy() {
        dispatch(updateMappingStudy({ mappingId: activeMapping, studyUuid: null }));
    }

    function attachKnownStudy(id) {
        dispatch(updateMappingStudy({ mappingId: activeMapping, studyUuid: id }))
            .unwrap()
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'updateMappingStudyError', messageId: error.message });
            });
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
        dispatch(updateMappingStudy({ mappingId: activeMapping, studyUuid: id }))
            .unwrap()
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'updateMappingStudyError', messageId: error.message });
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
                <Stack height="100%">
                    <Header
                        name={activeMappingName}
                        isModified={isModified}
                        isValid={isMappingValid && areParametersValid}
                        save={saveMapping}
                        saveTooltip={SAVE_LABEL}
                    />
                    <Grid container justifyContent="flex-end" alignItems="center" paddingLeft={1} marginY={1}>
                        <Grid paddingTop={1}>
                            <FolderOutlined />
                        </Grid>
                        <Grid size="grow" paddingLeft={1}>
                            {!loadingBreadCrumb && (
                                <>
                                    {currentStudyBreadCrumb ? (
                                        <Typography noWrap fontWeight="bold" title={'study'}>
                                            {`${currentStudyBreadCrumb}`}
                                        </Typography>
                                    ) : (
                                        <FormattedMessage id={'noSelectedStudyText'} />
                                    )}
                                </>
                            )}
                        </Grid>
                        <Grid container justifyContent="flex-end" paddingRight={2} spacing={1}>
                            <AttachButton
                                label={intl.formatMessage({ id: currentStudy ? 'updateStudy' : 'attachStudy' })}
                                onClick={attachStudy}
                                variant={currentStudy ? 'contained' : undefined}
                            />
                            <DetachButton
                                label={intl.formatMessage({ id: 'detachStudy' })}
                                onClick={detachStudy}
                                tooltip={intl.formatMessage({ id: 'detachStudyTooltip' })}
                                disabled={!currentStudy}
                                variant={currentStudy ? 'outlined' : undefined}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="flex-start" paddingLeft={1}>
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
                    <Box
                        // scrollbar only in the mapping definition zone
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                        }}
                    >
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
                    </Box>
                </Stack>
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
