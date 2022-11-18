/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import {
    ApplyAllButton,
    ApplyOneButton,
    ResetButton,
} from '../1-atoms/buttons';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    Grid,
    Typography,
} from '@mui/material';
import Select from '../1-atoms/Select';
import Autocomplete from '../1-atoms/Autocomplete';
import { useStyles } from './SetSearchStyle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const RESET_SET_SEARCH_LABEL = 'Clear filter';
const APPLY_ONE_SET_SEARCH_LABEL = 'Apply one';
const APPLY_ALL_SET_SEARCH_LABEL = 'Apply all';
const SET_SEARCH_LABEL = 'Parameters Set';

SetSearch.propTypes = {};

function SetSearch(props) {
    const [expanded, setExpanded] = useState(true);
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
        <Accordion
            expanded={expanded}
            onChange={() => setExpanded((prev) => !prev)}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className={classes.label}
            >
                <Typography>{SET_SEARCH_LABEL}</Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails style={{ display: 'inherit' }}>
                <Grid
                    container
                    justifyContent={'space-between'}
                    alignItems={'stretch'}
                    spacing={2}
                    direction={'column'}
                    xs={12}
                >
                    <Grid item xs={12}>
                        <Grid
                            container
                            xs={12}
                            justifyContent={'flex-start'}
                            alignItems={'stretch'}
                            direction={'column'}
                        >
                            <Grid item xs={12}>
                                <Select
                                    label={'Model'}
                                    options={models}
                                    value={2}
                                    setValue={() => {}}
                                    error={false}
                                    fullWidth
                                ></Select>
                            </Grid>
                            <Grid item s={12}>
                                <Select
                                    label={'Group'}
                                    options={groups}
                                    value={2}
                                    setValue={() => {}}
                                    error={false}
                                    fullWidth
                                ></Select>
                            </Grid>
                            <Grid item s={12} className={classes.value}>
                                <Autocomplete
                                    isFree={false}
                                    isMultiple={false}
                                    value={2 === '' ? [] : 2}
                                    onChange={() => {}}
                                    options={sets}
                                    highlightOptions={[]}
                                    type={undefined}
                                    error={false}
                                    label={'Parameters set'}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid
                            container
                            justifyContent="flex-end"
                            alignItems={'flex-start'}
                            xs={12}
                            spacing={1}
                        >
                            <Grid item>
                                <ApplyOneButton
                                    onClick={() => {}}
                                    tooltip={APPLY_ONE_SET_SEARCH_LABEL}
                                />
                            </Grid>
                            <Grid item>
                                <ApplyAllButton
                                    onClick={() => {}}
                                    tooltip={APPLY_ALL_SET_SEARCH_LABEL}
                                />
                            </Grid>
                            <Grid item>
                                <ResetButton
                                    onClick={() => {}}
                                    tooltip={RESET_SET_SEARCH_LABEL}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
}

export default SetSearch;
