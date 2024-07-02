/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useEffect, useId, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    makeGetNotification,
    NotificationSlice,
    RootState,
} from '../redux/slices/Notification';

const useNotification = (actionTypes: string[]) => {
    const [ready, setReady] = useState(false);
    const subscriberId = useId();
    const dispatch = useDispatch();

    const getNotification = useMemo(makeGetNotification, []);
    const notification = useSelector((state: RootState) =>
        getNotification(state, { subscriberId })
    );

    // to subscribe notification center
    useEffect(() => {
        dispatch(
            NotificationSlice.actions.subscribe({
                subscriberId,
                actionTypes,
            })
        );

        return () => {
            // Unsubscribe when component unmounts
            dispatch(
                NotificationSlice.actions.unsubscribe({
                    subscriberId,
                    actionTypes,
                })
            );
        };
    }, [dispatch, subscriberId, actionTypes]);

    useEffect(() => {
        if (notification) {
            setReady(false);
            dispatch(NotificationSlice.actions.clear(notification));
        }
    }, [notification, dispatch]);

    return { setReady, ready };
};

export default useNotification;
