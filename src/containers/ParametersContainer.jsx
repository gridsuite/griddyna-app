/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getModelDefinitions,
    getModels,
    getModelSets,
    makeGetModel,
    ModelSlice,
    postModelSetsGroup,
} from '../redux/slices/Model';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';
import { MappingSlice } from '../redux/slices/Mapping';
import { GroupEditionOrigin } from '../constants/models';
import PropTypes from 'prop-types';
import DotStepper from '../components/2-molecules/DotStepper';
import SetGroupEditor from '../components/3-organisms/SetGroupEditor';
import SetEditor from '../components/3-organisms/SetEditor';
import { isSetValid } from '../utils/parameters';

// TODO intl
const groupTitleLabel = 'Group Creation';
const setTitleLabel = 'Set Creation';

const ParametersContainer = ({
    model,
    setGroup = '',
    close,
    origin,
    originIndex,
}) => {
    // TODO Add path parameter here

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getModelSets({ modelName: model, groupName: setGroup }));
        dispatch(getModelDefinitions(model));
    }, [dispatch, model, setGroup]);

    const getModel = useMemo(makeGetModel, []);
    const modelToEdit = useSelector((state) => getModel(state, model));
    const definitions = useSelector(
        (state) => state.models.parameterDefinitions
    );

    const groupToEdit = modelToEdit.groups.find(
        (group) => group.name === setGroup
    );
    const otherGroups = modelToEdit.groups
        .map((group) => group.name)
        .filter((groupName) => groupName !== setGroup);

    const controlledParameters = useSelector(
        (state) => state.mappings.controlledParameters
    );

    const [step, setStep] = useState(setGroup ? 1 : 0);
    const showSteps = !setGroup && controlledParameters;
    const maxStep = 1; // TODO: Change when PREFIX/SUFFIX Group are implemented ( maxStep = number or equipments in network to parametrize)

    const currentGroup = useSelector((state) => state.models.currentGroup);

    const currentSet = currentGroup.sets[step - 1] ?? {
        name: currentGroup.name,
        parameters: definitions.map((definition) => ({
            name: definition.name,
            value: definition.fixedValue ?? '',
        })),
    };

    const changeGroupName = (newName) => {
        dispatch(ModelSlice.actions.changeGroupName(newName));
    };
    const changeGroupType = (newType) =>
        dispatch(ModelSlice.actions.changeGroupType(newType));
    const addOrModifySet = (newSet) =>
        dispatch(ModelSlice.actions.addOrModifySet(newSet));
    const saveSetGroup = () => {
        dispatch(postModelSetsGroup(controlledParameters));
        const actionToDispatch =
            origin === GroupEditionOrigin.RULE
                ? MappingSlice.actions.changeRuleParameters
                : MappingSlice.actions.changeAutomatonParameters;
        dispatch(
            actionToDispatch({
                index: originIndex,
                parameters: currentGroup.name,
            })
        );
        dispatch(getModels());

        close();
    };

    const isErrorName =
        currentGroup.name === '' || otherGroups.includes(currentGroup.name);
    const isErrorSets = !isSetValid(currentSet, definitions);

    const isError = isErrorName || (step > 0 && isErrorSets);

    useEffect(() => {
        dispatch(
            ModelSlice.actions.changeGroup({
                group: groupToEdit,
                modelName: model,
            })
        );
    }, [dispatch, groupToEdit, model]);

    return (
        <Dialog open={true} onClose={close}>
            <DialogTitle>
                {step === 0 ? groupTitleLabel : setTitleLabel}
            </DialogTitle>
            <DialogContent>
                {step === 0 ? (
                    <SetGroupEditor
                        name={currentGroup.name}
                        isError={isErrorName}
                        type={currentGroup.type}
                        changeName={changeGroupName}
                        changeType={changeGroupType}
                    />
                ) : (
                    <SetEditor
                        definitions={definitions}
                        saveSet={addOrModifySet}
                        set={currentSet}
                    />
                )}
            </DialogContent>
            {showSteps ? (
                <DotStepper
                    step={step}
                    maxStep={maxStep}
                    setStep={setStep}
                    onFinish={saveSetGroup}
                    onCancel={close}
                    disabled={isError}
                />
            ) : (
                <DialogActions>
                    <Button onClick={close} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={saveSetGroup}
                        color="primary"
                        disabled={isError}
                    >
                        Save
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

ParametersContainer.propTypes = {
    model: PropTypes.string.isRequired,
    origin: PropTypes.string.isRequired,
    originIndex: PropTypes.number.isRequired,
    setGroup: PropTypes.string,
    close: PropTypes.func.isRequired,
};
export default ParametersContainer;
