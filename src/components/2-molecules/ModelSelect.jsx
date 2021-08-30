import { Box, Grid, Tooltip, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Select from '../1-atoms/Select';
import { getModelsOptions } from '../../utils/optionsBuilders';
import { useStyles } from './ModelSelectStyle';
import React from 'react';
import PropTypes from 'prop-types';
import { SetType } from '../../constants/models';

const modelLabel = 'should be mapped to';
const setLabel = 'and use parameters group';

const fixedLabel = (name) =>
    `All equipments affected will use ${name}.par file.`;

const variableLabel = (isPrefix, name) =>
    `Equipments affected will use their own ${
        (isPrefix ? '{id}' : '') + name + (!isPrefix ? '{id}' : '')
    }.par file.`;

const ModelSelect = (props) => {
    const { model, models, changeModel, setGroup, changeGroup, editGroup } =
        props;

    const mappedModel = models.find(
        (modelToTest) => modelToTest.name === model
    );

    const groups = mappedModel
        ? mappedModel.groups.map((group) => group.name)
        : [];

    const foundGroup = mappedModel?.groups.find(
        (group) => group.name === setGroup
    );
    const classes = useStyles();

    return (
        <Box>
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
                    <Typography variant="h4">{`${setLabel} :`}</Typography>
                </Grid>
                <Grid item xs="auto" className={classes.titleSelect}>
                    <Select
                        options={groups.map((group) => ({
                            label: group,
                            value: group,
                        }))}
                        value={setGroup}
                        setValue={changeGroup}
                        error={setGroup === ''}
                    />
                </Grid>
                {foundGroup && (
                    <Grid item xs="auto" className={classes.titleSelect}>
                        <Tooltip
                            title={
                                foundGroup.type === SetType.FIXED
                                    ? fixedLabel(foundGroup.name)
                                    : variableLabel(
                                          foundGroup.type === SetType.PREFIX,
                                          foundGroup.name
                                      )
                            }
                        >
                            <InfoIcon />
                        </Tooltip>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

ModelSelect.propTypes = {
    model: PropTypes.string.isRequired,
    setGroup: PropTypes.string.isRequired,
    models: PropTypes.arrayOf(PropTypes.string).isRequired,
    changeModel: PropTypes.func.isRequired,
    changeGroup: PropTypes.string.isRequired,
    editGroup: PropTypes.func.isRequired,
};

export default ModelSelect;
