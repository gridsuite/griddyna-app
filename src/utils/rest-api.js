/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { store } from '../redux/store';

// If you want to use user-admin-server in dev mode you must avoid passing through gateway
// and use the user-admin-server directly. SetupProxy should allow this.
// const PREFIX_USER_ADMIN_SERVER_QUERIES =
//     import.meta.env.VITE_API_PREFIX +
//     (import.meta.env.VITE_USE_AUTHENTICATION === 'true'
//         ? `${import.meta.env.VITE_API_GATEWAY}/user-admin`
//         : import.meta.env.VITE_USER_ADMIN_URI);

function getToken() {
    const state = store.getState();
    return state.user.id_token;
}

export function getWsBase() {
    return document.baseURI.replace(/^http(s?):\/\//, (_, s) => `ws${s || ''}://`);
}

export function getUrlWithToken(baseUrl, token) {
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}access_token=${token}`;
}

function parseError(text) {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
}

function handleError(response) {
    return response.text().then((text) => {
        const errorName = 'HttpResponseError : ';
        let error;
        const errorJson = parseError(text);
        if (errorJson && errorJson.status && errorJson.error && errorJson.message) {
            error = new Error(
                errorName + errorJson.status + ' ' + errorJson.error + ', message : ' + errorJson.message
            );
            error.status = errorJson.status;
        } else {
            error = new Error(errorName + response.status + ' ' + response.statusText);
            error.status = response.status;
        }
        throw error;
    });
}

function prepareRequest(init, token) {
    if (!(typeof init == 'undefined' || typeof init == 'object')) {
        throw new TypeError('Argument 2 of backendFetch is not an object' + typeof init);
    }
    const initCopy = Object.assign({}, init);
    initCopy.headers = new Headers(initCopy.headers || {});
    const tokenCopy = token ? token : getToken();
    initCopy.headers.append('Authorization', 'Bearer ' + tokenCopy);
    return initCopy;
}

function safeFetch(url, initCopy) {
    return fetch(url, initCopy).then((response) => (response.ok ? response : handleError(response)));
}

export function backendFetch(url, init, token) {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy);
}

export function backendFetchText(url, init, token) {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy).then((safeResponse) => safeResponse.text());
}

export function backendFetchJson(url, init, token) {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy).then((safeResponse) => safeResponse.json());
}

function fetchEnv() {
    return fetch('env.json').then((res) => res.json());
}

export function fetchIdpSettings() {
    return fetch('idpSettings.json').then((res) => res.json());
}

export function fetchAppsAndUrls() {
    console.info(`Fetching apps and urls...`);
    return fetchEnv()
        .then((env) => fetch(env.appsMetadataServerUrl + '/apps-metadata.json'))
        .then((response) => response.json());
}

export function fetchVersion() {
    console.info(`Fetching global metadata...`);
    return fetchEnv()
        .then((env) => fetch(env.appsMetadataServerUrl + '/version.json'))
        .then((response) => response.json())
        .catch((reason) => {
            console.error('Error while fetching the version : ' + reason);
            return reason;
        });
}
