/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { backendFetch, backendFetchJson, backendFetchText } from '../utils/rest-api';
import { fetchElementNames } from '@gridsuite/commons-ui';

const API_URL =
    import.meta.env.VITE_API_PREFIX +
    (import.meta.env.VITE_USE_AUTHENTICATION === 'true'
        ? `${import.meta.env.VITE_GATEWAY_PREFIX}/dynamic-mapping`
        : import.meta.env.VITE_URI) +
    '/mappings';

const API_EXPLORE_URL =
    import.meta.env.VITE_API_PREFIX +
    (import.meta.env.VITE_USE_AUTHENTICATION === 'true'
        ? `${import.meta.env.VITE_GATEWAY_PREFIX}/explore/v1`
        : `${import.meta.env.VITE_EXPLORE_URI}/v1`) +
    `/explore`;

export function getMappings(token) {
    const mappingsPromise = backendFetchJson(
        `${API_URL}`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
        },
        token
    );

    return mappingsPromise.then((mappings) => {
        const mappingIds = mappings.map((mapping) => mapping.id);
        if (mappingIds?.length > 0) {
            return fetchElementNames(new Set(mappingIds)).then((elementIdNames) => {
                return mappings.map((mapping) => {
                    return {
                        ...mapping,
                        name: elementIdNames?.[mapping.id],
                    };
                });
            });
        }
        return mappings;
    });
}

export function getMapping(mappingId, token) {
    const mappingPromise = backendFetchJson(
        `${API_URL}/${mappingId}`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
        },
        token
    );

    return mappingPromise.then((mapping) => {
        return fetchElementNames(new Set([mappingId])).then((elementIdNames) => {
            return {
                ...mapping,
                name: elementIdNames?.[mapping.id],
            };
        });
    });
}

export function deleteMapping(mappingId, token) {
    return backendFetchText(
        `${API_EXPLORE_URL}/elements/${mappingId}`,
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

export async function renameMapping(id, newName, token) {
    // type is ElementAttributes from directory-server
    const elementAttributes = {
        elementName: newName,
    };
    return backendFetch(
        `${API_EXPLORE_URL}/elements/${id}`,
        {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
            body: JSON.stringify(elementAttributes),
        },
        token
    );
}

export async function copyMapping(originalId, token) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('duplicateFrom', originalId);
    return backendFetchJson(
        `${API_EXPLORE_URL}/dynamic-mappings?${urlSearchParams.toString()}`,
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

export function exportMapping(mappingId, fileName, token) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('fileName', fileName);
    return backendFetch(
        `${API_URL}/${mappingId}/export?${urlSearchParams.toString()}`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
        },
        token
    );
}

export function createMapping(name, description, mapping, parentDirectoryUuid, token) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('name', name);
    urlSearchParams.append('description', description);
    urlSearchParams.append('parentDirectoryUuid', parentDirectoryUuid);

    return backendFetchJson(
        `${API_EXPLORE_URL}/dynamic-mappings?${urlSearchParams.toString()}`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
            body: JSON.stringify(mapping),
        },
        token
    );
}

export function updateMapping(mappingId, mapping, token) {
    return backendFetch(
        `${API_URL}/${mappingId}`,
        {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
            body: JSON.stringify(mapping),
        },
        token
    );
}
