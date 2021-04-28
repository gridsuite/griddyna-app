/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice } from '@reduxjs/toolkit';
import { SIGNIN_CALLBACK_ERROR, USER } from '@gridsuite/commons-ui';

const initialState = {
    user: null,
    //     {
    //     profile: {
    //         name: 'John Doe',
    //         email: 'Jhon.Doe@rte-france.com',
    //     },
    //     id_token:
    //         'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IllNRUxIVDBndmIwbXhvU0RvWWZvbWpxZmpZVSJ9.eyJhdWQiOiI5YzQwMjQ2MS1iMmFiLTQ3NjctOWRiMy02Njg1OWJiMGZjZDAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzUwMmRhZDUtZDY0Yy00NmM3LTlkNDctYjE2ZjU4MGZjZmE5L3YyLjAiLCJpYXQiOjE1ODUzMzEyNDksIm5iZiI6MTU4NTMzMTI0OSwiZXhwIjoxNTg1MzM1MTQ5LCJhaW8iOiJBV1FBbS84UEFBQUF3Q0xyTDRIUEUvTnVjOU9OdHN0SUV4cVpyMUlqa1FGbXJvUW5EUzJBaksyWnpneUhQTldPdkE3bitveHkvRzgxWElsb1A0TitsQjZINFJteElwakhNYVArTjIyTzVnMUFaR04yc1d6VHA5T3JWMDIvOXhndXJBMjZrdUNXbGg2RSIsImF0X2hhc2giOiJJaWRYdGRHdzVkbjlOZDFQblVvbDh3IiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvOTE4ODA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGFkLyIsIm5vbmNlIjoiMjkzZTcxNzhmOWE5NGZlNjg1ZWY3MjdlZTg5MTYxYjEiLCJzdWIiOiJyTnZjWXJMSXJSN25iSDJPQlhoOFkzU05wZEtPc3dfTUNkX3F3NF9vNDRJIiwidGlkIjoiNzUwMmRhZDUtZDY0Yy00NmM3LTlkNDctYjE2ZjU4MGZjZmE5IiwidXRpIjoiUFBYdkw1UWxDMG1oMGp2N3NaNGJBQSIsInZlciI6IjIuMCJ9.dPAh24KTfsqmDaRoBtMLcayAWnDqVtydQ97P1a99dg93JsDu4Jhxju9vlzvjd6Ro5a1RZdrKFKB_pgC2DkQ3wSeYjpdSNyBAlW1_ryq65JkTJVMp33OsM_7SdjaRIiJfPiJ3U9jRBSyj7ofoHCLUjD_Uu-XreKxpMGhFHOQIO72UfXg8TBpsapjkEv9Dyz2UqMa2BQvO5mxKw93LNg5BI6j2a5LhbMEmmRWqfxWGITJ9TWfHjYdFkrXKcmvWZ9D2b4tsw_5NorDxkuzVFhA89M_0ASzOXoj1Yb6LgdkzWXDimssvyyz5Oe4V3gdkAe8Jj7Uwz-9AR-MO2kNkH7ytHA',
    //     session_state: 'session state',
    //     access_token:
    //         'eyJ0eXAiOiJKV1QiLCJub25jZSI6InhKWHlQeXVrU1paQ3BOeEcxZUQway1lVDF0YzZtQ01ZVkZKcnBDOTJxc28iLCJhbGciOiJSUzI1NiIsIng1dCI6IllNRUxIVDBndmIwbXhvU0RvWWZvbWpxZmpZVSIsImtpZCI6IllNRUxIVDBndmIwbXhvU0RvWWZvbWpxZmpZVSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83NTAyZGFkNS1kNjRjLTQ2YzctOWQ0Ny1iMTZmNTgwZmNmYTkvIiwiaWF0IjoxNTg1MzMxMjQ5LCJuYmYiOjE1ODUzMzEyNDksImV4cCI6MTU4NTMzNTE0OSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhQQUFBQXdwc3RYMlVkY2VDQWx4dU9tVHpIY0R3RlhTWUtYanIvZUNTSi9PdTRqbTJyUVBCUml0U1dWMThmNldCVEdNdnQ5ZGx0Ry9lTXB1VXZqaTN2NCtzanh3PT0iLCJhbHRzZWNpZCI6IjE6bGl2ZS5jb206MDAwMzQwMDExOUZEOTIxMiIsImFtciI6WyJwd2QiXSwiYXBwX2Rpc3BsYXluYW1lIjoic3BhIiwiYXBwaWQiOiI5YzQwMjQ2MS1iMmFiLTQ3NjctOWRiMy02Njg1OWJiMGZjZDAiLCJhcHBpZGFjciI6IjAiLCJlbWFpbCI6ImNoYW1zZWRkaW5lLmJlbmhhbWVkQGVuc2ktdW1hLnRuIiwiZmFtaWx5X25hbWUiOiJCRU5IQU1FRCIsImdpdmVuX25hbWUiOiJDaGFtc2VkZGluZSIsImlkcCI6ImxpdmUuY29tIiwiaXBhZGRyIjoiNzcuMjA0LjE0Ni4xNTkiLCJuYW1lIjoiQ2hhbXNlZGRpbmUgQkVOSEFNRUQiLCJvaWQiOiIzNTIzYmQ3OC0yZjIxLTQ3ZjYtODhlOC1hYWIzYjZmMjdmNjAiLCJwbGF0ZiI6IjE0IiwicHVpZCI6IjEwMDMyMDAwOURFMDg1NkEiLCJzY3AiOiJVc2VyLlJlYWQgcHJvZmlsZSBvcGVuaWQgZW1haWwiLCJzdWIiOiJjVEd5LVlfV3FLR2x1cmRUVDdSUVlfY3FjSDJoVHpEdllZTmotQ3hONXA4IiwidGlkIjoiNzUwMmRhZDUtZDY0Yy00NmM3LTlkNDctYjE2ZjU4MGZjZmE5IiwidW5pcXVlX25hbWUiOiJsaXZlLmNvbSNjaGFtc2VkZGluZS5iZW5oYW1lZEBlbnNpLXVtYS50biIsInV0aSI6IlBQWHZMNVFsQzBtaDBqdjdzWjRiQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfc3QiOnsic3ViIjoick52Y1lyTElyUjduYkgyT0JYaDhZM1NOcGRLT3N3X01DZF9xdzRfbzQ0SSJ9LCJ4bXNfdGNkdCI6MTU4MjgyMDM1Mn0.W_ccOGW_AGdg37KSMi7LWHtvm3Mw5p1dHjgDIrUaXduKF2iLS4dCaPw7yeo4VjAcOyV6C0h6ABLDCtkwVt8BSDTIIU7DaT8k2bRbMCCq69BmeiYPsbp-yX6ywGCx5DHsnOLqI2oHbBQktA2Nmv9Va651Pbm3OpSPuGPdVimkFCcnisiGlUOej1ZMNwyVT6386O2pERPtxmFUt_D1dKLxBXxBNxLVUG5BG3bI7wMpBOHEUA5CbaBzYXmGrLMXVVbrj9OsF-WQ6aNoqsm9cicX6pJB60lFz1dxLeSgcFO7Zh2K3PFe4FnXCqAvNPadQMz_kJEO9_phlDV85c2MPqeXbA',
    //     token_type: 'Bearer',
    //     scope: 'scopes',
    // },
    signInCallbackError: null,
};

// Selectors

// Reducers

const reducers = {
    [USER]: (state, action) => {
        // TODO: GridSuite: Should be payload
        state.user = action.payload.user;
    },
    [SIGNIN_CALLBACK_ERROR]: (state, action) => {
        // TODO: GridSuite: Should be payload
        state.signInCallbackError = action.payload.signInCallbackError;
    },
};

export const UserSlice = createSlice({
    name: 'User',
    initialState,
    reducers,
});

export const UserReducer = UserSlice.reducer;
