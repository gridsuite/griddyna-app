/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Checkbox, Grid, Typography } from '@mui/material';
import Select from '../1-atoms/Select';
import { styles } from './SetGroupSelectStyle';
import { useEffect, useState } from 'react';
import { SetType } from '../../constants/models';
import { EditButton } from '../1-atoms/buttons';
import { Group, Model } from '../../redux/types/model.type';
import { mergeSx } from 'utils/functions';

const setLabel = 'and use parameters group';
const editGroupLabel = 'Edit the parameters group and/or the parameters sets';
const simpledEditLabel = 'Cannot edit sets without enabling parameters management';
const newGroupLabel = 'Create new group';
const isAbsoluteLabel = 'All equipments share the same .par file';

const parName = (group: Group) =>
    (group.type === SetType.SUFFIX ? '{id}' : '') + group.name + (group.type === SetType.PREFIX ? '{id}' : '');

interface SetGroupSelectProps {
    model: string;
    models: Model[];
    setGroup: string;
    groupType: string;
    changeGroup: (group: Group) => void;
    editGroup: (isAbsolute: boolean) => (group: Group) => void;
    controlledParameters: boolean;
    isNetworkAttached: boolean;
}

const newEmptyGroup = { name: '', type: '', setsNumber: 0 };

const SetGroupSelect = (props: SetGroupSelectProps) => {
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
    const mappedModel = models.find((modelToTest) => modelToTest.name === model);

    const groups = mappedModel ? mappedModel.groups : [];

    const foundGroup: Group | undefined = mappedModel?.groups.find(
        (group) => group.name === setGroup && group.type === groupType
    );

    const [isAbsolute, setIsAbsolute] = useState(![SetType.PREFIX, SetType.SUFFIX].includes(groupType));

    useEffect(() => {
        // Update isAbsolute according to the group type for the rule
        if (groupType) {
            setIsAbsolute(![SetType.PREFIX, SetType.SUFFIX].includes(groupType));
        }
    }, [groupType]);

    const onAbsoluteChange = () => {
        setIsAbsolute(!isAbsolute);
        changeGroup(newEmptyGroup);
    };
    let groupOptions: { label: string; value?: Group }[] = groups
        .filter((group) => (isAbsolute ? group.type === SetType.FIXED : group.type !== SetType.FIXED))
        .map((group) => ({
            label: parName(group),
            value: group,
        }));
    groupOptions.push({ label: newGroupLabel });

    const errorInParams = controlledParameters && (foundGroup === undefined || foundGroup.setsNumber === 0);

    return (
        <Grid container justifyContent={'flex-start'}>
            <Grid item container justifyContent={'flex-start'}>
                <Grid item xs sx={styles.gridItem}>
                    <Typography variant="subtitle1">{`${isAbsoluteLabel} :`}</Typography>
                </Grid>
                <Grid item container xs="auto" justifyContent={'flex-end'}>
                    <Checkbox checked={isAbsolute} onChange={onAbsoluteChange} disabled={!isNetworkAttached} />
                </Grid>
            </Grid>
            <Grid item container justifyContent={'flex-start'}>
                <Grid item xs sx={styles.gridItem}>
                    <Typography variant="subtitle1">{`${setLabel} :`}</Typography>
                </Grid>
                <Grid item xs="auto" sx={mergeSx(styles.button, styles.gridItem, errorInParams && styles.errorButton)}>
                    <EditButton
                        onClick={editGroup(isAbsolute)}
                        disabled={model === '' || (setGroup && !controlledParameters)}
                        tooltip={setGroup && !controlledParameters ? simpledEditLabel : editGroupLabel}
                    />
                </Grid>
                <Grid item xs="auto" sx={styles.titleSelect}>
                    <Select
                        options={groupOptions}
                        value={foundGroup ?? newEmptyGroup}
                        setValue={changeGroup}
                        error={foundGroup === undefined}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SetGroupSelect;
