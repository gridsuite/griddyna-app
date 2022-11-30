/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { backendFetch, backendFetchJson } from '../utils/rest-api';

const API_URL =
    process.env.REACT_APP_API_PREFIX +
    (process.env.REACT_APP_USE_AUTHENTICATION === 'true'
        ? process.env.REACT_APP_GATEWAY_PREFIX + '/dynamic-mapping'
        : process.env.REACT_APP_URI) +
    '/mappings';

export function postMapping(
    mappingName,
    rules,
    automata,
    controlledParameters,
    token
) {
    return backendFetchJson(
        `${API_URL}/${mappingName}`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
            body: JSON.stringify({
                name: mappingName,
                rules,
                automata,
                controlledParameters,
            }),
        },
        token
    );
}

export function getMappings(token) {
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

export function deleteMapping(mappingName, token) {
    return backendFetch(
        `${API_URL}/${mappingName}`,
        {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
        },
        token
    );
}

export async function renameMapping(nameToReplace, newName, token) {
    return backendFetchJson(
        `${API_URL}/rename/${nameToReplace}/to/${newName}`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
        },
        token
    );
}

export async function copyMapping(originalName, copyName, token) {
    return backendFetchJson(
        `${API_URL}/copy/${originalName}/to/${copyName}`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
        },
        token
    );
}
