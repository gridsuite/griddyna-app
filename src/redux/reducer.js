/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { combineReducers } from '@reduxjs/toolkit';
import { InstanceModelReducer } from './slices/InstanceModel';
import { MappingReducer } from './slices/Mapping';
import { ThemeReducer } from './slices/Theme';
import { UserReducer } from './slices/User';
import { ScriptReducer } from './slices/Script';

export const reducer = combineReducers({
    user: UserReducer,
    theme: ThemeReducer,
    mappings: MappingReducer,
    instanceModels: InstanceModelReducer,
    scripts: ScriptReducer,
});
