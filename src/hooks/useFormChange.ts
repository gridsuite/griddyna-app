/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { usePrevious } from '@gridsuite/commons-ui';
import { useEffect } from 'react';
import isDeepEqualReact from 'fast-deep-equal/react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

const useFormChange = (
    formApi: UseFormReturn,
    onChange: (formData: FieldValues) => void
) => {
    const formData = formApi.watch();
    const prevFormData = usePrevious(formData);

    useEffect(() => {
        if (!isDeepEqualReact(prevFormData, formData)) {
            console.log('handleSubmit', { formData });
            formApi.handleSubmit(onChange)();
        }
    }, [formApi, onChange, formData, prevFormData]);
};

export default useFormChange;
