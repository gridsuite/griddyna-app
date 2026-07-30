/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, List, ListItem, ListItemButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContextMenu from './ContextMenu';
import AddButton from '../1-atoms/buttons/AddButton.jsx';
import { styles } from './NavigationMenuStyles';
import NewMappingDialog from './rhf/dialogs/new-mapping/NewMappingDialog.tsx';
import { useIntl } from 'react-intl';
import { OverflowableText } from '@gridsuite/commons-ui';

const NavigationMenu = (props) => {
    const { items, removeItem, exportItem, addItem, selectItem, selected = undefined } = props;
    const intl = useIntl();

    const [anchor, setAnchor] = useState(null);

    const [addDialog, setAddDialog] = useState(null);
    const setMenu = (event) => setAnchor(event.currentTarget);

    const buildOptions = useCallback(
        (itemId) => {
            const itemName = items?.find((item) => item.id === itemId)?.name;
            const options = [];
            if (removeItem) {
                options.push({
                    label: intl.formatMessage({ id: 'removeMapping' }),
                    action: removeItem(itemId),
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
        [removeItem, exportItem, intl, items]
    );

    const closeContextMenu = () => setAnchor(null);

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
                        <ListItem
                            key={item.id}
                            secondaryAction={
                                <IconButton edge="end" id={item.id} onClick={setMenu}>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton selected={item.id === selected} onClick={selectItem(item.id)}>
                                <OverflowableText text={item.name} sx={styles.itemText} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            {anchor !== null && (
                <ContextMenu anchorEl={anchor} open onClose={closeContextMenu} options={buildOptions(anchor.id)} />
            )}
            {addDialog !== null && <NewMappingDialog open onClose={closeAddDialog} onSubmit={addItem} items={items} />}
        </>
    );
};

NavigationMenu.propTypes = {
    items: PropTypes.array.isRequired,
    addItem: PropTypes.func,
    removeItem: PropTypes.func,
    exportItem: PropTypes.func,
    selectItem: PropTypes.func.isRequired,
    selected: PropTypes.string,
};

export default NavigationMenu;
