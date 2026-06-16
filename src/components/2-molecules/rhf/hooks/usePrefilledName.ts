/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { snackWithFallback, useSnackMessage } from '@gridsuite/commons-ui';

type UsePrefilledNameProps = {
    inputName: string;
    selectorName: string;
    prefilledNameProvider: (fileName: string) => Promise<string>;
};
export function usePrefilledName({ inputName, selectorName, prefilledNameProvider }: Readonly<UsePrefilledNameProps>) {
    const { snackError } = useSnackMessage();
    const { setValue, subscribe, getValues } = useFormContext();
    const [manualChanged, setManualChanged] = useState(false);
    useEffect(() => {
        const unsubscribe = subscribe({
            name: [selectorName],
            formState: {
                values: true, // Subscribe to field value changes
            },
            callback: () => {
                const selectedValue = getValues(selectorName) as File;
                if (selectedValue && !manualChanged) {
                    const { name: fileName } = selectedValue;
                    if (fileName) {
                        prefilledNameProvider(fileName)
                            .then((prefilledName) => {
                                setValue(inputName, prefilledName, { shouldDirty: true });
                            })
                            .catch((error) => {
                                snackWithFallback(snackError, error);
                            });
                    }
                }
            },
        });
        return () => {
            unsubscribe();
        };
    });
    return { setManualChanged, autoFocus: !getValues(selectorName) };
}
