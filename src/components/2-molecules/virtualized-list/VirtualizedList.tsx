/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactNode, RefObject } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Box } from '@mui/material';

interface VirtualizedListProps {
    count: number;
    scrollElementRef: RefObject<HTMLElement | null>;
    renderItem: (index: number) => ReactNode;
    estimateSize?: number;
    overscan?: number;
    enabled?: boolean;
}

export default function VirtualizedList({
    count,
    scrollElementRef,
    renderItem,
    estimateSize = 300,
    overscan = 3,
    enabled = true,
}: VirtualizedListProps) {
    const virtualizer = useVirtualizer({
        count,
        getScrollElement: () => scrollElementRef.current,
        estimateSize: () => estimateSize,
        overscan,
    });
    console.log('xxx virtualizer', { itemsCount: virtualizer.getVirtualItems() });
    if (!enabled) {
        return null;
    }

    return (
        <Box
            sx={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
            }}
        >
            {virtualizer.getVirtualItems().map((virtualItem) => (
                <Box
                    key={virtualItem.key}
                    data-index={virtualItem.index}
                    ref={virtualizer.measureElement}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualItem.start}px)`,
                    }}
                >
                    {renderItem(virtualItem.index)}
                </Box>
            ))}
        </Box>
    );
}
