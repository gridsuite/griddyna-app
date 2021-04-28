import React from 'react';
import PropTypes from 'prop-types';
import Select from '../1-atoms/Select';
import AddButton from '../1-atoms/AddButton';
import { Grid, Paper, TextField, Typography } from '@material-ui/core';
import {
    getEquipmentTypesOptions,
    getModelsOptions,
} from '../../utils/optionsBuilders';

const Rule = (props) => {
    const {
        rule,
        changeType,
        changeComposition,
        changeModel,
        addFilter,
        models,
        children,
    } = props;
    const { type, composition, mappedModel } = rule;
    // TODO intl
    const equipmentLabel = 'Each';
    const compositionLabel = 'If';
    const filterLabel = 'Where';
    const modelLabel = 'should be mapped to';

    const onChangeComposition = (event) => {
        changeComposition(event.target.value);
    };
    return (
        <Paper>
            <Grid container justify={'flex-start'}>
                <Grid item>
                    <Typography variant="h2">{equipmentLabel}</Typography>
                </Grid>
                <Grid item>
                    <Select
                        options={getEquipmentTypesOptions()}
                        value={type}
                        setValue={changeType}
                    />
                </Grid>
                <Grid item>
                    <Typography variant="h2">:</Typography>
                </Grid>
            </Grid>
            {rule.filtersNumber > 1 && (
                <Grid container justify={'flex-start'}>
                    <Grid item xs={2}>
                        <Typography>{`${compositionLabel} :`}</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <TextField
                            fullWidth
                            onChange={onChangeComposition}
                            value={composition}
                        />
                    </Grid>
                </Grid>
            )}

            <Grid container justify={'space-between'}>
                <Grid item xs={3}>
                    <Typography>{`${filterLabel} :`}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <AddButton onClick={addFilter} />
                </Grid>
            </Grid>
            {children}
            <Grid container justify={'center'}>
                <Grid item xs={6}>
                    <Typography variant="h2">{`${modelLabel} :`}</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Select
                        options={getModelsOptions(models)}
                        value={mappedModel}
                        setValue={changeModel}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};
Rule.propTypes = {
    rule: PropTypes.object.isRequired,
    changeType: PropTypes.func.isRequired,
    changeComposition: PropTypes.func.isRequired,
    changeModel: PropTypes.func.isRequired,
    addFilter: PropTypes.func.isRequired,
    models: PropTypes.array.isRequired,
};

export default Rule;
