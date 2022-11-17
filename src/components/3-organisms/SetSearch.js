/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import {
    ApplyAllButton,
    ApplyOneButton,
    ResetButton,
} from '../1-atoms/buttons';
import { Grid, Typography } from '@mui/material';
import Select from '../1-atoms/Select';
import Autocomplete from '../1-atoms/Autocomplete';
import { useStyles } from './SetSearchStyle';

const RESET_SET_SEARCH_LABEL = 'Clear filter';
const APPLY_ONE_SET_SEARCH_LABEL = 'Apply one';
const APPLY_ALL_SET_SEARCH_LABEL = 'Apply all';
const SET_SEARCH_LABEL = 'Parameters Set';

SetSearch.propTypes = {};

function SetSearch(props) {
    const classes = useStyles({ isValid: true, isSelect: true });
    const models = [
        { label: 'GeneratorSynchronousThreeWindings', value: 1 },
        {
            label: 'GeneratorSynchronousFourWindingsProportionalRegulations',
            value: 2,
        },
        { label: 'CurrentLimitAutomaton', value: 3 },
    ];
    const groups = [
        { label: 'GSTW', value: 1 },
        { label: 'IEEE14', value: 2 },
        { label: 'CLA', value: 3 },
    ];
    const sets = [
        { label: 'IEEE14_GEN____1_SM', value: 1 },
        { label: 'IEEE14_GEN____2_SM', value: 2 },
        { label: 'IEEE14_GEN____3_SM', value: 3 },
    ];
    return (
        <Grid
            container
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
            spacing={2}
            direction={'column'}
        >
            <Grid item>
                <Grid
                    container
                    xs={12}
                    justifyContent="flex-end"
                    alignItems={'flex-start'}
                >
                    <Grid item sx={{ flexGrow: 1 }} className={classes.label}>
                        <Typography>{SET_SEARCH_LABEL}</Typography>
                    </Grid>
                    <Grid item xs="auto">
                        <ResetButton
                            onClick={() => {}}
                            tooltip={RESET_SET_SEARCH_LABEL}
                        />
                    </Grid>
                    <Grid item xs="auto">
                        <ApplyOneButton
                            onClick={() => {}}
                            tooltip={APPLY_ONE_SET_SEARCH_LABEL}
                        />
                    </Grid>
                    <Grid item xs="auto">
                        <ApplyAllButton
                            onClick={() => {}}
                            tooltip={APPLY_ALL_SET_SEARCH_LABEL}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid
                    container
                    xs={12}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                >
                    <Grid item xs={'auto'}>
                        <Select
                            options={models}
                            value={2}
                            setValue={() => {}}
                            error={false}
                        ></Select>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Select
                            options={groups}
                            value={2}
                            setValue={() => {}}
                            error={false}
                        ></Select>
                    </Grid>
                    <Grid item xs="auto" className={classes.value}>
                        <Autocomplete
                            isFree={false}
                            isMultiple={false}
                            value={2 === '' ? [] : 2}
                            onChange={() => {}}
                            options={sets}
                            highlightOptions={[]}
                            type={undefined}
                            error={false}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default SetSearch;
