/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { backendFetchText, backendFetchJson } from '../utils/rest-api';

const API_URL =
    process.env.REACT_APP_API_PREFIX +
    (process.env.REACT_APP_USE_AUTHENTICATION === 'true'
        ? process.env.REACT_APP_GATEWAY_PREFIX + '/dynamic-mapping'
        : process.env.REACT_APP_URI) +
    '/scripts';

export function convertToScript(mappingName, token) {
    return backendFetchJson(
        `${API_URL}/from/${mappingName}`,
        {
            cache: 'default',
        },
        token
    );
}

export function getScripts(token) {
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

export function deleteScript(scriptName, token) {
    return backendFetchText(
        `${API_URL}/${scriptName}`,
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

export async function copyScript(originalName, copyName, token) {
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

export async function renameScript(nameToReplace, newName, token) {
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

export function postScript(scriptName, script, token) {
    return backendFetchJson(
        `${API_URL}/${scriptName}`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
            body: JSON.stringify({ name: scriptName, script }),
        },
        token
    );
}
