/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { backendFetchJson } from '../utils/rest-api';

const API_URL =
    import.meta.env.VITE_API_PREFIX +
    (import.meta.env.VITE_USE_AUTHENTICATION === 'true'
        ? `${import.meta.env.VITE_GATEWAY_PREFIX}/dynamic-mapping`
        : import.meta.env.VITE_URI) +
    '/models';

export function getModels(token) {
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

export function getModelDefinitions(modelName, token) {
    return backendFetchJson(
        `${API_URL}/${modelName}/parameters/definitions`,
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

export function getModelSets(modelName, groupName, groupType, token) {
    return backendFetchJson(
        `${API_URL}/${modelName}/parameters/sets/${groupName}/${groupType}`,
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

export function postModelSetsGroup(setGroup, strict, token) {
    return backendFetchJson(
        `${API_URL}/${setGroup.modelName}/parameters/sets${strict ? '/strict' : ''}`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
            body: JSON.stringify(setGroup),
        },
        token
    );
}

export function getAutomatonDefinitions(token) {
    return backendFetchJson(
        `${API_URL}/automaton-definitions`,
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
