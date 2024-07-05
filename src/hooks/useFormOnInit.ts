/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DependencyList, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

const useFormOnInit = (
    formApi: UseFormReturn,
    data: any,
    deps: DependencyList
) => {
    useEffect(() => {
        formApi.reset(data);
    }, deps);
};

export default useFormOnInit;
