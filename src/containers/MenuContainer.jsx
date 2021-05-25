import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    MappingSlice,
    getMappingsInfo,
    getMappings,
    deleteMapping as deleteMappingAction,
    renameMapping as renameMappingAction,
    copyMapping as copyMappingAction,
} from '../redux/slices/Mapping';
import NavigationMenu from '../components/2-molecules/NavigationMenu';
import { convertScript } from '../redux/slices/Script';
import { Divider, Typography } from '@material-ui/core';

const MenuContainer = () => {
    const dispatch = useDispatch();
    const mappingsInfo = useSelector(getMappingsInfo);
    const selectedMapping = useSelector(
        (state) => state.mappings.activeMapping
    );

    useEffect(() => {
        dispatch(getMappings());
    }, [dispatch]);

    const addMapping = () => dispatch(MappingSlice.actions.createMapping());

    const renameMapping = (name) => (newName) =>
        dispatch(
            renameMappingAction({
                nameToReplace: name,
                newName: newName,
            })
        );

    const selectMapping = (name) => () =>
        dispatch(MappingSlice.actions.selectMapping({ name }));

    const deleteMapping = (name) => () => {
        dispatch(deleteMappingAction(name));
    };

    const copyMapping = (name) => () => {
        dispatch(
            copyMappingAction({ originalName: name, copyName: name + ' Copy' })
        );
    };

    const convertMappingToScript = (name) => () =>
        dispatch(convertScript(name));

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
            />
        </>
    );
};

export default MenuContainer;
