/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid2 as Grid, Stack, Tooltip, Typography } from '@mui/material';
import { CustomReactQueryBuilder, EXPERT_FILTER_QUERY, useFormatLabelWithUnit } from '@gridsuite/commons-ui';
import { AddIconButton, DeleteButton } from '../1-atoms/buttons';
import { styles } from './FilterStyle';
import { mergeSx } from '../../utils/functions';
import InfoIcon from '@mui/icons-material/Info';
import { EXPERT_FILTER_FIELDS } from '../../constants/expertFilter';

const filterLabel = 'Where:';
const addFilterLabel = 'Add filter';
const deleteFilterLabel = 'Delete filter';
const noFilterLabel = 'no other filter applies';
const ruleWithoutFilter = 'Only last rule can have empty filter';

const Filter = (props) => {
    const { isValid, equipmentType, newFilter, deleteFilter, hasFilter } = props;

    const formatLabelWithUnit = useFormatLabelWithUnit();
    const translatedFields = useMemo(() => {
        return EXPERT_FILTER_FIELDS[equipmentType]?.map((field) => {
            return {
                ...field,
                label: formatLabelWithUnit(field),
            };
        });
    }, [formatLabelWithUnit, equipmentType]);

    return (
        <Stack>
            <Grid container justifyContent={'flex-start'}>
                <Grid size="grow">
                    <Typography>{filterLabel}</Typography>
                </Grid>
                <Grid size="auto" paddingLeft={1}>
                    <AddIconButton onClick={newFilter} tooltip={addFilterLabel} disabled={hasFilter} />
                    <DeleteButton onClick={deleteFilter} isDirty tooltip={deleteFilterLabel} disabled={!hasFilter} />
                </Grid>
            </Grid>
            {hasFilter ? (
                <CustomReactQueryBuilder name={EXPERT_FILTER_QUERY} fields={translatedFields} />
            ) : (
                <Box display="flex" alignItems="center">
                    <Typography variant="subtitle2" sx={mergeSx(styles.noFilter, !isValid && styles.invalid)}>
                        {noFilterLabel}
                    </Typography>
                    {!isValid && (
                        <Tooltip title={ruleWithoutFilter}>
                            <InfoIcon />
                        </Tooltip>
                    )}
                </Box>
            )}
        </Stack>
    );
};

Filter.propTypes = {
    equipmentType: PropTypes.string,
    newFilter: PropTypes.func.isRequired,
    deleteFilter: PropTypes.func.isRequired,
    hasFilter: PropTypes.bool,
};

export default Filter;
