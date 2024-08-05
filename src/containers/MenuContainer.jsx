/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    canCreateNewMapping,
    copyMapping as copyMappingAction,
    deleteMapping as deleteMappingAction,
    getMappings,
    getMappingsInfo,
    MappingSlice,
    renameMapping as renameMappingAction,
} from '../redux/slices/Mapping';
import NavigationMenu from '../components/2-molecules/NavigationMenu';
import { getNetworkNames, NetworkSlice } from '../redux/slices/Network';
import { getAutomatonDefinitions, getModels } from '../redux/slices/Model';

import { Divider, Typography } from '@mui/material';
import { RuleEquipmentTypes } from '../constants/equipmentType';
import { AutomatonFamily } from '../constants/automatonDefinition';

const CANNOT_CREATE_MAPPING_LABEL = '"default" is already taken';
const MenuContainer = () => {
    const dispatch = useDispatch();
    const mappingsInfo = useSelector(getMappingsInfo);
    const selectedMapping = useSelector((state) => state.mappings.activeMapping);
    const canCreateMapping = useSelector(canCreateNewMapping);

    useEffect(() => {
        // Fetch data on mount
        dispatch(getMappings());
        dispatch(getNetworkNames());
        dispatch(getModels());
        dispatch(getAutomatonDefinitions());
    }, [dispatch]);

    // Mappings
    const addMapping = () => {
        dispatch(MappingSlice.actions.createMapping());
        dispatch(NetworkSlice.actions.cleanNetwork());
        dispatch(MappingSlice.actions.changeFilteredType(RuleEquipmentTypes[0]));
        dispatch(MappingSlice.actions.changeFilteredFamily(AutomatonFamily.CURRENT));
    };

    const renameMapping = (name) => (newName) => {
        dispatch(
            renameMappingAction({
                nameToReplace: name,
                newName: newName,
            })
        );
        dispatch(NetworkSlice.actions.cleanNetwork());
    };

    const selectMapping = (name) => () => {
        dispatch(MappingSlice.actions.selectMapping({ name }));
        dispatch(NetworkSlice.actions.cleanNetwork());
        dispatch(MappingSlice.actions.changeFilteredType(RuleEquipmentTypes[0]));
        dispatch(MappingSlice.actions.changeFilteredFamily(AutomatonFamily.CURRENT));
    };

    const deleteMapping = (name) => () => {
        dispatch(deleteMappingAction(name));
        if (name === selectedMapping) {
            dispatch(NetworkSlice.actions.cleanNetwork());
            dispatch(MappingSlice.actions.changeFilteredType(RuleEquipmentTypes[0]));
            dispatch(MappingSlice.actions.changeFilteredFamily(AutomatonFamily.CURRENT));
        }
    };

    const copyMapping = (name) => () => {
        dispatch(copyMappingAction({ originalName: name, copyName: name + ' Copy' }));
    };

    return (
        <>
            <Typography variant="h4" align={'center'}>
                Mappings
            </Typography>
            <Divider />
            <NavigationMenu
                items={mappingsInfo}
                addItem={addMapping}
                deleteItem={deleteMapping}
                renameItem={renameMapping}
                copyItem={copyMapping}
                selectItem={selectMapping}
                selected={selectedMapping}
                canAdd={canCreateMapping}
                addTooltip={!canCreateMapping ? CANNOT_CREATE_MAPPING_LABEL : undefined}
            />
        </>
    );
};

export default MenuContainer;
