/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addMapping as addMappingAction,
    copyMapping as copyMappingAction,
    deleteMapping as deleteMappingAction,
    exportMapping as exportMappingAction,
    getAddError,
    getExportError,
    getMappings,
    getMappingsInfo,
    MappingSlice,
    renameMapping as renameMappingAction,
} from '../redux/slices/Mapping';
import NavigationMenu from '../components/2-molecules/NavigationMenu';
import { getNetworkNames, NetworkSlice } from '../redux/slices/Network';
import { getAutomatonDefinitions, getModels } from '../redux/slices/Model';
import { RuleEquipmentTypes } from '../constants/equipmentType';
import { AutomatonFamily } from '../constants/automatonDefinition';
import { useSnackMessage } from '@gridsuite/commons-ui';

const MenuContainer = () => {
    const dispatch = useDispatch();
    const mappingsInfo = useSelector(getMappingsInfo);
    const selectedMapping = useSelector((state) => state.mappings.activeMapping);

    useEffect(() => {
        // Fetch data on mount
        dispatch(getMappings());
        dispatch(getNetworkNames());
        dispatch(getModels());
        dispatch(getAutomatonDefinitions());
    }, [dispatch]);

    // Mappings
    const addMapping = ({ operationType, file, name, description, parentDirectoryUuid }) => {
        dispatch(addMappingAction({ operationType, file, name, description, parentDirectoryUuid }));
        dispatch(NetworkSlice.actions.cleanNetwork());
        dispatch(MappingSlice.actions.changeFilteredType(RuleEquipmentTypes[0]));
        dispatch(MappingSlice.actions.changeFilteredFamily(AutomatonFamily.CURRENT));
    };

    const renameMapping = ({ id, newName }) => {
        dispatch(
            renameMappingAction({
                id: id,
                newName: newName,
            })
        );
        dispatch(NetworkSlice.actions.cleanNetwork());
    };

    const selectMapping = (id) => () => {
        dispatch(MappingSlice.actions.selectMapping({ id }));
        dispatch(NetworkSlice.actions.cleanNetwork());
        dispatch(MappingSlice.actions.changeFilteredType(RuleEquipmentTypes[0]));
        dispatch(MappingSlice.actions.changeFilteredFamily(AutomatonFamily.CURRENT));
    };

    const deleteMapping = (id) => () => {
        dispatch(deleteMappingAction(id));
        if (id === selectedMapping) {
            dispatch(NetworkSlice.actions.cleanNetwork());
            dispatch(MappingSlice.actions.changeFilteredType(RuleEquipmentTypes[0]));
            dispatch(MappingSlice.actions.changeFilteredFamily(AutomatonFamily.CURRENT));
        }
    };

    const copyMapping = (id) => () => {
        dispatch(copyMappingAction({ originalId: id }));
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
            deleteItem={deleteMapping}
            renameItem={renameMapping}
            copyItem={copyMapping}
            exportItem={exportMapping}
            selectItem={selectMapping}
            selected={selectedMapping}
        />
    );
};

export default MenuContainer;
