/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TextEncoder, TextDecoder } from 'node:util';
import fetch from './src/_mocks_/fetch';

// fix for ReferenceError: (.*) is not defined
Object.assign(global, { TextDecoder, TextEncoder, fetch });
