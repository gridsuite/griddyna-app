/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useRef, useState } from 'react';
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
    getActiveMapping,
    getAutomataNumber,
    getCurrentStudy,
    getGroupedAutomataNumber,
    isMappingValid as isMappingValidSelector,
    isModified as isModifiedSelector,
    MappingSlice,
    updateMapping,
    updateMappingStudy,
} from '../redux/slices/Mapping';
import { getPropertyValuesFromStudyId, getStudies, NetworkSlice } from '../redux/slices/Network';
import Header from '../components/2-molecules/Header';
import AttachDialog from '../components/2-molecules/AttachDialog';
import TabBar from '../components/2-molecules/TabBar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AddIconButton } from '../components/1-atoms/buttons';
import AutomatonContainer from './AutomatonContainer';
import ParametersContainer from './ParametersContainer';
import { areParametersValid as areParametersValidSelector } from '../redux/selectors';
import { AutomatonFamily } from '../constants/automatonDefinition';
import { addFavoriteStudies, getFavoriteStudies, removeFavoriteStudies } from '../redux/slices/Config';
import DetachButton from '../components/1-atoms/buttons/DetachButton';
import AttachButton from '../components/1-atoms/buttons/AttachButton';
import { breadCrumb } from 'utils/directory-utils';
import { styles as sharedStyles } from 'utils/styles-utils';
import GlassPane from '../components/1-atoms/glass-pane';
import MappingRuleContainer from './MappingRuleContainer.tsx';

const MappingContainer = () => {
    const { snackError } = useSnackMessage();
    const intl = useIntl();

    // TODO Add path parameter here
    const activeMapping = useSelector(getActiveMapping);
    const activeMappingName = useSelector(activeMappingNameSelector);
    const isModified = useSelector(isModifiedSelector);

    const automatonTabsValid = useSelector(automatonTabsValidSelector);
    const isMappingValid = useSelector(isMappingValidSelector);
    const studies = useSelector((state) => state.network.knownStudies);
    const favoriteStudies = useSelector(getFavoriteStudies);
    const currentStudy = useSelector(getCurrentStudy);

    const filteredFamily = useSelector((state) => state.mappings.filteredAutomatonFamily);

    const totalAutomataNumber = useSelector((state) => state.mappings.automata.length);
    const automataNumber = useSelector(getAutomataNumber);
    const groupedAutomataNumber = useSelector(getGroupedAutomataNumber);
    const controlledParameters = useSelector((state) => state.mappings.controlledParameters);
    const areParametersValid = useSelector(areParametersValidSelector);
    const dispatch = useDispatch();

    // the ref to the scroll container of rules and automata
    const scrollContainerRef = useRef(null);

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

    const [activeMappingBreadCrumb, setActiveMappingBreadCrumb] = useState();
    const [errorActiveMappingBreadCrumb, setErrorActiveMappingBreadCrumb] = useState(false);

    // fetch breadCrumb the current study
    useEffect(() => {
        let ignore = false;
        if (activeMapping) {
            setErrorActiveMappingBreadCrumb(false);
            fetchDirectoryElementPath(activeMapping)
                .then((path) => {
                    const itemName = path.map((elem) => elem.elementName).join('/');
                    if (!ignore) {
                        setActiveMappingBreadCrumb(breadCrumb(itemName));
                        setErrorActiveMappingBreadCrumb(false);
                    }
                })
                .catch((error) => {
                    if (!ignore) {
                        snackWithFallback(snackError, error, { headerId: 'fetchMappingPathError' });
                        setActiveMappingBreadCrumb(undefined);
                        setErrorActiveMappingBreadCrumb(true);
                    }
                });
        } else {
            setActiveMappingBreadCrumb(undefined);
            setErrorActiveMappingBreadCrumb(false);
        }
        return () => {
            ignore = true;
        };
    }, [activeMapping, snackError]);

    const [currentStudyBreadCrumb, setCurrentStudyBreadCrumb] = useState();
    const [loadingCurrentStudyBreadCrumb, setLoadingCurrentStudyBreadCrumb] = useState(false);
    const [errorCurrentStudyBreadCrumb, setErrorCurrentStudyBreadCrumb] = useState(false);

    // fetch breadCrumb the current study
    useEffect(() => {
        let ignore = false;
        if (currentStudy) {
            setLoadingCurrentStudyBreadCrumb(true);
            fetchDirectoryElementPath(currentStudy)
                .then((path) => {
                    const itemName = path.map((elem) => elem.elementName).join('/');
                    if (!ignore) {
                        setCurrentStudyBreadCrumb(breadCrumb(itemName));
                        setErrorCurrentStudyBreadCrumb(false);
                    }
                })
                .catch((error) => {
                    if (!ignore) {
                        snackWithFallback(snackError, error, { headerId: 'fetchStudyPathError' });
                        setCurrentStudyBreadCrumb(undefined);
                        setErrorCurrentStudyBreadCrumb(true);
                    }
                })
                .finally(() => {
                    if (!ignore) {
                        setLoadingCurrentStudyBreadCrumb(false);
                    }
                });
        } else {
            setCurrentStudyBreadCrumb(undefined);
            setErrorCurrentStudyBreadCrumb(false);
            setLoadingCurrentStudyBreadCrumb(false);
        }
        return () => {
            ignore = true;
        };
    }, [currentStudy, snackError]);

    // make header alway open when switching mapping
    const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
    useEffect(() => {
        setIsHeaderExpanded(true);
    }, [activeMapping]);

    const [isAttachedModalOpen, setIsAttachedModalOpen] = useState(false);
    const [editParameters, setEditParameters] = useState(undefined);

    const filterAutomataOptions = Object.values(AutomatonFamily).map((family) => ({
        value: family,
        // TODO: intl
        label: `${family} (${groupedAutomataNumber[family]})`,
        isValid: automatonTabsValid[family],
    }));

    function saveMapping() {
        dispatch(updateMapping());
    }

    function attachStudy() {
        setIsAttachedModalOpen(true);
    }

    function detachStudy() {
        dispatch(updateMappingStudy({ mappingId: activeMapping, studyUuid: null }))
            .unwrap()
            .then(() => {
                dispatch(NetworkSlice.actions.cleanNetwork());
            })
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'detachMappingStudyError', messageId: error.message });
            });
    }

    function attachKnownStudy(id) {
        dispatch(updateMappingStudy({ mappingId: activeMapping, studyUuid: id }))
            .unwrap()
            .then(() => {
                dispatch(NetworkSlice.actions.cleanNetwork());
                dispatch(getPropertyValuesFromStudyId(id))
                    .unwrap()
                    .catch((error) => {
                        // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                        snackError({ headerId: 'getPropertyValuesFromStudyIdError', messageId: error.message });
                    });
            })
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'attachMappingStudyError', messageId: error.message });
            });
    }

    function attachNewStudy(id) {
        dispatch(addFavoriteStudies({ studyId: id }))
            .unwrap()
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'addFavoriteStudiesError', messageId: error.message });
            });
        attachKnownStudy(id);
    }

    function deleteKnownStudy(id) {
        dispatch(removeFavoriteStudies({ studyId: id }))
            .unwrap()
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'removeFavoriteStudiesError', messageId: error.message });
            });
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
                <GlassPane error={errorActiveMappingBreadCrumb} errorMessageText={'mappingNotAccessible'}>
                    <Stack sx={{ height: '100%' }}>
                        <Accordion
                            expanded={isHeaderExpanded}
                            onChange={(_, expanded) => setIsHeaderExpanded(expanded)}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sharedStyles.accordionSummary}>
                                <Header
                                    name={activeMappingName}
                                    breadCrumbName={activeMappingBreadCrumb}
                                    isModified={isModified}
                                    isValid={isMappingValid && areParametersValid}
                                    save={(event) => {
                                        event.stopPropagation(); //  to avoid event bubbles up to AccordionSummary which change open/close state
                                        saveMapping();
                                    }}
                                    saveTooltip={intl.formatMessage({ id: 'saveMappingTooltip' })}
                                />
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails>
                                <Grid container sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <Grid sx={{ paddingTop: 1 }}>
                                        <FolderOutlined />
                                    </Grid>
                                    <Grid size="grow" sx={{ paddingLeft: 1 }}>
                                        {!loadingCurrentStudyBreadCrumb && (
                                            <>
                                                {currentStudyBreadCrumb ? (
                                                    <Typography noWrap fontWeight="bold" title={'study'}>
                                                        {`${currentStudyBreadCrumb}`}
                                                    </Typography>
                                                ) : (
                                                    <FormattedMessage
                                                        id={'noAttachedStudyText'}
                                                        values={{
                                                            errorMessage: errorCurrentStudyBreadCrumb
                                                                ? `(${intl.formatMessage({ id: 'attachedStudyNotFoundText' })})`
                                                                : '',
                                                        }}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </Grid>
                                    <Grid container sx={{ justifyContent: 'flex-end', paddingRight: 1 }} spacing={1}>
                                        <AttachButton
                                            label={intl.formatMessage({
                                                id: currentStudy ? 'updateStudy' : 'attachStudy',
                                            })}
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
                                <Grid container sx={{ justifyContent: 'flex-start' }}>
                                    <Grid size={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    // <Checkbox
                                                    checked={controlledParameters}
                                                    onChange={changeControlledParameters}
                                                />
                                            }
                                            label={intl.formatMessage({ id: 'manageModelParameters' })}
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                        <Box
                            ref={scrollContainerRef}
                            // scrollbar only in the mapping definition zone
                            sx={{
                                pt: 1,
                                flex: 1,
                                overflowY: 'auto',
                            }}
                        >
                            <MappingRuleContainer
                                parentScrollContainerRef={scrollContainerRef}
                                activeMapping={activeMapping}
                                editParameters={setEditParameters}
                            />

                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sharedStyles.accordionSummary}>
                                    <Typography>{`${intl.formatMessage({ id: 'automata' })} ${
                                        totalAutomataNumber ? '(' + totalAutomataNumber + ')' : ''
                                    }`}</Typography>
                                </AccordionSummary>
                                <Divider />
                                <AccordionDetails>
                                    <Grid container>
                                        <Grid size="grow" sx={sharedStyles.tabBar}>
                                            <TabBar
                                                value={filteredFamily}
                                                options={filterAutomataOptions}
                                                setValue={setFilteredFamily}
                                            />
                                        </Grid>
                                        <Grid size="auto">
                                            <AddIconButton
                                                onClick={addAutomaton}
                                                tooltip={intl.formatMessage({ id: 'addAutomaton' })}
                                            />
                                        </Grid>
                                    </Grid>
                                    <List>{buildAutomata()}</List>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </Stack>
                </GlassPane>
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
