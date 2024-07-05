/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { usePrevious } from '@gridsuite/commons-ui';
import { useEffect } from 'react';
import isDeepEqualReact from 'fast-deep-equal/react';
import { FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form';

const useFormOnChange = (
    formApi: UseFormReturn,
    onChange: (formData: FieldValues) => void,
    onValidationError: (errors: FieldErrors) => void
) => {
    const formData = formApi.watch();
    const prevFormData = usePrevious(formData);

    useEffect(() => {
        if (!isDeepEqualReact(prevFormData, formData)) {
            formApi.handleSubmit(onChange, onValidationError)();
        }
    }, [formApi, onChange, onValidationError, formData, prevFormData]);
};

export default useFormOnChange;
