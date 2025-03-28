/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNetworkMatchesFromRule, makeGetRule, makeIsRuleValid, MappingSlice } from '../redux/slices/Mapping';
import { makeGetModels } from '../redux/slices/Model';
import Rule from '../components/3-organisms/Rule';
import FilterContainer from './FilterContainer';
import PropTypes from 'prop-types';
import { GroupEditionOrigin } from '../constants/models';
import { getCurrentNetworkId } from '../redux/slices/Network';

const RuleContainer = ({ index, editParameters }) => {
    const getRule = useMemo(makeGetRule, []);
    const rule = useSelector((state) => getRule(state, index));
    const { type, mappedModel, setGroup, groupType } = rule;
    const isRuleValidSelector = useMemo(makeIsRuleValid, []);
    const isRuleValid = useSelector((state) => isRuleValidSelector(state, index));
    const getModels = useMemo(makeGetModels, []);
    const models = useSelector((state) => getModels(state, rule.type));

    const controlledParameters = useSelector((state) => state.mappings.controlledParameters);

    const currentNetworkId = useSelector(getCurrentNetworkId);
    const dispatch = useDispatch();

    const changeModel = useCallback(
        (newModel) =>
            dispatch(
                MappingSlice.actions.changeRuleModel({
                    index,
                    mappedModel: newModel,
                })
            ),
        [dispatch, index]
    );

    const changeParameters = useCallback(
        (group) =>
            dispatch(
                MappingSlice.actions.changeRuleParameters({
                    index,
                    parameters: group?.name,
                    type: group?.type,
                })
            ),
        [dispatch, index]
    );

    const deleteRule = useCallback(
        () =>
            dispatch(
                MappingSlice.actions.deleteRule({
                    index,
                })
            ),
        [dispatch, index]
    );

    const copyRule = useCallback(
        () =>
            dispatch(
                MappingSlice.actions.copyRule({
                    index,
                })
            ),
        [dispatch, index]
    );

    const editGroup = useCallback(
        (isAbsolute) => () =>
            editParameters({
                model: mappedModel,
                setGroup,
                groupType,
                isAbsolute,
                origin: GroupEditionOrigin.RULE,
                originIndex: index,
            }),
        [editParameters, index, groupType, mappedModel, setGroup]
    );

    useEffect(() => {
        // If selected model is not in the list
        if (!models.map((model) => model.name).includes(mappedModel)) {
            if (models.length === 1) {
                // Replace selected model with the only one available
                changeModel(models[0].id);
            } else {
                changeModel('');
            }
        }
    }, [type, models, changeModel, mappedModel]);

    useEffect(() => {
        if (!!currentNetworkId && isRuleValid) {
            dispatch(getNetworkMatchesFromRule(index));
        }
    }, [currentNetworkId, isRuleValid, index, /*composition,*/ dispatch]);

    return (
        <Rule
            rule={rule}
            isRuleValid={isRuleValid}
            changeModel={changeModel}
            changeParameters={changeParameters}
            models={models}
            deleteRule={deleteRule}
            copyRule={copyRule}
            editGroup={editGroup}
            controlledParameters={controlledParameters}
            isNetworkAttached={!!currentNetworkId}
        >
            <FilterContainer ruleIndex={index} equipmentType={type} />
        </Rule>
    );
};

RuleContainer.propTypes = {
    index: PropTypes.number.isRequired,
    editParameters: PropTypes.func.isRequired,
};

export default RuleContainer;
