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
    exportMapping as exportMappingAction,
    getMappings,
    getMappingsInfo,
    MappingSlice,
} from '../redux/slices/Mapping';
import NavigationMenu from '../components/2-molecules/NavigationMenu';
import { NetworkSlice } from '../redux/slices/Network';
import { getAutomatonDefinitions, getModels } from '../redux/slices/Model';
import { RuleEquipmentTypes } from '../constants/equipmentType';
import { AutomatonFamily } from '../constants/automatonDefinition';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { addFavoriteMappings, getFavoriteMappings, removeFavoriteMappings } from '../redux/slices/Config';

const MenuContainer = () => {
    const { snackError } = useSnackMessage();

    const dispatch = useDispatch();
    const mappingsInfo = useSelector(getMappingsInfo);
    const selectedMapping = useSelector((state) => state.mappings.activeMapping);
    const favoriteMappings = useSelector(getFavoriteMappings);

    // On mount component
    useEffect(() => {
        // shared between workspaces, fetch data on mount
        dispatch(getModels());
        dispatch(getAutomatonDefinitions());
    }, [dispatch]);

    // Note that favoriteMappings is not used to render the menu with mapping names
    // The menu is still rendered by mappingsInfo
    useEffect(() => {
        if (!favoriteMappings) {
            return;
        }
        dispatch(getMappings({ ids: favoriteMappings }))
            .unwrap()
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'getMappingsError', messageId: error.message });
            });
    }, [dispatch, snackError, favoriteMappings]);

    // Mappings
    const addMapping = ({ operationType, file, name, description, directoryInputUuid }) => {
        dispatch(addMappingAction({ operationType, file, name, description, directoryInputUuid }))
            .unwrap()
            .then((newAddedMapping) => {
                dispatch(addFavoriteMappings({ mappingId: newAddedMapping.id }))
                    .unwrap()
                    .catch((error) => {
                        // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                        snackError({ headerId: 'addFavoriteMappingsError', messageId: error.message });
                    });
            })
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'addMappingError', messageId: error.message });
            });
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
        dispatch(MappingSlice.actions.removeMapping({ id }));
        if (id === selectedMapping) {
            dispatch(NetworkSlice.actions.cleanNetwork());
            dispatch(MappingSlice.actions.changeFilteredType(RuleEquipmentTypes[0]));
            dispatch(MappingSlice.actions.changeFilteredFamily(AutomatonFamily.CURRENT));
        }
        dispatch(removeFavoriteMappings({ mappingId: id }))
            .unwrap()
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'removeFavoriteMappingsError', messageId: error.message });
            });
    };

    const exportMapping = (id, name) => () => {
        dispatch(exportMappingAction({ id, name }))
            .unwrap()
            .catch((error) => {
                // TODO use snackWithFallback instead of snackError when correct RTK serialize error
                snackError({ headerId: 'exportMappingError', messageId: error.message });
            });
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
