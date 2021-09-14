/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const API_URL =
    process.env.REACT_APP_API_PREFIX +
    (process.env.REACT_APP_USE_AUTHENTICATION === 'true'
        ? process.env.REACT_APP_GATEWAY_PREFIX + '/dynamic-mapping'
        : process.env.REACT_APP_URI) +
    '/network';

export function getPropertyValuesFromFile(networkFile, token) {
    const formData = new FormData();
    formData.append('file', networkFile);

    return fetch(`${API_URL}/new`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token,
        },
        cache: 'default',
        body: formData,
    });
}

export function getPropertyValuesFromId(networkId, token) {
    return fetch(`${API_URL}/${networkId}/values`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        cache: 'default',
    });
}

export function getNetworksName(token) {
    return fetch(`${API_URL}/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        cache: 'default',
    });
}
