/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContextMenu from './ContextMenu';
import RenameDialog from './RenameDialog';
import NewButton from '../1-atoms/buttons/NewButton';
import { styles } from './NavigationMenuStyles';

const NavigationMenu = (props) => {
    const {
        items,
        addItem,
        deleteItem,
        renameItem,
        copyItem,
        selectItem,
        selected = '',
        canAdd = true,
        addTooltip = '',
    } = props;

    const [anchor, setAnchor] = useState(null);
    //TODO ADD + Rename
    const [openDialog, setOpenDialog] = useState(null);
    const setMenu = (event) => setAnchor(event.currentTarget);

    const buildOptions = (itemName) => {
        let options = [];
        if (deleteItem) {
            options.push({
                label: 'Delete',
                action: deleteItem(itemName),
            });
        }
        if (renameItem) {
            options.push({
                label: 'Rename',
                action: () => setOpenDialog(itemName),
            });
        }
        if (copyItem) {
            options.push({
                label: 'Copy',
                action: copyItem(itemName),
            });
        }
        return options;
    };
    const closeContextMenu = () => setAnchor(null);

    const closeDialog = () => {
        closeContextMenu();
        setOpenDialog(null);
    };

    return (
        <>
            <List>
                {items.map((item) => {
                    return (
                        <ListItem
                            button
                            key={item.name}
                            onClick={selectItem(item.name)}
                            selected={item.name === selected}
                        >
                            <ListItemText primary={item.name} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" id={item.name} onClick={setMenu}>
                                    <MoreVertIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
            {addItem !== undefined && (
                <NewButton onClick={addItem} sx={styles.new} disabled={!canAdd} tooltip={addTooltip} />
            )}
            {anchor !== null && (
                <ContextMenu anchorEl={anchor} open onClose={closeContextMenu} options={buildOptions(anchor.id)} />
            )}
            {openDialog !== null && (
                <RenameDialog
                    open
                    handleClose={closeDialog}
                    handleConfirm={renameItem(openDialog)}
                    previousName={openDialog}
                />
            )}
        </>
    );
};

NavigationMenu.propTypes = {
    items: PropTypes.array.isRequired,
    addItem: PropTypes.func,
    deleteItem: PropTypes.func,
    renameItem: PropTypes.func,
    copyItem: PropTypes.func,
    selectItem: PropTypes.func.isRequired,
    selected: PropTypes.string,
    canAdd: PropTypes.bool,
    addTooltip: PropTypes.string,
};

export default NavigationMenu;
