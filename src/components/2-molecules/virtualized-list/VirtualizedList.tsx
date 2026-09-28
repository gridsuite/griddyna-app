/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { memo, ReactNode, RefObject, useLayoutEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualizedListProps {
    count: number;
    scrollElementRef: RefObject<HTMLElement | null>;
    renderItem: (index: number) => ReactNode;
    estimateSize?: number;
    overscan?: number;
    disabled?: boolean;
}

function VirtualizedList({
    count,
    scrollElementRef,
    renderItem,
    estimateSize = 300,
    overscan = 3,
    disabled = false,
}: VirtualizedListProps) {
    const listRef = useRef<HTMLDivElement>(null);
    const [scrollMargin, setScrollMargin] = useState(0);

    // compute margin between scroll and list
    useLayoutEffect(() => {
        const scrollElement = scrollElementRef.current;
        const listElement = listRef.current;

        if (!scrollElement || !listElement) {
            return () => {};
        }

        const updateScrollMargin = () => {
            const scrollRect = scrollElement.getBoundingClientRect();
            const listRect = listElement.getBoundingClientRect();

            setScrollMargin(listRect.top - scrollRect.top + scrollElement.scrollTop);
        };

        updateScrollMargin();

        const resizeObserver = new ResizeObserver(updateScrollMargin);

        resizeObserver.observe(scrollElement);
        resizeObserver.observe(listElement);

        return () => {
            resizeObserver.disconnect();
        };
    }, [scrollElementRef]);

    const virtualizer = useVirtualizer({
        count: disabled ? 0 : count, // optimize usage of hook when disabled
        getScrollElement: () => scrollElementRef.current,
        estimateSize: () => estimateSize,
        scrollMargin,
        overscan,
    });

    if (disabled) {
        return null;
    }

    return (
        <Box
            ref={listRef}
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
                        transform: `translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`,
                    }}
                >
                    {renderItem(virtualItem.index)}
                </Box>
            ))}
        </Box>
    );
}

export default memo(VirtualizedList);
