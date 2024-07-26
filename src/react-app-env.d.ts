/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/// <reference types="react-scripts" />

namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_API_GATEWAY: string;
        REACT_APP_WS_GATEWAY: string;

        REACT_APP_API_PREFIX: string;
        REACT_APP_DYNAMAP_SVC: string;
    }
}
