/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { MobileStepper } from '@material-ui/core';
import { useStyles } from './DotStepperStyles';

const saveLabel = 'Save';
const nextLabel = 'Next';
const backLabel = 'Back';
const cancelLabel = 'Cancel';

const DotStepper = (props) => {
    const {
        step,
        setStep,
        maxStep,
        onFinish,
        onCancel,
        disabled = false,
    } = props;

    const classes = useStyles();
    return (
        <MobileStepper
            className={classes.position}
            backButton={
                <Button
                    size="small"
                    onClick={step === 0 ? onCancel : () => setStep(step - 1)}
                >
                    {' '}
                    <KeyboardArrowLeft />
                    {step === 0 ? cancelLabel : backLabel}
                </Button>
            }
            nextButton={
                <Button
                    size="small"
                    onClick={
                        step === maxStep ? onFinish : () => setStep(step + 1)
                    }
                    disabled={disabled}
                >
                    {step === maxStep ? saveLabel : nextLabel}
                    <KeyboardArrowRight />
                </Button>
            }
            steps={maxStep + 1}
            activeStep={step}
        />
    );
};

DotStepper.propTypes = {
    step: PropTypes.number.isRequired,
    maxStep: PropTypes.number.isRequired,
    setStep: PropTypes.func.isRequired,
    onFinish: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default DotStepper;
