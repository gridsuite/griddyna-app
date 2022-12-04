/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { store } from '../redux/store';
const PREFIX_USER_ADMIN_SERVER_QUERIES =
    process.env.REACT_APP_API_PREFIX +
    process.env.REACT_APP_GATEWAY_PREFIX +
    '/user-admin';

// If you want to use user-admin-server in dev mode you must avoid passing through gateway
// and use the user-admin-server directly. SetupProxy should allow this.
// const PREFIX_USER_ADMIN_SERVER_QUERIES =
//     process.env.REACT_APP_API_PREFIX +
//     (process.env.REACT_APP_USE_AUTHENTICATION === 'true'
//         ? process.env.REACT_APP_API_GATEWAY + '/user-admin'
//         : process.env.REACT_APP_USER_ADMIN_URI);

function getToken() {
    const state = store.getState();
    return state.user.id_token;
}

function parseError(text) {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
}

function handleResponse(response, expectsJson) {
    if (response.ok) {
        if (expectsJson === undefined) return response;
        else return expectsJson ? response.json() : response.text();
    } else {
        return response.text().then((text) => {
            const errorJson = parseError(text);
            if (errorJson) {
                return Promise.reject({
                    status: errorJson.status,
                    statusText: errorJson.error,
                    message: errorJson.message || response.statusText,
                });
            } else {
                return Promise.reject({
                    status: response.status,
                    statusText: response.statusText,
                    message: response.statusText,
                });
            }
        });
    }
}

function prepareRequest(init, token) {
    if (!(typeof init == 'undefined' || typeof init == 'object')) {
        throw new TypeError(
            'Argument 2 of backendFetch is not an object' + typeof init
        );
    }
    const initCopy = Object.assign({}, init);
    initCopy.headers = new Headers(initCopy.headers || {});
    const tokenCopy = token ? token : getToken();
    initCopy.headers.append('Authorization', 'Bearer ' + tokenCopy);
    return initCopy;
}

export function backendFetch(url, init, token) {
    const initCopy = prepareRequest(init, token);
    return fetch(url, initCopy).then((response) => handleResponse(response));
}

export function backendFetchText(url, init, token) {
    const initCopy = prepareRequest(init, token);
    return fetch(url, initCopy).then((response) =>
        handleResponse(response, false)
    );
}

export function backendFetchJson(url, init, token) {
    const initCopy = prepareRequest(init, token);
    return fetch(url, initCopy).then((response) =>
        handleResponse(response, true)
    );
}
export function fetchValidateUser(user) {
    const sub = user?.profile?.sub;
    if (!sub)
        return Promise.reject(
            new Error(
                'Error : Fetching access for missing user.profile.sub : ' + user
            )
        );

    console.info(`Fetching access for user...`);
    const CheckAccessUrl =
        PREFIX_USER_ADMIN_SERVER_QUERIES + `/v1/users/${sub}`;
    console.debug(CheckAccessUrl);

    return backendFetch(
        CheckAccessUrl,
        {
            method: 'head',
        },
        user?.id_token
    )
        .then((response) => {
            //if the response is ok, the responseCode will be either 200 or 204 otherwise it's an error and it will be caught
            return response.status === 200;
        })
        .catch((error) => {
            if (error.status === 403) return false;
            else throw new Error(error.status + ' ' + error.statusText);
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
