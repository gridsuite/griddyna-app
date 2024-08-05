/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo } from 'react';
import {
    getSearchedModelSets,
    makeGetGroupByModel,
    makeGetModels,
    makeGetSearchSets,
    ModelSlice,
} from '../../../redux/slices/Model';
import _ from 'lodash';
import { useDispatch } from 'react-redux';

export default function useSetSearch(currentGroup, currentSet) {
    const dispatch = useDispatch();

    const modelsSelector = useMemo(makeGetModels, []);
    const groupsSelector = useMemo(makeGetGroupByModel, []);
    const setsSelector = useMemo(makeGetSearchSets, []);

    const handleChangeGroup = useCallback(
        (model, group) => {
            if (model && group) {
                dispatch(
                    getSearchedModelSets({
                        modelName: model?.name,
                        groupName: group?.name,
                        groupType: group?.type,
                    })
                );
            }
        },
        [dispatch]
    );

    const handleResetSetSearch = useCallback(() => {
        dispatch(ModelSlice.actions.resetSearchSets());
    }, [dispatch]);

    const handleApplySet = useCallback(
        (set, isAll) => {
            if (!set) {
                return;
            }

            const updatedSets = isAll
                ? _.reduce(currentGroup?.sets, (acc, set) => [...acc, _.cloneDeep(set)], [])
                : [_.cloneDeep(currentSet)];

            // fill with values in the provided sets
            _.forEach(updatedSets, (updatedSet) => {
                _.forEach(updatedSet?.parameters, (parameter) => {
                    const templateParameter = _.find(set?.parameters, (elem) => elem.name === parameter.name);
                    templateParameter && (parameter.value = templateParameter?.value);
                });
            });

            dispatch(ModelSlice.actions.addOrModifySet(updatedSets));
        },
        [dispatch, currentGroup.sets, currentSet]
    );
    return {
        modelsSelector,
        groupsSelector,
        setsSelector,
        handleChangeGroup,
        handleResetSetSearch,
        handleApplySet,
    };
}
