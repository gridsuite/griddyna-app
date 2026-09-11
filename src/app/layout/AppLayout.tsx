/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PropsWithChildren } from 'react';
import { Stack } from '@mui/material';
import { DevModeBanner } from '@gridsuite/commons-ui';
import { AppSideBar } from 'features/side-bar/components/AppSideBar';

export type AppTopBarProps = {
    onLogoutClick?: () => void;
    isDeveloperMode: boolean;
    isAuthenticated: boolean;
};

export function AppLayout({
    onLogoutClick,
    isDeveloperMode,
    isAuthenticated,
    children,
}: Readonly<PropsWithChildren<AppTopBarProps>>) {
    return (
        <Stack height="100vh">
            {isAuthenticated && isDeveloperMode && <DevModeBanner />}
            <Stack direction="row" flex={1} overflow="hidden">
                <AppSideBar onLogoutClick={onLogoutClick} />
                <Stack flex={1}>
                    {/* AppTopBar can be added here if needed */}
                    {children}
                </Stack>
            </Stack>
        </Stack>
    );
}
