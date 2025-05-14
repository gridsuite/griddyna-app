/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { configureStore } from '@reduxjs/toolkit';
import { setCommonStore } from '@gridsuite/commons-ui';
import { rootReducers, type RootState } from './reducer';
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({ reducer: rootReducers });
// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>(); // Export a hook that can be reused to resolve types
export const useAppSelector = useSelector.withTypes<RootState>(); // Export a hook that can be reused to resolve types
setCommonStore({
    getState: () => store.getState().user,
});
