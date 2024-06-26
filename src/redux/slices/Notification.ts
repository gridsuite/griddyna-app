/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { store } from '../store';

export type RootState = ReturnType<typeof store.getState>;

type NotificationState = {
    subscriptions: {
        [actionType: string]: {
            [subscriberId: string]: boolean;
        };
    };
};

const initialState: NotificationState = {
    subscriptions: {},
};

export const makeGetNotification = () =>
    createSelector(
        (state: RootState) => {
            return state.notification.subscriptions;
        },
        (_state, args) => args,
        (subscriptions, { subscriberId }) => {
            for (const actionType of Object.keys(subscriptions)) {
                if (subscriptions[actionType][subscriberId] === true) {
                    return { actionType, subscriberId, notified: true };
                }
            }
            return null;
        }
    );

const reducers = {
    subscribe: (
        state: NotificationState,
        action: PayloadAction<{ subscriberId: string; actionTypes: string[] }>
    ) => {
        const { actionTypes, subscriberId } = action.payload;
        //console.log('state in subscribe', { state });
        for (const actionType of actionTypes) {
            if (!state.subscriptions[actionType]) {
                state.subscriptions[actionType] = {};
            }
            if (state.subscriptions[actionType][subscriberId] === undefined) {
                state.subscriptions[actionType][subscriberId] = false;
            }
        }
    },
    unsubscribe: (
        state: NotificationState,
        action: PayloadAction<{ subscriberId: string; actionTypes: string[] }>
    ) => {
        const { actionTypes, subscriberId } = action.payload;
        //console.log('state in unsubscribe', { state });

        for (const actionType of actionTypes) {
            if (state.subscriptions[actionType]) {
                delete state.subscriptions[actionType][subscriberId];
            }

            if (_.isEmpty(state.subscriptions[actionType])) {
                delete state.subscriptions[actionType];
            }
        }
    },
    notify: (
        state: NotificationState,
        action: PayloadAction<{ actionType: string }>
    ) => {
        const { actionType } = action.payload;

        if (state.subscriptions[actionType]) {
            Object.keys(state.subscriptions[actionType]).forEach(
                (subscriberId) => {
                    console.log(
                        `Notify subscriber ${subscriberId} about ${actionType}`
                    );
                    state.subscriptions[actionType][subscriberId] = true;
                }
            );
        }
    },

    clear: (
        state: NotificationState,
        action: PayloadAction<{ subscriberId: string; actionType: string }>
    ) => {
        const { subscriberId, actionType } = action.payload;
        if (state.subscriptions[actionType]) {
            if (state.subscriptions[actionType][subscriberId]) {
                state.subscriptions[actionType][subscriberId] = false;
            }
        }
    },
};

export const NotificationSlice = createSlice({
    name: 'Notification',
    initialState,
    reducers,
});

export const NotificationReducer = NotificationSlice.reducer;
