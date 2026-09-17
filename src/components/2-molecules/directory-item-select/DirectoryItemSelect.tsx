/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { FolderOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import type { UUID } from 'node:crypto';
import { DirectoryItemSelector, DirectoryItemSelectorProps, TreeViewFinderNodeProps } from '@gridsuite/commons-ui';
import { breadCrumb } from '../../../utils/directory-utils';

const separator = '/';

export type DirectoryItemSelectProps = DirectoryItemSelectorProps & {
    dialogTitleTextId: string;
    noSelectedItemTextId: string;
    disabled?: boolean;
    onItemSelect?: (item: UUID | undefined) => void;
};

/**
 * This component is extracted from the component FilterBasedContingencyListVisualizationPanel of filter-based contingency list in explore-app
 * This is a none-rhf component, it should be moved to commons-ui later, then implement a rhf wrapper based on this pure component.
 */
export default function DirectoryItemSelect({
    types,
    multiSelect,
    dialogTitleTextId,
    noSelectedItemTextId,
    disabled,
    onItemSelect,
}: DirectoryItemSelectProps) {
    const [open, setOpen] = useState<boolean>(false);

    const [selectedItem, setSelectedItem] = useState<string>('');
    const [selectedFolder, setSelectedFolder] = useState<string>('');

    const itemName = selectedFolder ? selectedFolder + separator + selectedItem : selectedItem;

    const formatPathName = useMemo(() => {
        return breadCrumb(itemName);
    }, [itemName]);

    const handleClose = useCallback(
        (nodes: TreeViewFinderNodeProps[]) => {
            if (nodes.length > 0) {
                if (nodes[0].parents && nodes[0].parents.length > 0) {
                    setSelectedFolder(nodes[0].parents.map((entry) => entry.name).join(separator));
                }
                setSelectedItem(nodes[0].name);
                onItemSelect?.(nodes[0].id);
            }
            setOpen(false);
        },
        [onItemSelect]
    );

    return (
        <Grid container alignItems="center" marginY={1}>
            <Grid paddingTop={1}>
                <FolderOutlined />
            </Grid>
            <Grid size="grow" paddingLeft={1}>
                {selectedItem ? (
                    <Typography noWrap fontWeight="bold" title={itemName}>
                        {formatPathName}
                    </Typography>
                ) : (
                    <FormattedMessage id={noSelectedItemTextId} />
                )}
            </Grid>
            <Grid>
                <Button
                    disabled={disabled}
                    onClick={() => setOpen(true)}
                    variant={selectedItem.length > 0 ? 'contained' : undefined}
                    component="label"
                >
                    {selectedItem.length > 0 ? (
                        <FormattedMessage id="edit" />
                    ) : (
                        <FormattedMessage id={dialogTitleTextId} />
                    )}
                </Button>
                <DirectoryItemSelector open={open} types={types} onClose={handleClose} multiSelect={multiSelect} />
            </Grid>
        </Grid>
    );
}
