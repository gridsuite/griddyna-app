/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { configureStore } from '@reduxjs/toolkit';
import { initCommonServices } from '@gridsuite/commons-ui';
import { reducer } from './reducer';

export const store = configureStore({ reducer });
export type AppDispatch = typeof store.dispatch;

export function getUser() {
    return store.getState().user?.user;
}
