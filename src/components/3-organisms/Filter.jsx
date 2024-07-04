/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import {
    CustomReactQueryBuilder,
    EXPERT_FILTER_FIELDS,
    EXPERT_FILTER_QUERY,
} from '@gridsuite/commons-ui';
import { useIntl } from 'react-intl';

const Filter = (props) => {
    const { equipmentType } = props;

    const intl = useIntl();

    const translatedFields = useMemo(() => {
        return EXPERT_FILTER_FIELDS[equipmentType]?.map((field) => {
            return {
                ...field,
                label: intl.formatMessage({ id: field.label }),
            };
        });
    }, [intl, equipmentType]);

    return (
        <Grid container justify="space-between">
            <CustomReactQueryBuilder
                name={EXPERT_FILTER_QUERY}
                fields={translatedFields}
            />
        </Grid>
    );
};

Filter.propTypes = {
    equipmentType: PropTypes.string,
};

export default Filter;
