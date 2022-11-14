/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    makeGetAutomaton,
    makeIsAutomatonValid,
    MappingSlice,
} from '../redux/slices/Mapping';
import { makeGetModels } from '../redux/slices/Model';
import { makeGetPossibleWatchedElements } from '../redux/slices/Network';
import PropTypes from 'prop-types';
import Automaton from '../components/3-organisms/Automaton';
import { GroupEditionOrigin, SetType } from '../constants/models';

const AutomatonContainer = ({ index, editParameters }) => {
    const getAutomaton = useMemo(makeGetAutomaton, []);
    const automaton = useSelector((state) => getAutomaton(state, index));
    const { model, family, setGroup } = automaton;
    const isAutomatonValidSelector = useMemo(makeIsAutomatonValid, []);
    const isAutomatonValid = useSelector((state) =>
        isAutomatonValidSelector(state, index)
    );
    const getModels = useMemo(makeGetModels, []);
    const models = useSelector((state) => getModels(state, automaton.family));
    const getPossibleWatchedElements = useMemo(
        makeGetPossibleWatchedElements,
        []
    );
    const networkIds = useSelector((state) =>
        getPossibleWatchedElements(state, family)
    );
    const controlledParameters = useSelector(
        (state) => state.mappings.controlledParameters
    );
    const dispatch = useDispatch();
    const changeFamily = (newFamily) =>
        dispatch(
            MappingSlice.actions.changeAutomatonFamily({
                index,
                family: newFamily,
            })
        );
    const changeWatchedElement = (newWatchedElement) =>
        dispatch(
            MappingSlice.actions.changeAutomatonWatchedElement({
                index,
                watchedElement: newWatchedElement,
            })
        );

    const changeProperty = (property) =>
        dispatch(
            MappingSlice.actions.changeAutomatonPropertyValue({
                index,
                property,
            })
        );

    const changeModel = useCallback(
        (newModel) =>
            dispatch(
                MappingSlice.actions.changeAutomatonModel({
                    index,
                    model: newModel,
                })
            ),
        [dispatch, index]
    );

    const changeParameters = useCallback(
        (group) =>
            dispatch(
                MappingSlice.actions.changeAutomatonParameters({
                    index,
                    parameters: group.name,
                })
            ),
        [dispatch, index]
    );

    const deleteAutomaton = () =>
        dispatch(
            MappingSlice.actions.deleteAutomaton({
                index,
            })
        );

    const copyAutomaton = () =>
        dispatch(
            MappingSlice.actions.copyAutomaton({
                index,
            })
        );

    const editGroup = () => () =>
        editParameters({
            model,
            setGroup,
            groupType: SetType.FIXED,
            isAbsolute: true,
            origin: GroupEditionOrigin.AUTOMATON,
            originIndex: index,
        });

    useEffect(() => {
        // If selected model is not in the list
        if (!models.map((model) => model.name).includes(model)) {
            if (models.length === 1) {
                // Replace selected model with the only one available
                changeModel(models[0].name);
            } else {
                // Or remove selection (in case of Equipment Type Change)
                changeModel('');
            }
        }
        const mappedModel = models.find(
            (modelToTest) => modelToTest.name === model
        );
        // Same process for sets group
        if (
            mappedModel &&
            !mappedModel.groups.map((group) => group.name).includes(setGroup)
        ) {
            if (mappedModel.groups.length === 1) {
                changeParameters(mappedModel.groups[0].name);
            } else {
                changeParameters('');
            }
        }
    }, [models, changeModel, model, setGroup, changeParameters]);

    return (
        <Automaton
            automaton={automaton}
            isAutomatonValid={isAutomatonValid}
            changeFamily={changeFamily}
            changeWatchedElement={changeWatchedElement}
            changeModel={changeModel}
            changeParameters={changeParameters}
            changeProperty={changeProperty}
            models={models}
            networkIds={networkIds}
            deleteAutomaton={deleteAutomaton}
            copyAutomaton={copyAutomaton}
            editGroup={editGroup}
            controlledParameters={controlledParameters}
        />
    );
};

AutomatonContainer.propTypes = {
    index: PropTypes.number.isRequired,
    editParameters: PropTypes.func.isRequired,
};

export default AutomatonContainer;
