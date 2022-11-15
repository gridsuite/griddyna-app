import { Box, Checkbox, Grid, Typography } from '@mui/material';
import Select from '../1-atoms/Select';
import { getModelsOptions } from '../../utils/optionsBuilders';
import { useStyles } from './ModelSelectStyle';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SetType } from '../../constants/models';
import { SaveButton } from '../1-atoms/buttons';

const modelLabel = 'should be mapped to';
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

const ModelSelect = (props) => {
    const {
        model,
        models,
        changeModel,
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
                <Grid item xs="auto">
                    <Grid container justify={'center'}>
                        <Grid item xs="auto">
                            <Typography variant="h4">{`${modelLabel} :`}</Typography>
                        </Grid>
                        <Grid item xs="auto" className={classes.titleSelect}>
                            <Select
                                options={getModelsOptions(models)}
                                value={model}
                                setValue={changeModel}
                                error={model === ''}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify={'center'}>
                        <Grid item xs="auto">
                            <Typography variant="h4">{`${isAbsoluteLabel} :`}</Typography>
                        </Grid>
                        <Grid item xs="auto">
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
                        <Grid item xs="auto" className={classes.titleSelect}>
                            <Select
                                options={groupOptions}
                                value={foundGroup}
                                setValue={changeGroup}
                                error={foundGroup === undefined}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={2}>
                    <Grid container className={classes.infoGrid}>
                        <Grid item xs={3} className={classes.tooltip}></Grid>
                        <Grid item xs={9} className={classes.button}>
                            <SaveButton
                                onClick={editGroup(isAbsolute)}
                                disabled={
                                    model === '' ||
                                    (setGroup && !controlledParameters)
                                }
                                tooltip={
                                    setGroup && !controlledParameters
                                        ? simpledEditLabel
                                        : editGroupLabel
                                }
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
    setGroup: PropTypes.string.isRequired,
    groupType: PropTypes.string.isRequired,
    models: PropTypes.arrayOf(PropTypes.object).isRequired,
    changeModel: PropTypes.func.isRequired,
    changeGroup: PropTypes.func.isRequired,
    editGroup: PropTypes.func.isRequired,
    controlledParameters: PropTypes.bool,
    isNetworkAttached: PropTypes.bool.isRequired,
};

export default ModelSelect;
