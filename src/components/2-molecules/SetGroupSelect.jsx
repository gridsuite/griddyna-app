/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Checkbox, Grid, Typography } from '@mui/material';
import Select from '../1-atoms/Select';
import { useStyles } from './SetGroupSelectStyle';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SetType } from '../../constants/models';
import { EditButton } from '../1-atoms/buttons';

const setLabel = 'and use parameters group';
const editGroupLabel = 'Edit the parameters group and/or the parameters sets';
const simpledEditLabel =
    'Cannot edit sets without enabling parameters management';
const newGroupLabel = 'Create new group';
const isAbsoluteLabel = 'All equipments share the same .par file';

const parName = (type, name) =>
    (type === SetType.SUFFIX ? '{id}' : '') +
    name +
    (type === SetType.PREFIX ? '{id}' : '');

const SetGroupSelect = (props) => {
    const {
        model,
        models,
        setGroup,
        groupType,
        changeGroup,
        editGroup,
        controlledParameters = false,
        isNetworkAttached,
    } = props;
    const mappedModel = models.find(
        (modelToTest) => modelToTest.name === model
    );

    const groups = mappedModel ? mappedModel.groups : [];

    const foundGroup = mappedModel?.groups.find(
        (group) => group.name === setGroup && group.type === groupType
    );

    const [isAbsolute, setIsAbsolute] = useState(
        ![SetType.PREFIX, SetType.SUFFIX].includes(groupType)
    );

    useEffect(() => {
        // Update isAbsolute according to the group type for the rule
        if (groupType) {
            setIsAbsolute(
                ![SetType.PREFIX, SetType.SUFFIX].includes(groupType)
            );
        }
    }, [groupType]);

    const onAbsoluteChange = () => {
        setIsAbsolute(!isAbsolute);
        changeGroup({ name: '', type: '' });
    };
    const groupOptions = groups
        .filter((group) =>
            isAbsolute
                ? group.type === SetType.FIXED
                : group.type !== SetType.FIXED
        )
        .map((group) => ({
            label: parName(group.type, group.name),
            value: group,
        }));
    groupOptions.push({ label: newGroupLabel, value: '' });

    const errorInParams =
        controlledParameters &&
        (foundGroup === undefined || foundGroup.setsNumber === 0);

    const classes = useStyles({ errorInParams });

    return (
        <Box className={classes.box}>
            <Grid container justify={'center'}>
                <Grid item xs={6}>
                    <Grid container justify={'center'}>
                        <Grid item xs="auto">
                            <Typography variant="h4">{`${isAbsoluteLabel} :`}</Typography>
                        </Grid>
                        <Grid item container xs justifyContent={'flex-end'}>
                            <Checkbox
                                checked={isAbsolute}
                                onChange={onAbsoluteChange}
                                disabled={!isNetworkAttached}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify={'center'}>
                        <Grid item xs="auto">
                            <Typography variant="h4">{`${setLabel} :`}</Typography>
                        </Grid>
                        <Grid item xs className={classes.titleSelect}>
                            <Select
                                options={groupOptions}
                                value={foundGroup}
                                setValue={changeGroup}
                                error={foundGroup === undefined}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={1}
                    className={classes.button}
                    alignItems={'flex-end'}
                >
                    <EditButton
                        onClick={editGroup(isAbsolute)}
                        disabled={
                            model === '' || (setGroup && !controlledParameters)
                        }
                        tooltip={
                            setGroup && !controlledParameters
                                ? simpledEditLabel
                                : editGroupLabel
                        }
                        sx={{ marginBottom: 1 }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

SetGroupSelect.propTypes = {
    model: PropTypes.string.isRequired,
    models: PropTypes.arrayOf(PropTypes.object).isRequired,
    setGroup: PropTypes.string.isRequired,
    groupType: PropTypes.string.isRequired,
    changeGroup: PropTypes.func.isRequired,
    editGroup: PropTypes.func.isRequired,
    controlledParameters: PropTypes.bool,
    isNetworkAttached: PropTypes.bool.isRequired,
};

export default SetGroupSelect;
