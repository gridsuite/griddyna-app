/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// middleware/notificationMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { NotificationSlice } from '../redux/slices/Notification';

const notificationMiddleware: Middleware =
    (storeAPI) => (next) => (action: any) => {
        const result = next(action);
        if (
            !Object.values(NotificationSlice.actions)
                .map((action) => action.type)
                .some((type) => type === action.type)
        ) {
            // notify only action not in notification slice
            storeAPI.dispatch(
                NotificationSlice.actions.notify({ actionType: action.type })
            );
        }
        return result;
    };

export default notificationMiddleware;
