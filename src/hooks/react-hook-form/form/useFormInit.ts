/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

const useFormInit = (
    formApi: UseFormReturn,
    defaultData: any,
    dependencies: any[]
) => {
    // using initialized to re-mount form when having change in dependencies list
    const [initialized, setInitialized] = useState<boolean>(false);

    useEffect(() => {
        setInitialized(false);
        formApi.reset(defaultData);
        setInitialized(true);
        // defaultData is the last data in the store, but we only want reset form if having change in dependencies
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencies, formApi]);
    return { initialized };
};

export default useFormInit;
