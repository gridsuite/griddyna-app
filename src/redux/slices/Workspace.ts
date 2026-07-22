/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWorkspace } from '../../rest/workspaceAPI';
import type { Workspace } from '../types/workspace.type';
import type { RootState } from '../reducer';
import { RequestStatus } from '../../utils/types';

// --- State shape --- //

interface WorkspaceState {
    workspace: Workspace | null;
    status: RequestStatus;
}

const initialState: WorkspaceState = {
    workspace: null,
    status: RequestStatus.IDLE,
};

// --- Async thunks --- //

/**
 * Fetches the workspace for a user.
 * The backend auto-creates one default workspace on the first call.
 */
export const loadWorkspace = createAsyncThunk('workspaces/initConfig', async (_arg, { getState }) => {
    const state = getState() as RootState;
    const token = state?.user.user?.id_token as string;
    const userId = state.user.user?.profile.sub as string;
    const workspace = await fetchWorkspace(userId, token);
    return workspace;
});

// --- Slice --- //

export const WorkspaceSlice = createSlice({
    name: 'workspaces',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // --- loadWorkspace ---
        builder.addCase(loadWorkspace.pending, (state) => {
            state.status = RequestStatus.PENDING;
        });
        builder.addCase(loadWorkspace.fulfilled, (state, action) => {
            state.status = RequestStatus.SUCCESS;
            state.workspace = action.payload;
        });
        builder.addCase(loadWorkspace.rejected, (state) => {
            state.status = RequestStatus.ERROR;
        });
    },
});

// --- Selectors --- //

export const getWorkspace = (state: RootState): Workspace | null => state.workspaces.workspace;

// --- Reducer --- //
export const WorkspaceReducer = WorkspaceSlice.reducer;
