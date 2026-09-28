/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { memo, RefObject, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styles as sharedStyles } from '../utils/styles-utils';
import TabBar from '../components/2-molecules/TabBar';
import { AddIconButton } from '../components/1-atoms/buttons';
import RuleContainer from './RuleContainer';
import {
    getGroupedRulesNumber,
    getRulesNumber,
    MappingSlice,
    ruleTabsValid as ruleTabsValidSelector,
} from '../redux/slices/Mapping';
import { RuleEquipmentTypes } from '../constants/equipmentType';
import { RootState } from '../redux/reducer';
import VirtualizedList from '../components/2-molecules/virtualized-list/VirtualizedList';

type MappingRuleContainerProps = {
    parentScrollContainerRef: RefObject<HTMLDivElement>;
    activeMapping?: string;
    editParameters?: (parameterEditInfo: Record<string, any>) => void;
};

function MappingRuleContainer({
    parentScrollContainerRef,
    activeMapping,
    editParameters,
}: Readonly<MappingRuleContainerProps>) {
    const intl = useIntl();
    const dispatch = useDispatch();

    const rulesNumber = useSelector(getRulesNumber);
    const totalRulesNumber = useSelector((state: RootState) => state.mappings.rules.length);
    const filteredType = useSelector((state: RootState) => state.mappings.filteredRuleType);

    const groupedRulesNumber = useSelector(getGroupedRulesNumber) as Record<string, number>;
    const ruleTabsValid = useSelector(ruleTabsValidSelector) as Record<string, boolean>;

    const filterRulesOptions = RuleEquipmentTypes.map((type: string) => ({
        value: type,
        // TODO: intl
        label: `${type} (${groupedRulesNumber[type]})`,
        isValid: ruleTabsValid[type],
    }));
    const handleChangeFilterType = useCallback(
        (newFilterType: string) => {
            dispatch(MappingSlice.actions.changeFilteredType(newFilterType as any));
        },
        [dispatch]
    );

    function addRule() {
        dispatch(MappingSlice.actions.addRule(undefined));
    }

    const [modelsExpanded, setModelsExpanded] = useState(false);

    const renderItem = useCallback(
        (index: number) => (
            <RuleContainer
                index={index}
                editParameters={editParameters}
                key={`rule-container-${activeMapping}-${filteredType}-${index}`}
            />
        ),
        [editParameters, activeMapping, filteredType]
    );

    return (
        <Accordion
            expanded={modelsExpanded}
            onChange={(_, expanded) => {
                setModelsExpanded(expanded);
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sharedStyles.accordionSummary}>
                <Typography>{`${intl.formatMessage({ id: 'models' })} ${totalRulesNumber ? '(' + totalRulesNumber + ')' : ''}`}</Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
                <Grid container>
                    <Grid size="grow" sx={sharedStyles.tabBar}>
                        <TabBar value={filteredType} options={filterRulesOptions} setValue={handleChangeFilterType} />
                    </Grid>
                    <Grid size="auto">
                        <AddIconButton onClick={addRule} tooltip={intl.formatMessage({ id: 'addModelLabel' })} />
                    </Grid>
                </Grid>
                <VirtualizedList
                    count={rulesNumber}
                    scrollElementRef={parentScrollContainerRef}
                    renderItem={renderItem}
                    estimateSize={400}
                    overscan={1}
                    disabled={!modelsExpanded || !rulesNumber}
                />
            </AccordionDetails>
        </Accordion>
    );
}

export default memo(MappingRuleContainer);
