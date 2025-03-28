/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { Divider, Grid, Typography } from '@mui/material';
import Autocomplete from '../../1-atoms/Autocomplete';
import { styles } from './AutomatonPropertiesStyle';
import { getPossibleOptionsForProperty } from '../../../utils/automata';
import * as _ from 'lodash';
import { Automaton } from '../../../redux/types/mapping.type';
import { AutomationDefinition } from '../../../redux/types/model.type';
import { EquipmentValues } from '../../../redux/types/network.type';

const VALUE_DELIMITER = ',';

export interface AutomatonPropertiesProps {
    automaton: Automaton;
    automatonDefinition: AutomationDefinition;
    networkPropertyValues: EquipmentValues[];
    onChangeProperty: (propertyName: string, propertyType?: string) => (propertyValue: string) => void;
}

const AutomatonProperties = ({
    automaton,
    automatonDefinition,
    networkPropertyValues,
    onChangeProperty,
}: AutomatonPropertiesProps) => {
    const propertyNames = Object.keys(automatonDefinition);

    const handleChangeProperty = useCallback(
        (propertyName: string, propertyType?: string) => (propertyValue: string) => {
            onChangeProperty(
                propertyName,
                propertyType
            )(
                // convert an array to a string content with VALUE_DELIMITER
                _.isArray(propertyValue) ? _.join(propertyValue, VALUE_DELIMITER) : propertyValue
            );
        },
        [onChangeProperty]
    );
    return (
        propertyNames?.length > 0 && (
            <Grid container sx={styles.gridContainer}>
                {propertyNames.map((propertyName, index) => {
                    const propertyDefinition = automatonDefinition[propertyName];
                    const property = automaton.properties.find((elem) => elem.name === propertyName);

                    // convert a string content with VALUE_DELIMITER to an array
                    const propertyValue = propertyDefinition.multiple
                        ? _.map(_.split(property?.value, VALUE_DELIMITER), _.trim)
                        : property?.value ?? '';

                    const options =
                        propertyDefinition?.values ??
                        (propertyDefinition?.mapping &&
                            getPossibleOptionsForProperty(propertyDefinition?.mapping, networkPropertyValues)) ??
                        [];

                    return (
                        <Grid key={propertyName} container item justifyContent={'flex-start'} paddingLeft={1}>
                            <Grid container>
                                <Grid item xs={4} sx={styles.label} alignItems={'center'}>
                                    <Typography>{`${propertyDefinition.label} :`}</Typography>
                                </Grid>
                                <Grid item xs={8} sx={styles.value}>
                                    <Autocomplete
                                        isFree={!(options && options.length > 0)}
                                        isMultiple={propertyDefinition.multiple}
                                        value={propertyValue ?? (propertyDefinition.multiple ? [] : propertyValue)}
                                        onChange={handleChangeProperty(propertyName, propertyDefinition?.type)}
                                        options={options}
                                        type={propertyDefinition?.type === 'number' ? 'number' : undefined}
                                        error={
                                            propertyValue === '' ||
                                            (Array.isArray(propertyValue) && propertyValue.length === 0)
                                        }
                                        ignoreReset={!(options && options.length > 0)}
                                        fixedWidth
                                    />
                                </Grid>
                            </Grid>
                            {index !== propertyNames.length - 1 && (
                                <Grid item xs={12} sx={{ paddingRight: '8px' }}>
                                    <Divider />
                                </Grid>
                            )}
                        </Grid>
                    );
                })}
            </Grid>
        )
    );
};

export default AutomatonProperties;
