/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FieldErrors, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useFormInit from './useFormInit';
import { yupConfig as yup } from '@gridsuite/commons-ui';
import useDataUpdate from './useDataUpdate';

const useDataForm = (
    formSchema: yup.ObjectSchema<any>,
    data: Object,
    invalidations: any[],
    onValid: (formData: FieldValues) => void,
    onInvalid: (errors: FieldErrors) => void
) => {
    const formMethods = useForm({
        resolver: yupResolver(formSchema),
    });

    // --- When one of dependencies has changed --- //
    // 1. reset form data with default values and increase key =>
    // 2. unmount old form container then render new form container (with new key) =>
    // 3. the custom-RQB in the form container gets form data then provides rqb query to QueryBuilder
    // 4. submit on the fly the changed query when inputting value
    const { key } = useFormInit(formMethods, data, invalidations);
    useDataUpdate(formMethods, onValid, onInvalid);

    return { key, formMethods };
};

export default useDataForm;
