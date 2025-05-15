/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useMemo } from 'react';
import { getUrlWithToken, getWsBase } from '../utils/rest-api';
import { useAppSelector } from '../redux/store';

export enum NotificationUrlKeys {
    GLOBAL_CONFIG = 'GLOBAL_CONFIG',
}

export const PREFIX_CONFIG_NOTIFICATION_WS = `${import.meta.env.VITE_WS_GATEWAY}/config-notification`;

export default function useNotificationsUrlGenerator(): Record<NotificationUrlKeys, string | undefined> {
    // The websocket API doesn't allow relative urls
    const wsBase = getWsBase();
    const tokenId = useAppSelector((state) => state.user?.user?.id_token);

    // return a mapper with NOTIFICATIONS_URL_KEYS and undefined value if URL is not yet buildable (tokenId)
    // it will be used to register listeners as soon as possible.
    return useMemo(
        () => ({
            [NotificationUrlKeys.GLOBAL_CONFIG]: tokenId
                ? getUrlWithToken(`${wsBase}${PREFIX_CONFIG_NOTIFICATION_WS}/global`, tokenId)
                : undefined,
        }),
        [tokenId, wsBase]
    );
}
