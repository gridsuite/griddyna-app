/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { configureStore } from '@reduxjs/toolkit';
import { setCommonStore } from '@gridsuite/commons-ui';
import { reducer } from './reducer';

export const store = configureStore({ reducer });
export type AppDispatch = typeof store.dispatch;
setCommonStore({
    getState: () => store.getState().user,
});
