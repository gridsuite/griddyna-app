/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, Typography } from '@mui/material';
import Select from '../1-atoms/Select';
import { getModelsOptions } from '../../utils/optionsBuilders';
import { styles } from './ModelSelectStyle';
import React from 'react';
import PropTypes from 'prop-types';

const modelLabel = 'should be mapped to';

const ModelSelect = (props) => {
    const { model, models, changeModel } = props;

    return (
        <Box>
            <Grid container justify={'center'}>
                <Grid item xs={6}>
                    <Grid container justify={'center'}>
                        <Grid item xs="auto">
                            <Typography variant="h4">{`${modelLabel} :`}</Typography>
                        </Grid>
                        <Grid item xs sx={styles.titleSelect}>
                            <Select
                                options={getModelsOptions(models)}
                                value={model}
                                setValue={changeModel}
                                error={model === ''}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

ModelSelect.propTypes = {
    model: PropTypes.string.isRequired,
    models: PropTypes.arrayOf(PropTypes.object).isRequired,
    changeModel: PropTypes.func.isRequired,
};

export default ModelSelect;
