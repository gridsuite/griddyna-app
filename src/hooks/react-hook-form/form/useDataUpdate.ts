/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useEffect } from 'react';
import { FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form';
import { usePrevious } from '@gridsuite/commons-ui';
import _ from 'lodash';

const useDataUpdate = (
    formApi: UseFormReturn,
    onValid: (formData: FieldValues) => void,
    onInvalid: (errors: FieldErrors) => void
) => {
    const formData = formApi.watch();
    const prevFormData = usePrevious(formData);

    useEffect(() => {
        if (!_.isEqual(prevFormData, formData)) {
            formApi.handleSubmit(onValid, onInvalid)();
        }
    }, [formApi, onValid, onInvalid, formData, prevFormData]);
};

export default useDataUpdate;
