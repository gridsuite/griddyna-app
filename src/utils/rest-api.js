/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const PREFIX_USER_ADMIN_SERVER_QUERIES =
    process.env.REACT_APP_API_GATEWAY + '/user-admin';

export function fetchValidateUser(user) {
    if (!user)
        return Promise.reject(
            new Error('Error : Fetching access for missing user : ' + user)
        );

    console.info(`Fetching access for user...`);
    const CheckAccessUrl =
        PREFIX_USER_ADMIN_SERVER_QUERIES + `/v1/users/${user?.profile?.sub}`;
    console.debug(CheckAccessUrl);

    return fetch(CheckAccessUrl, {
        method: 'head',
        headers: {
            Authorization: 'Bearer ' + user?.id_token,
        },
    }).then((response) => {
        if (response.status === 200) return true;
        else if (
            response.status === 204 ||
            response.status === 403 ||
            response.status === 401
        )
            return false;
        else throw new Error(response.status + ' ' + response.statusText);
    });
}

export function fetchAppsAndUrls() {
    console.info(`Fetching apps and urls...`);
    return fetch('env.json')
        .then((res) => res.json())
        .then((res) => {
            return fetch(
                res.appsMetadataServerUrl + '/apps-metadata.json'
            ).then((response) => {
                return response.json();
            });
        });
}
