import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeGetRule, RuleSlice } from '../redux/slices/Rule';
import { makeGetModels } from '../redux/slices/InstanceModel';
import Rule from '../components/3-molecules/Rule';
import FiltersTemplate from '../components/4-templates/FiltersTemplate';
import FilterContainer from './FilterContainer';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

const RuleContainer = ({ index }) => {
    const getRule = useMemo(makeGetRule, []);
    const rule = useSelector((state) => getRule(state, index));
    const { type, filtersNumber } = rule;

    const getModels = useMemo(makeGetModels, []);
    const models = useSelector((state) => getModels(state, rule.type));
    const dispatch = useDispatch();
    const changeType = (newType) =>
        dispatch(
            RuleSlice.actions.changeRuleType({ index, equipmentType: newType })
        );
    const changeComposition = (newComposition) =>
        dispatch(
            RuleSlice.actions.changeRuleComposition({
                index,
                composition: newComposition,
            })
        );

    const changeModel = (newModel) =>
        dispatch(
            RuleSlice.actions.changeRuleModel({
                index,
                mappedModel: newModel,
            })
        );

    const addFilter = () =>
        dispatch(
            RuleSlice.actions.addFilter({
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
        if (models.length === 1) {
            changeModel(models[0].id);
        } else {
            changeModel('');
        }
    }, [type]);

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
