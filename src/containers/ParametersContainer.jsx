/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getModelDefinitions, getModelSets, makeGetModel, ModelSlice, postModelSetsGroup } from '../redux/slices/Model';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { makeGetMatches, MappingSlice } from '../redux/slices/Mapping';
import { GroupEditionOrigin, ParameterOrigin, SetType } from '../constants/models';
import PropTypes from 'prop-types';
import Stepper from '../components/2-molecules/Stepper';
import SetGroupEditor from '../components/3-organisms/SetGroupEditor';
import SetEditor from '../components/3-organisms/SetEditor';
import { isSetValid } from '../utils/parameters';
import VerticalStepper from '../components/2-molecules/VerticalStepper';
import SetSearch from '../components/3-organisms/SetSearch';
import useSetSearch from '../components/3-organisms/hooks/useSetSearch';

// TODO intl
const groupTitleLabel = 'Group Creation';
const setTitleLabel = 'Set Creation';

const ParametersContainer = ({
    model,
    setGroup = '',
    close,
    origin,
    originIndex,
    groupType = SetType.FIXED,
    isAbsolute = true,
}) => {
    // TODO Add path parameter here

    const dispatch = useDispatch();

    const currentGroup = useSelector((state) => state.models.currentGroup);

    useEffect(() => {
        // Keep fetched sets and definition up-to-date with instantiated model
        dispatch(
            getModelSets({
                modelName: model,
                groupName: setGroup,
                groupType: currentGroup?.type,
            })
        );
        dispatch(getModelDefinitions(model));
    }, [dispatch, model, setGroup, currentGroup.type]);

    const getModel = useMemo(makeGetModel, []);
    const modelToEdit = useSelector((state) => getModel(state, model));
    const definitions = useSelector((state) => state.models.parameterDefinitions);
    const getMatches = useMemo(makeGetMatches, []);
    const matches = useSelector((state) =>
        getMatches(state, {
            isRule: origin === GroupEditionOrigin.RULE,
            index: originIndex,
        })
    );

    const groupToEdit = modelToEdit?.groups.find((group) => group.name === setGroup && group.type === groupType);
    const otherGroups =
        modelToEdit?.groups
            .filter((group) => !(group.name === setGroup && group.type === groupType))
            .map((group) => group.name) ?? [];

    const controlledParameters = useSelector((state) => state.mappings.controlledParameters);

    const [step, setStep] = useState(setGroup ? 1 : 0);
    const isFirstStep = step === 0;
    const showSteps = (!setGroup || currentGroup.sets.length > 1) && controlledParameters;

    const currentSet = currentGroup.sets[step - 1] ?? {
        name: currentGroup.name,
        parameters: definitions.map((definition) => ({
            name: definition.name,
            value: definition.fixedValue ?? '',
        })),
    };
    const maxStep = currentGroup.sets.length;
    const isMaxStep = step === maxStep;

    const changeGroupName = (newName) => {
        dispatch(ModelSlice.actions.changeGroupName(newName));
    };
    const changeGroupType = (newType) => dispatch(ModelSlice.actions.changeGroupType(newType));
    const addOrModifySet = (newSet) => dispatch(ModelSlice.actions.addOrModifySet(newSet));
    const saveSetGroup = () => {
        (async () => {
            await dispatch(postModelSetsGroup(controlledParameters));
            const actionToDispatch =
                origin === GroupEditionOrigin.RULE
                    ? MappingSlice.actions.changeRuleParameters
                    : MappingSlice.actions.changeAutomatonParameters;
            dispatch(
                actionToDispatch({
                    index: originIndex,
                    parameters: currentGroup.name,
                    type: currentGroup.type,
                })
            );
        })();
        close();
    };

    const isErrorName = currentGroup.name === '' || otherGroups.includes(currentGroup.name);
    const isErrorSets = !isSetValid(currentSet, definitions);

    // for vertical stepper
    const completed = useMemo(() => {
        const completed = {};
        currentGroup.sets.forEach((set, index) => {
            completed[index + 1] = isSetValid(set, definitions);
        });
        return completed;
    }, [currentGroup, definitions]);
    const showVerticalSteps = showSteps && maxStep > 1;
    const isAllCompleted = () => {
        return Object.values(completed).every((v) => v);
    };

    const isError = isErrorName || (step > 0 && (isErrorSets || !isAllCompleted()));

    useEffect(() => {
        // Populate currentGroup
        if (model) {
            dispatch(
                ModelSlice.actions.changeGroup({
                    group: currentGroup,
                    originalGroup: groupToEdit,
                    modelName: model,
                    matches: matches,
                    isAbsolute: isAbsolute,
                })
            );
        }
        // Cannot be an issue there because currentGroup, groupToEdit and matches cannot be updated elsewhere and we do not want to update changeGroup
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, currentGroup.type, currentGroup.name, model, isAbsolute]);

    const onClose = () => {
        dispatch(ModelSlice.actions.resetGroup());
        close();
    };

    // FIX and NETWORK can not be modified here
    const definitionFilter = (definition) => [ParameterOrigin.USER].includes(definition.origin);

    // hook for SetSearch component
    const { modelsSelector, groupsSelector, setsSelector, handleChangeGroup, handleResetSetSearch, handleApplySet } =
        useSetSearch(currentGroup, currentSet);

    return (
        <Dialog
            open={true}
            onClose={onClose}
            fullWidth={!isFirstStep}
            maxWidth={isFirstStep ? 'xs' : showVerticalSteps ? 'lg' : 'md'}
            scroll="paper"
        >
            <DialogTitle>{isFirstStep ? groupTitleLabel : setTitleLabel}</DialogTitle>
            <DialogContent>
                {isFirstStep ? (
                    <SetGroupEditor
                        name={currentGroup.name}
                        isError={isErrorName}
                        type={currentGroup.type}
                        changeName={changeGroupName}
                        changeType={changeGroupType}
                        isAbsolute={isAbsolute}
                    />
                ) : (
                    <Grid container>
                        {showVerticalSteps && (
                            <Grid item xs={3} pt={10}>
                                <VerticalStepper
                                    steps={currentGroup.sets.map((set, index) => ({
                                        label: set.name,
                                        value: index + 1,
                                    }))}
                                    step={step - 1}
                                    setStep={setStep}
                                    completed={completed}
                                />
                            </Grid>
                        )}
                        <Grid item xs={showVerticalSteps ? 5 : 8}>
                            <SetEditor
                                definitions={definitions}
                                filter={definitionFilter}
                                saveSet={addOrModifySet}
                                set={currentSet}
                            />
                        </Grid>
                        <Grid item xs={4} pt={1}>
                            <SetSearch
                                typeFilter={modelToEdit?.type}
                                modelsSelector={modelsSelector}
                                groupsSelector={groupsSelector}
                                setsSelector={setsSelector}
                                onChangeGroup={handleChangeGroup}
                                onReset={handleResetSetSearch}
                                onApply={handleApplySet}
                            />
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            {showSteps ? (
                <Stepper
                    step={step}
                    maxStep={maxStep}
                    setStep={setStep}
                    onFinish={saveSetGroup}
                    onCancel={close}
                    disabled={(isMaxStep || isFirstStep) && isError}
                />
            ) : (
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={saveSetGroup} color="primary" disabled={isError}>
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
    groupType: PropTypes.string,
    isAbsolute: PropTypes.bool,
    close: PropTypes.func.isRequired,
};
export default ParametersContainer;
