/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    MappingSlice,
    getMappingsInfo,
    getMappings,
    deleteMapping as deleteMappingAction,
    renameMapping as renameMappingAction,
    copyMapping as copyMappingAction,
    canCreateNewMapping,
} from '../redux/slices/Mapping';
import NavigationMenu from '../components/2-molecules/NavigationMenu';
import {
    ScriptsSlice,
    convertScript,
    getScripts,
    getScriptsInfo,
    deleteScript as deleteScriptAction,
    renameScript as renameScriptAction,
    copyScript as copyScriptAction,
} from '../redux/slices/Script';
import { NetworkSlice } from '../redux/slices/Network';
import { Divider, Typography } from '@material-ui/core';

const CANNOT_CREATE_MAPPING_LABEL = '"default" is already taken';
const MenuContainer = () => {
    const dispatch = useDispatch();
    const mappingsInfo = useSelector(getMappingsInfo);
    const scriptsInfo = useSelector(getScriptsInfo);
    const selectedMapping = useSelector(
        (state) => state.mappings.activeMapping
    );
    const selectedScript = useSelector((state) => state.scripts.activeScript);
    const canCreateMapping = useSelector(canCreateNewMapping);

    useEffect(() => {
        dispatch(getMappings());
        dispatch(getScripts());
    }, [dispatch]);

    // Mappings
    const addMapping = () => {
        dispatch(MappingSlice.actions.createMapping());
        dispatch(NetworkSlice.actions.cleanNetwork());
        dispatch(MappingSlice.actions.changeFilteredType(''));
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
        dispatch(ScriptsSlice.actions.deselectScript());
        dispatch(NetworkSlice.actions.cleanNetwork());
        dispatch(MappingSlice.actions.changeFilteredType(''));
    };

    const deleteMapping = (name) => () => {
        dispatch(deleteMappingAction(name));
        if (name === selectedMapping) {
            dispatch(NetworkSlice.actions.cleanNetwork());
            dispatch(MappingSlice.actions.changeFilteredType(''));
        }
    };

    const copyMapping = (name) => () => {
        dispatch(
            copyMappingAction({ originalName: name, copyName: name + ' Copy' })
        );
    };

    const convertMappingToScript = (name) => () =>
        dispatch(convertScript(name));

    // Scripts

    const selectScript = (name) => () => {
        dispatch(ScriptsSlice.actions.selectScript({ name }));
        dispatch(MappingSlice.actions.deselectMapping());
        dispatch(NetworkSlice.actions.cleanNetwork());
    };

    const renameScript = (name) => (newName) =>
        dispatch(
            renameScriptAction({
                nameToReplace: name,
                newName: newName,
            })
        );

    const deleteScript = (name) => () => {
        dispatch(deleteScriptAction(name));
    };

    const copyScript = (name) => () => {
        dispatch(
            copyScriptAction({ originalName: name, copyName: name + ' Copy' })
        );
    };

    return (
        <>
            <Typography variant="h2">Mappings</Typography>
            <Divider />
            <NavigationMenu
                items={mappingsInfo}
                addItem={addMapping}
                deleteItem={deleteMapping}
                renameItem={renameMapping}
                copyItem={copyMapping}
                selectItem={selectMapping}
                convertItem={convertMappingToScript}
                selected={selectedMapping}
                canAdd={canCreateMapping}
                addTooltip={
                    !canCreateMapping ? CANNOT_CREATE_MAPPING_LABEL : undefined
                }
            />
            {scriptsInfo.length > 0 && (
                <>
                    <div />
                    <Divider />
                    <Typography variant="h2">Scripts</Typography>
                    <Divider />
                    <NavigationMenu
                        items={scriptsInfo}
                        deleteItem={deleteScript}
                        renameItem={renameScript}
                        copyItem={copyScript}
                        selectItem={selectScript}
                        selected={selectedScript}
                    />
                </>
            )}
        </>
    );
};

export default MenuContainer;
