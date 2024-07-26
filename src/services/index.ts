/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getUser } from '../redux/store';
import {
    AppsMetadataComSvc,
    ConfigComSvc,
    ConfigNotificationComSvc,
    DirectoryComSvc,
    ExploreComSvc,
    setCommonServices,
    StudyComSvc,
    UserAdminComSvc,
} from '@gridsuite/commons-ui';
import AppLocalSvc from './app-local';
import DynamicMappingSvc from './dynamic-mapping';

export type { EnvJson } from './app-local';

// If you want to use user-admin-server in dev mode you must avoid passing through gateway
// and use the user-admin-server directly. SetupProxy should allow this.

export const appLocalSrv = new AppLocalSvc(),
    appsMetadataSrv = new AppsMetadataComSvc(appLocalSrv),
    configSrv = new ConfigComSvc(
        process.env.REACT_APP_NAME!,
        getUser,
        // @ts-expect-error url type incompatibility
        process.env.REACT_APP_API_GATEWAY
    ),
    configNotificationSrv = new ConfigNotificationComSvc(
        getUser,
        // @ts-expect-error url type incompatibility
        process.env.REACT_APP_WS_GATEWAY
    ),
    directorySrv = new DirectoryComSvc(
        getUser,
        // @ts-expect-error url type incompatibility
        process.env.REACT_APP_API_GATEWAY
    ),
    // @ts-expect-error url type incompatibility
    exploreSrv = new ExploreComSvc(getUser, process.env.REACT_APP_API_GATEWAY),
    // @ts-expect-error url type incompatibility
    studySrv = new StudyComSvc(getUser, process.env.REACT_APP_API_PREFIX),
    userAdminSrv = new UserAdminComSvc(
        getUser,
        // @ts-expect-error url type incompatibility
        process.env.REACT_APP_API_GATEWAY
    ),
    dynamicMappingSrv = new DynamicMappingSvc();

setCommonServices(
    appLocalSrv,
    appsMetadataSrv,
    configSrv,
    configNotificationSrv,
    directorySrv,
    exploreSrv,
    studySrv,
    userAdminSrv
);
