/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { Navigate, Route, Routes } from 'react-router';
import { getPreLoginPath } from '@gridsuite/commons-ui';
import { Loader } from 'components/1-atoms/Loader';
import RootContainer from 'containers/RootContainer';
import { APP_PATHS } from './app-paths';

export const AppRouter = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path={APP_PATHS.home} element={<RootContainer />} />
                <Route path={APP_PATHS.signInCallback} element={<Navigate replace to={getPreLoginPath() || '/'} />} />
                <Route
                    path={APP_PATHS.logoutCallback}
                    element={<h1>Error: logout failed; you are still logged in.</h1>}
                />
                <Route
                    path={APP_PATHS.notFound}
                    element={
                        <h1>
                            <FormattedMessage id="PageNotFound" />
                        </h1>
                    }
                />
            </Routes>
        </Suspense>
    );
};
