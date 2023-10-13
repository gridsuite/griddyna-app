/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, List, Paper, Typography } from '@mui/material';
import Select from '../1-atoms/Select';
import { styles } from './FiltersGroupStyles';
import { AddIconButton } from '../1-atoms/buttons';

const requirementsLabel = 'of the following conditions are met:';
const addFilterLabel = 'Add a filter to this group';
const orLabel = 'OR';
const andLabel = 'AND';

const FiltersGroup = (props) => {
    const { filters, groupOperator, changeGroupOperator, addFilter } = props;
    const [operator, setOperator] = useState(groupOperator);

    const changeOperator = (newValue) => {
        setOperator(newValue);
        changeGroupOperator(newValue);
    };

    const operatorComponent = (index) => (
        <Grid container justify="flex-start" sx={styles.separator}>
            <Grid item xs={10}>
                <Grid
                    container
                    justify="center"
                    key={`group-operator-${index}`}
                >
                    <Grid item>
                        <Typography>
                            {operator === '||' ? orLabel : andLabel}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );

    const elementsToDisplay = filters
        .map((filter) => <Box sx={styles.filter}>{filter}</Box>)
        .flatMap((filter, index, array) =>
            array.length - 1 !== index
                ? [filter, operatorComponent(index)]
                : filter
        );

    return (
        <Paper sx={styles.group}>
            <Grid container justify="space-between">
                <Grid item>
                    {filters.length > 1 && (
                        <Grid container justify="flex-start">
                            <Grid item sx={styles.operatorSelect}>
                                <Select
                                    options={[
                                        { value: '||', label: 'Any' },
                                        { value: '&&', label: 'All' },
                                    ]}
                                    value={operator}
                                    setValue={changeOperator}
                                />
                            </Grid>
                            <Grid item>
                                <Typography>{requirementsLabel}</Typography>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                <Grid item>
                    <AddIconButton
                        onClick={addFilter}
                        tooltip={addFilterLabel}
                    />
                </Grid>
            </Grid>

            <List>{elementsToDisplay}</List>
        </Paper>
    );
};

FiltersGroup.propTypes = {
    filters: PropTypes.arrayOf(PropTypes.node),
    operator: PropTypes.string,
    changeGroupOperator: PropTypes.func.isRequired,
    addFilter: PropTypes.func.isRequired,
};

export default FiltersGroup;
