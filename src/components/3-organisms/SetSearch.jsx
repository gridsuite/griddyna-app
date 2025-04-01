/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { ApplyAllButton, ApplyOneButton, ResetButton } from '../1-atoms/buttons';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, Typography } from '@mui/material';
import Select from '../1-atoms/Select';
import Autocomplete from '../1-atoms/Autocomplete';
import { styles } from './SetSearchStyle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { mergeSx } from '@gridsuite/commons-ui';

const RESET_SET_SEARCH_LABEL = 'Clear filter';
const APPLY_ONE_SET_SEARCH_LABEL = 'Apply one';
const APPLY_ALL_SET_SEARCH_LABEL = 'Apply all';
const SET_SEARCH_LABEL = 'Parameters Set';

SetSearch.propTypes = {
    typeFilter: PropTypes.string,
    modelsSelector: PropTypes.func,
    groupsSelector: PropTypes.func,
    setsSelector: PropTypes.func,
    onChangeGroup: PropTypes.func,
    onReset: PropTypes.func,
    onApply: PropTypes.func,
};

function SetSearch(props) {
    const { typeFilter, modelsSelector, groupsSelector, setsSelector, onChangeGroup, onReset, onApply } = props;

    const [expanded, setExpanded] = useState(true);

    // local state to manage set search selections
    const [model, setModel] = useState();
    const [group, setGroup] = useState();
    const [set, setSet] = useState();

    // use selectors configured by the parent components
    const models = useSelector((state) => modelsSelector(state, typeFilter));
    const groups = useSelector((state) => groupsSelector(state, model));
    const sets = useSelector(setsSelector);

    // handle events
    const handleSetModel = (value) => {
        setModel(models[value]);
        setGroup(undefined);
        setSet(undefined);

        // reset search result saved in store
        onReset();
    };

    const handleSetGroup = (value) => {
        const selectedGroup = groups[value];
        setGroup(selectedGroup);
        onChangeGroup(model, selectedGroup);
    };

    const handleChangeSet = (value) => {
        setSet(sets[value]);
    };

    const handleReset = () => {
        handleSetModel(undefined);
    };

    const handleApplyOne = () => {
        onApply(set, false); // false i.e. apply for current editing set
    };

    const handleApplyAll = () => {
        onApply(set, true); // true i.e. apply for all sets in the editing group
    };

    // transformations to representational format
    const _models =
        models?.map((model, index) => ({
            label: model.name,
            value: index,
        })) ?? [];

    const _groups =
        groups?.map((group, index) => ({
            label: group.name,
            value: index,
        })) ?? [];

    const _sets =
        sets?.map((set, index) => ({
            label: set.name,
            value: index,
        })) ?? [];

    // current selected elements in representational format
    const getModel = () => {
        return _models?.find((elem) => elem.label === model?.name);
    };

    const getGroup = () => {
        return _groups?.find((elem) => elem.label === group?.name);
    };

    const getSet = () => {
        return _sets?.find((elem) => elem.label === set?.name);
    };

    // render
    return (
        <Accordion expanded={expanded} onChange={() => setExpanded((prev) => !prev)} elevation={10}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={styles.labelRoot}>{SET_SEARCH_LABEL}</Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails style={{ display: 'inherit' }}>
                <Grid
                    container
                    justifyContent={'space-between'}
                    alignItems={'stretch'}
                    spacing={2}
                    direction={'column'}
                >
                    <Grid item xs={12}>
                        <Grid container justifyContent={'flex-start'} alignItems={'stretch'} direction={'column'}>
                            <Grid item xs={12}>
                                <Select
                                    label={'Model'}
                                    options={_models}
                                    value={getModel()?.value ?? ''}
                                    setValue={handleSetModel}
                                    error={false}
                                    sx={styles.fieldSearch}
                                ></Select>
                            </Grid>
                            <Grid item xs={12}>
                                <Select
                                    label={'Group'}
                                    options={_groups}
                                    value={getGroup()?.value ?? ''}
                                    setValue={handleSetGroup}
                                    error={false}
                                    sx={styles.fieldSearch}
                                ></Select>
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    isFree={false}
                                    isMultiple={false}
                                    value={getSet()?.value ?? ''}
                                    onChange={handleChangeSet}
                                    options={_sets}
                                    highlightOptions={[]}
                                    type={undefined}
                                    error={false}
                                    label={'Parameters set'}
                                    sx={mergeSx(styles.fieldSearch, {
                                        marginLeft: 1,
                                    })}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-end" alignItems={'flex-start'} spacing={1}>
                            <Grid item>
                                <ApplyOneButton onClick={handleApplyOne} tooltip={APPLY_ONE_SET_SEARCH_LABEL} />
                            </Grid>
                            <Grid item>
                                <ApplyAllButton onClick={handleApplyAll} tooltip={APPLY_ALL_SET_SEARCH_LABEL} />
                            </Grid>
                            <Grid item>
                                <ResetButton onClick={handleReset} tooltip={RESET_SET_SEARCH_LABEL} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
}

export default SetSearch;
