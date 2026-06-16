/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Button, Grid2 as Grid, Input } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ChangeEvent, useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { ErrorInput, FieldErrorAlert } from '@gridsuite/commons-ui';

type UploadFileProps = { name: string; label: string; accept?: string };
function FileInputSelector({ name, label, accept }: Readonly<UploadFileProps>) {
    const {
        field: { ref, value, onChange: onChangeValue },
    } = useController({
        name,
    });
    const { clearErrors } = useFormContext();
    const file = value as File;
    const { name: fileName } = file || {};

    const valueRender = useCallback(() => {
        if (fileName) {
            return <span>{fileName}</span>;
        }
        return <FormattedMessage id="uploadMessage" />;
    }, [fileName]);

    const onChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();

            clearErrors(name);
            const { files } = event.target;
            if (files?.length) {
                const selectedFile = files[0];
                onChangeValue(selectedFile);
            }
        },
        [clearErrors, name, onChangeValue]
    );

    return (
        <>
            <Grid container alignItems="center" spacing={1} pt={1}>
                <Grid>
                    <Button variant="contained" color="primary" component="label">
                        <FormattedMessage id={label} />
                        <Input
                            ref={ref}
                            type="file"
                            name="file"
                            onChange={onChange}
                            sx={{ display: 'none' }}
                            data-testid="FileInputSelector"
                            inputProps={{
                                accept: accept,
                            }}
                        />
                    </Button>
                </Grid>
                <Grid sx={{ fontWeight: 'bold' }}>
                    <p>{valueRender()}</p>
                </Grid>
            </Grid>
            <ErrorInput name={name} InputField={FieldErrorAlert} />
        </>
    );
}

export default FileInputSelector;
