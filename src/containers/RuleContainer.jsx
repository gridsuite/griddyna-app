/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeGetRule, MappingSlice } from '../redux/slices/Mapping';
import { makeGetModels } from '../redux/slices/InstanceModel';
import Rule from '../components/3-molecules/Rule';
import FiltersTemplate from '../components/4-templates/FiltersTemplate';
import FilterContainer from './FilterContainer';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

const RuleContainer = ({ index }) => {
    const getRule = useMemo(makeGetRule, []);
    const rule = useSelector((state) => getRule(state, index));
    const { type, filtersNumber, mappedModel } = rule;

    const getModels = useMemo(makeGetModels, []);
    const models = useSelector((state) => getModels(state, rule.type));
    const dispatch = useDispatch();
    const changeType = (newType) =>
        dispatch(
            MappingSlice.actions.changeRuleType({
                index,
                equipmentType: newType,
            })
        );
    const changeComposition = (newComposition) =>
        dispatch(
            MappingSlice.actions.changeRuleComposition({
                index,
                composition: newComposition,
            })
        );

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

    const addFilter = () =>
        dispatch(
            MappingSlice.actions.addFilter({
                index,
            })
        );

    function buildFilters() {
        const filters = [];
        for (let i = 0; i < filtersNumber; i++) {
            filters.push(
                <FilterContainer
                    key={`filter-container-${i}`}
                    ruleIndex={index}
                    filterIndex={i}
                    equipmentType={type}
                />
            );
        }
        return filters;
    }
    // TODO intl
    const noFilterLabel = 'no other rule applies';

    useEffect(() => {
        if (!models.map((model) => model.name).includes(mappedModel)) {
            if (models.length === 1) {
                changeModel(models[0].id);
            } else {
                changeModel('');
            }
        }
    }, [type, models, changeModel, mappedModel]);

    return (
        <Rule
            rule={rule}
            changeType={changeType}
            changeComposition={changeComposition}
            changeModel={changeModel}
            addFilter={addFilter}
            models={models}
        >
            {rule.filtersNumber > 0 ? (
                <FiltersTemplate>{buildFilters()}</FiltersTemplate>
            ) : (
                <Typography variant="subtitle2" style={{ textAlign: 'center' }}>
                    {noFilterLabel}
                </Typography>
            )}
        </Rule>
    );
};

RuleContainer.propTypes = {
    index: PropTypes.number.isRequired,
};

export default RuleContainer;
