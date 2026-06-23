/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContextMenu from './ContextMenu';
import RenameMappingDialog from './rhf/dialogs/rename-mapping/RenameMappingDialog.tsx';
import AddButton from '../1-atoms/buttons/AddButton.jsx';
import { styles } from './NavigationMenuStyles';
import NewMappingDialog from './rhf/dialogs/new-mapping/NewMappingDialog.tsx';
import { useIntl } from 'react-intl';

const NavigationMenu = (props) => {
    const { items, deleteItem, renameItem, copyItem, exportItem, addItem, selectItem, selected = undefined } = props;
    const intl = useIntl();

    const [anchor, setAnchor] = useState(null);
    //TODO ADD + Rename
    const [openDialog, setOpenDialog] = useState(null);
    const [addDialog, setAddDialog] = useState(null);
    const setMenu = (event) => setAnchor(event.currentTarget);

    const buildOptions = useCallback(
        (itemId) => {
            const itemName = items?.find((item) => item.id === itemId)?.name;
            const options = [];
            if (deleteItem) {
                options.push({
                    label: intl.formatMessage({ id: 'deleteMapping' }),
                    action: deleteItem(itemId),
                });
            }
            if (renameItem) {
                options.push({
                    label: intl.formatMessage({ id: 'renameMapping' }),
                    action: () => setOpenDialog({ itemId, itemName }),
                });
            }
            if (copyItem) {
                options.push({
                    label: intl.formatMessage({ id: 'copyMapping' }),
                    action: copyItem(itemId),
                });
            }
            if (exportItem) {
                options.push({
                    label: intl.formatMessage({ id: 'exportMapping' }),
                    action: exportItem(itemId, itemName),
                });
            }
            return options;
        },
        [copyItem, deleteItem, exportItem, intl, renameItem, items]
    );

    const closeContextMenu = () => setAnchor(null);

    const closeRenameDialog = () => {
        closeContextMenu();
        setOpenDialog(null);
    };

    const closeAddDialog = () => {
        setAddDialog(null);
    };

    return (
        <>
            {addItem !== undefined && (
                <AddButton
                    label={intl.formatMessage({ id: 'addMapping' })}
                    onClick={() => setAddDialog(true)}
                    sx={styles.new}
                />
            )}
            <List>
                {items.map((item) => {
                    return (
                        <ListItem button key={item.id} onClick={selectItem(item.id)} selected={item.id === selected}>
                            <ListItemText primary={item.name} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" id={item.id} onClick={setMenu}>
                                    <MoreVertIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
            {anchor !== null && (
                <ContextMenu anchorEl={anchor} open onClose={closeContextMenu} options={buildOptions(anchor.id)} />
            )}
            {openDialog !== null && (
                <RenameMappingDialog
                    open
                    onClose={closeRenameDialog}
                    onSubmit={renameItem}
                    mappingId={openDialog?.itemId}
                    previousName={openDialog?.itemName}
                />
            )}
            {addDialog !== null && <NewMappingDialog open onClose={closeAddDialog} onSubmit={addItem} />}
        </>
    );
};

NavigationMenu.propTypes = {
    items: PropTypes.array.isRequired,
    addItem: PropTypes.func,
    deleteItem: PropTypes.func,
    renameItem: PropTypes.func,
    copyItem: PropTypes.func,
    exportItem: PropTypes.func,
    selectItem: PropTypes.func.isRequired,
    selected: PropTypes.string,
};

export default NavigationMenu;
