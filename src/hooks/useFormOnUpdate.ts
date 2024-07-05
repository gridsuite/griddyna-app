/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { usePrevious } from '@gridsuite/commons-ui';
import { useEffect } from 'react';
import isDeepEqualReact from 'fast-deep-equal/react';
import { UseFormReturn } from 'react-hook-form';

const useFormOnUpdate = (formApi: UseFormReturn, data: any) => {
    const prevData = usePrevious(data);

    useEffect(() => {
        if (!isDeepEqualReact(prevData, data)) {
            const setValueToKey = ([key, value]: [string, any]) => {
                formApi.setValue(key, value, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            };

            Object.entries(data).forEach(setValueToKey);
        }
    }, [formApi, data, prevData]);
};

export default useFormOnUpdate;
