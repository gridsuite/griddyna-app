/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { backendFetchJson } from '../utils/rest-api';

const API_URL =
    process.env.REACT_APP_API_PREFIX +
    (process.env.REACT_APP_USE_AUTHENTICATION === 'true'
        ? process.env.REACT_APP_GATEWAY_PREFIX + '/dynamic-mapping'
        : process.env.REACT_APP_URI) +
    '/network';

export function getPropertyValuesFromFile(networkFile, token) {
    const formData = new FormData();
    formData.append('file', networkFile);

    return backendFetchJson(
        `${API_URL}/new`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            cache: 'default',
            body: formData,
        },
        token
    );
}

export function getPropertyValuesFromId(networkId, token) {
    return backendFetchJson(
        `${API_URL}/${networkId}/values`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
        },
        token
    );
}

export function getNetworksName(token) {
    return backendFetchJson(
        `${API_URL}/`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
        },
        token
    );
}

export function getNetworkMatchesFromRule(networkId, ruleToMatch, token) {
    return backendFetchJson(
        `${API_URL}/${networkId}/matches/rule`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
            body: JSON.stringify(ruleToMatch),
        },
        token
    );
}

export function deleteNetwork(networkId, token) {
    return backendFetchJson(`${API_URL}/${networkId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        cache: 'default',
    });
}
