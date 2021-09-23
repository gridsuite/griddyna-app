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
    '/models';

export function getModels(token) {
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

export function getModelDefinitions(modelName, token) {
    return fetch(`${API_URL}/${modelName}/parameters/definitions/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        cache: 'default',
    });
}

export function getModelSets(modelName, groupName, groupType, token) {
    return fetch(
        `${API_URL}/${modelName}/parameters/sets/${groupName}/${groupType}`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
            cache: 'default',
        }
    );
}

export function postModelSetsGroup(setGroup, strict, token) {
    return fetch(
        `${API_URL}/${setGroup.modelName}/parameters/sets${
            strict ? '/strict' : ''
        }/`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
            cache: 'default',
            body: JSON.stringify(setGroup),
        }
    );
}
