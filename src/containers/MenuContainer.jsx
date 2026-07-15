/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addMapping as addMappingAction,
    exportMapping as exportMappingAction,
    getAddError,
    getExportError,
    getMappings,
    getMappingsInfo,
    MappingSlice,
    removeMapping as removeMappingAction,
} from '../redux/slices/Mapping';
import NavigationMenu from '../components/2-molecules/NavigationMenu';
import { getNetworkNames, NetworkSlice } from '../redux/slices/Network';
import { getAutomatonDefinitions, getModels } from '../redux/slices/Model';
import { RuleEquipmentTypes } from '../constants/equipmentType';
import { AutomatonFamily } from '../constants/automatonDefinition';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { getWorkspace, loadWorkspace } from '../redux/slices/Workspace.ts';

const MenuContainer = () => {
    const dispatch = useDispatch();
    const mappingsInfo = useSelector(getMappingsInfo);
    const selectedMapping = useSelector((state) => state.mappings.activeMapping);
    const workspace = useSelector(getWorkspace);
    const [workspaceInitialized, setWorkspaceInitialized] = useState(false);

    // On mount component
    useEffect(() => {
        // shared between workspaces, fetch data on mount
        dispatch(getNetworkNames());
        dispatch(getModels());
        dispatch(getAutomatonDefinitions());

        // fetch workspace configuration only once on mount
        dispatch(loadWorkspace());
    }, [dispatch]);

    // On loaded workspace
    // Note that mappingWorkspaceItems is not used to render the menu with mapping names
    // The menu is still rendered by mappingsInfo
    useEffect(() => {
        if (!workspace) {
            return;
        }
        if (!workspaceInitialized) {
            const ids = workspace.mappingWorkspaceItems.map((elem) => elem.mappingId);
            dispatch(getMappings({ ids }))
                .unwrap()
                .then((_) => {
                    setWorkspaceInitialized(true);
                });
        }
    }, [dispatch, workspace, workspaceInitialized]);

    // Mappings
    const addMapping = ({ operationType, file, name, description, directoryInputUuid }) => {
        dispatch(addMappingAction({ operationType, file, name, description, directoryInputUuid }));
        dispatch(NetworkSlice.actions.cleanNetwork());
        dispatch(MappingSlice.actions.changeFilteredType(RuleEquipmentTypes[0]));
        dispatch(MappingSlice.actions.changeFilteredFamily(AutomatonFamily.CURRENT));
    };

    const selectMapping = (id) => () => {
        dispatch(MappingSlice.actions.selectMapping({ id }));
        dispatch(NetworkSlice.actions.cleanNetwork());
        dispatch(MappingSlice.actions.changeFilteredType(RuleEquipmentTypes[0]));
        dispatch(MappingSlice.actions.changeFilteredFamily(AutomatonFamily.CURRENT));
    };

    const removeMapping = (id) => () => {
        dispatch(removeMappingAction(id));
        if (id === selectedMapping) {
            dispatch(NetworkSlice.actions.cleanNetwork());
            dispatch(MappingSlice.actions.changeFilteredType(RuleEquipmentTypes[0]));
            dispatch(MappingSlice.actions.changeFilteredFamily(AutomatonFamily.CURRENT));
        }
    };

    const { snackError } = useSnackMessage();
    const exportError = useSelector(getExportError);
    const addError = useSelector(getAddError);

    // Show snackbar when an export error occurs
    useEffect(() => {
        if (exportError) {
            // TODO use snackWithFallback instead of snackError when correct RTK serialize error
            snackError({ messageId: 'exportMappingError', messageTxt: exportError });
        }
    }, [exportError, snackError]);

    // Show snackbar when an add error occurs
    useEffect(() => {
        if (addError) {
            // TODO use snackWithFallback instead of snackError when correct RTK serialize error
            snackError({ headerId: 'addMappingError', messageId: addError });
        }
    }, [addError, snackError]);

    const exportMapping = (id, name) => () => {
        dispatch(exportMappingAction({ id, name }));
    };

    return (
        <NavigationMenu
            items={mappingsInfo}
            addItem={addMapping}
            removeItem={removeMapping}
            exportItem={exportMapping}
            selectItem={selectMapping}
            selected={selectedMapping}
        />
    );
};

export default MenuContainer;
