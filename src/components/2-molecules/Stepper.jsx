/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button, MobileStepper } from '@mui/material';
import PropTypes from 'prop-types';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const saveLabel = 'Save';
const nextLabel = 'Next';
const backLabel = 'Back';
const cancelLabel = 'Cancel';

const Stepper = (props) => {
    const { step, setStep, maxStep, onFinish, onCancel, disabled = false } = props;

    return (
        <MobileStepper
            variant={maxStep < 10 ? 'dots' : 'text'}
            backButton={
                <Button size="small" onClick={step === 0 ? onCancel : () => setStep(step - 1)}>
                    <KeyboardArrowLeft />
                    {step === 0 ? cancelLabel : backLabel}
                </Button>
            }
            nextButton={
                <Button
                    size="small"
                    onClick={step === maxStep ? onFinish : () => setStep(step + 1)}
                    disabled={disabled}
                >
                    {step === maxStep ? saveLabel : nextLabel}
                    <KeyboardArrowRight />
                </Button>
            }
            steps={maxStep + 1}
            activeStep={step}
            position="static"
        />
    );
};

Stepper.propTypes = {
    step: PropTypes.number.isRequired,
    maxStep: PropTypes.number.isRequired,
    setStep: PropTypes.func.isRequired,
    onFinish: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default Stepper;
