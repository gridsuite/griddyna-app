/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { combineReducers } from '@reduxjs/toolkit';
import { MappingReducer } from './slices/Mapping';
import { UserReducer } from './slices/User';
import { NetworkReducer } from './slices/Network';
import { ModelReducer } from './slices/Model';
import { ConfigReducer } from './slices/Config';

export const rootReducers = combineReducers({
    user: UserReducer,
    mappings: MappingReducer,
    models: ModelReducer,
    network: NetworkReducer,
    configs: ConfigReducer,
});
export type RootState = ReturnType<typeof rootReducers>;
