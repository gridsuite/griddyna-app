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
import { makeGetModels } from '../redux/slices/InstanceModel';
import { makeGetPossibleWatchedElements } from '../redux/slices/Network';
import PropTypes from 'prop-types';
import Automaton from '../components/3-molecules/Automaton';

const AutomatonContainer = ({ index }) => {
    const getAutomaton = useMemo(makeGetAutomaton, []);
    const automaton = useSelector((state) => getAutomaton(state, index));
    const { model, family } = automaton;
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

    useEffect(() => {
        if (!models.map((model) => model.name).includes(model)) {
            if (models.length === 1) {
                changeModel(models[0].id);
            } else {
                changeModel('');
            }
        }
    }, [models, changeModel, model]);

    return (
        <Automaton
            automaton={automaton}
            isAutomatonValid={isAutomatonValid}
            changeFamily={changeFamily}
            changeWatchedElement={changeWatchedElement}
            changeModel={changeModel}
            changeProperty={changeProperty}
            models={models}
            networkIds={networkIds}
            deleteAutomaton={deleteAutomaton}
            copyAutomaton={copyAutomaton}
        />
    );
};

AutomatonContainer.propTypes = {
    index: PropTypes.number.isRequired,
};

export default AutomatonContainer;
