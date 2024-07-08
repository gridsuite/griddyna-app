/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FieldErrors, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useFormInit from './useFormInit';
import { yup } from '@gridsuite/commons-ui';
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

    // reset form only having change in invalidations list
    const { initialized } = useFormInit(formMethods, data, invalidations);
    useDataUpdate(formMethods, initialized, onValid, onInvalid);

    return { initialized, formMethods };
};

export default useDataForm;
