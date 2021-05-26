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
import {
    ScriptsSlice,
    convertScript,
    getScripts,
    getScriptsInfo,
    deleteScript as deleteScriptAction,
    renameScript as renameScriptAction,
    copyScript as copyScriptAction,
} from '../redux/slices/Script';
import { Divider, Typography } from '@material-ui/core';

const MenuContainer = () => {
    const dispatch = useDispatch();
    const mappingsInfo = useSelector(getMappingsInfo);
    const scriptsInfo = useSelector(getScriptsInfo);
    const selectedMapping = useSelector(
        (state) => state.mappings.activeMapping
    );
    const selectedScript = useSelector((state) => state.scripts.activeScript);

    useEffect(() => {
        dispatch(getMappings());
        dispatch(getScripts());
    }, [dispatch]);

    // Mappings
    const addMapping = () => dispatch(MappingSlice.actions.createMapping());

    const renameMapping = (name) => (newName) =>
        dispatch(
            renameMappingAction({
                nameToReplace: name,
                newName: newName,
            })
        );

    const selectMapping = (name) => () => {
        dispatch(MappingSlice.actions.selectMapping({ name }));
        dispatch(ScriptsSlice.actions.deselectScript());
    };

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

    // Scripts

    const selectScript = (name) => () => {
        dispatch(ScriptsSlice.actions.selectScript({ name }));
        dispatch(MappingSlice.actions.deselectMapping());
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
