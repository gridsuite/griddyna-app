/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import PropTypes from 'prop-types';
import { ParameterOrigin, ParameterType } from '../../constants/models';
import { Box, Grid, TextField, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import * as _ from 'lodash';
import { isParameterValueValid } from '../../utils/parameters';

const infoTypeLabel = 'This parameter is of type ';
const networkLabel = ' From Network';
const SetEditor = (props) => {
    const { definitions, filter, set, saveSet } = props;
    const filteredDefinitions = filter ? definitions.filter(filter) : definitions;

    const valueOrigin = (origin) => {
        switch (origin) {
            case ParameterOrigin.USER:
                return -1;
            case ParameterOrigin.FIXED:
                return 0;
            case ParameterOrigin.NETWORK:
                return 1;
            default:
                return 10;
        }
    };
    const onChange = (event) => {
        const parameterChanged = event.target.id;
        const newValue = event.target.value;
        const newValueToUse =
            filteredDefinitions.find((definition) => definition.name === parameterChanged).type === ParameterType.DOUBLE
                ? newValue.replace(',', '.')
                : newValue;
        const updatedSet = _.cloneDeep(set);
        updatedSet.parameters.find((parameter) => parameter.name === parameterChanged).value = newValueToUse;
        saveSet(updatedSet);
    };

    return (
        <Box>
            <Typography variant="h5"> {set.name}</Typography>
            {_.cloneDeep(filteredDefinitions)
                .sort((a, b) => valueOrigin(a.origin) - valueOrigin(b.origin))
                .map((definition) => {
                    const correspondingParameter = set.parameters.find((param) => param.name === definition.name);
                    return (
                        <Grid container justify="space-evenly" sx={{ padding: '8px 0px' }}>
                            <Grid item xs={7}>
                                <Typography>{definition.name}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    size="small"
                                    id={definition.name}
                                    value={
                                        definition.origin === ParameterOrigin.NETWORK
                                            ? networkLabel
                                            : correspondingParameter?.value
                                    }
                                    error={
                                        definition.origin === ParameterOrigin.USER &&
                                        !isParameterValueValid(correspondingParameter?.value, definition.type)
                                    }
                                    onChange={onChange}
                                    disabled={definition.origin !== ParameterOrigin.USER}
                                    sx={{ width: '100%' }}
                                />
                            </Grid>
                            <Grid item xs alignItems={'center'} justifyContent={'center'}>
                                <Tooltip title={infoTypeLabel + definition.type}>
                                    <InfoIcon />
                                </Tooltip>
                            </Grid>
                        </Grid>
                    );
                })}
        </Box>
    );
};

SetEditor.propTypes = {
    set: PropTypes.object.isRequired,
    definitions: PropTypes.array.isRequired,
    filter: PropTypes.func,
    saveSet: PropTypes.func.isRequired,
};

export default SetEditor;
