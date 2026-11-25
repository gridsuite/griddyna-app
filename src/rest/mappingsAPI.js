/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { fetchElementNames, PermissionType } from '@gridsuite/commons-ui';
import { backendFetch, backendFetchJson } from '../utils/rest-api';
import { hasPermissionLevel } from '../utils/directory-utils';

const API_MAPPING_URL =
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

export function getMappings({ ids, token }) {
    // get permissions for each mapping id
    let urlPermissions = `${API_EXPLORE_URL}/elements/permissions`;
    if (ids?.length > 0) {
        const urlSearchParams = new URLSearchParams();
        ids.forEach((id) => urlSearchParams.append('ids', id));
        urlPermissions += `?${urlSearchParams.toString()}`;
    } else {
        return Promise.resolve([]);
    }
    const permissionsPromise = backendFetchJson(
        urlPermissions,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
        },
        token
    );

    return permissionsPromise.then((permissions /* Map<UUID, PermissionType> */) => {
        // get only readable mapping
        const readableIds = Object.entries(permissions)
            .filter(([_, permission]) => hasPermissionLevel(permission, PermissionType.READ))
            .map(([id, _]) => id);
        const nonReadableIds = ids.filter((id) => !readableIds.includes(id)).map((id) => id);

        // fetch mapping content for readable mapping ids
        let url = `${API_MAPPING_URL}`;
        let mappingsPromise = Promise.resolve([]);
        if (readableIds?.length > 0) {
            const urlSearchParams = new URLSearchParams();
            readableIds.forEach((id) => urlSearchParams.append('ids', id));
            url += `?${urlSearchParams.toString()}`;
            mappingsPromise = backendFetchJson(
                url,
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

        return mappingsPromise.then((mappings) => {
            const mappingIds = mappings.map((mapping) => mapping.id);
            const idsToFetchNames = [...mappingIds, ...nonReadableIds];
            if (idsToFetchNames?.length > 0) {
                return fetchElementNames(new Set(idsToFetchNames)).then((elementIdNames) => {
                    const mappingsWithName = mappings.map((mapping) => ({
                        ...mapping,
                        name: elementIdNames?.[mapping.id],
                        permission: permissions[mapping.id],
                    }));
                    // enrich with nonReadableIds
                    const nonReadableMappings = nonReadableIds
                        .filter((id) => elementIdNames?.[id]) // Eliminate non-existing elments
                        .map((id) => ({
                            id,
                            name: elementIdNames?.[id],
                            permission: permissions[id],
                            rules: [],
                            automata: [],
                            controlledParameters: false,
                        }));
                    return [...mappingsWithName, ...nonReadableMappings];
                });
            }
            return Promise.resolve([]);
        });
    });
}

export function getMapping(mappingId, token) {
    // get permissions for mapping id
    let urlPermissions = `${API_EXPLORE_URL}/elements/permissions`;
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('ids', mappingId);
    urlPermissions += `?${urlSearchParams.toString()}`;

    const permissionsPromise = backendFetchJson(
        urlPermissions,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
        },
        token
    );

    return permissionsPromise.then((permissions /* Map<UUID, PermissionType> */) => {
        const mappingPromise = backendFetchJson(
            `${API_MAPPING_URL}/${mappingId}`,
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
                    permission: permissions?.[mapping.id],
                };
            });
        });
    });
}

export function exportMapping(mappingId, fileName, token) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('fileName', fileName);
    return backendFetch(
        `${API_MAPPING_URL}/${mappingId}/export?${urlSearchParams.toString()}`,
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
        `${API_MAPPING_URL}/${mappingId}`,
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
export function updateMappingStudy(mappingId, studyUuid, token) {
    return backendFetch(
        `${API_MAPPING_URL}/${mappingId}/study`,
        {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
            body: studyUuid ? JSON.stringify(studyUuid) : null,
        },
        token
    );
}
