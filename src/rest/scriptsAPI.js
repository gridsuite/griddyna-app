/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const API_URL = process.env.REACT_APP_API_GATEWAY + '/scripts';

export function convertToScript(mappingName) {
    return fetch(`${API_URL}/from/${mappingName}`, {
        method: 'GET',
        headers: {},
        cache: 'default',
    });
}

export function getScripts() {
    return fetch(`${API_URL}/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        cache: 'default',
    });
}

export function deleteScript(scriptName) {
    return fetch(`${API_URL}/${scriptName}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        cache: 'default',
    });
}

export async function copyScript(originalName, copyName) {
    return fetch(`${API_URL}/copy/${originalName}/to/${copyName}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        cache: 'default',
    });
}

export async function renameScript(nameToReplace, newName) {
    return fetch(`${API_URL}/rename/${nameToReplace}/to/${newName}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        cache: 'default',
    });
}

export function postScript(scriptName, script) {
    return fetch(`${API_URL}/${scriptName}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        cache: 'default',
        body: JSON.stringify({ name: scriptName, script }),
    });
}
