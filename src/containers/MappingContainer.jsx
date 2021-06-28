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
} from '../redux/slices/Mapping';
import { convertScript } from '../redux/slices/Script';
import {
    getNetworkNames,
    getPropertyValuesFromFile,
    getPropertyValuesFromNetworkId,
} from '../redux/slices/Network';
import { List, Paper } from '@material-ui/core';
import RuleContainer from './RuleContainer';
import Header from '../components/2-molecules/Header';
import AttachDialog from '../components/2-molecules/AttachDialog';
import FilterBar from '../components/2-molecules/FilterBar';
import { EquipmentType } from '../constants/equipmentDefinition';

// TODO intl
const ADD_LABEL = 'Add a rule';
const CONVERT_LABEL = 'Convert to script';
const SAVE_LABEL = 'Save Mapping';
const ATTACH_LABEL = 'Attach a Network';

const MappingContainer = () => {
    // TODO Add path parameter here
    const rulesNumber = useSelector(getRulesNumber);
    const activeMapping = useSelector((state) => state.mappings.activeMapping);
    const isModified = useSelector(isModifiedSelector);
    const isMappingValid = useSelector(isMappingValidSelector);
    const networks = useSelector((state) => state.network.knownNetworks);
    const networkValues = useSelector((state) => state.network.propertyValues);
    const sortedRulesNumber = useSelector(getSortedRulesNumber);
    const filteredType = useSelector((state) => state.mappings.filteredType);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getNetworkNames());
    }, [networkValues, dispatch]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const filterOptions = Object.values(EquipmentType).map((type) => ({
        value: type,
        // TODO: intl
        label: `${type} (${sortedRulesNumber[type]})`,
        disabled: sortedRulesNumber[type] === 0,
    }));

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

    function buildRules() {
        const rules = [];
        for (let i = 0; i < rulesNumber; i++) {
            rules.push(<RuleContainer index={i} key={`rule-container-${i}`} />);
        }
        return rules;
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
                    addElement={addRule}
                    addTooltip={ADD_LABEL}
                    convert={convertToScript}
                    convertTooltip={CONVERT_LABEL}
                    attach={() => setIsModalOpen(true)}
                    attachTooltip={ATTACH_LABEL}
                />
                <FilterBar
                    value={filteredType}
                    options={filterOptions}
                    setFilter={setFilteredType}
                />
                <List>{buildRules()}</List>
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
