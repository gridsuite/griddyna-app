/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson } from '../utils/rest-api';
import type { Workspace } from '../redux/types/workspace.type';

const API_WORKSPACE_URL =
    import.meta.env.VITE_API_PREFIX +
    (import.meta.env.VITE_USE_AUTHENTICATION === 'true'
        ? `${import.meta.env.VITE_GATEWAY_PREFIX}/dynamic-mapping`
        : import.meta.env.VITE_URI) +
    '/workspaces';

/** GET /workspace/{userId} — auto-creates one workspace if none exist */
export function fetchWorkspace(userId: string, token: string): Promise<Workspace> {
    return backendFetchJson(
        `${API_WORKSPACE_URL}/${userId}`,
        {
            method: 'GET',
            headers: { Accept: 'application/json' },
            cache: 'default',
        },
        token
    );
}

/** PUT /workspace/{workspaceId} — update an existing workspace */
export function updateWorkspace(workspaceId: UUID, workspace: Workspace, token: string): Promise<void> {
    return backendFetch(
        `${API_WORKSPACE_URL}/${workspaceId}`,
        {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
            body: JSON.stringify(workspace),
        },
        token
    );
}

/** DELETE /workspace/{workspaceId} */
/** use later for a reset workspace button */
export function deleteWorkspace(workspaceId: UUID, token: string): Promise<void> {
    return backendFetch(
        `${API_WORKSPACE_URL}/${workspaceId}`,
        {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
            },
            cache: 'default',
        },
        token
    );
}
