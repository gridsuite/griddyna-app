import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    ListItemSecondaryAction,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import ContextMenu from './ContextMenu';
import RenameDialog from './RenameDialog';
import NewButton from '../1-atoms/NewButton';
import { useStyles } from './NavigationMenuStyles';

const NavigationMenu = (props) => {
    const {
        items,
        addItem,
        deleteItem,
        renameItem,
        copyItem,
        selectItem,
        convertItem,
        selected = '',
    } = props;

    const [anchor, setAnchor] = useState(null);
    //TODO ADD + Rename
    const [openDialog, setOpenDialog] = useState(null);
    const classes = useStyles();
    const setMenu = (event) => setAnchor(event.currentTarget);

    const buildOptions = (itemName) => {
        let options = [
            {
                label: 'Convert to .groovy',
                action: convertItem(itemName),
            },
            {
                label: 'Delete',
                action: deleteItem(itemName),
            },
        ];
        if (renameItem) {
            options.push({
                label: 'Rename',
                action: () => setOpenDialog(itemName),
            });
        }
        if (renameItem) {
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
                                <IconButton
                                    edge="end"
                                    id={item.name}
                                    onClick={setMenu}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
            <NewButton onClick={addItem} className={classes.new} />
            {anchor !== null && (
                <ContextMenu
                    anchorEl={anchor}
                    open
                    onClose={closeContextMenu}
                    options={buildOptions(anchor.id)}
                />
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
    addItem: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    renameItem: PropTypes.func,
    copyItem: PropTypes.func,
    selectItem: PropTypes.func.isRequired,
    convertItem: PropTypes.func,
    selected: PropTypes.string,
};

export default NavigationMenu;
