/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Step, StepButton, StepLabel, Stepper } from '@mui/material';
import PropTypes from 'prop-types';

function VerticalStepper(props) {
    const { steps, step, setStep, completed } = props;

    const handleStep = (step) => () => {
        setStep(step);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper nonLinear activeStep={step} orientation="vertical">
                {steps.map((elem) => {
                    // config error color
                    const labelProps = {};
                    if (!completed[elem.value]) {
                        labelProps.error = true;
                    }
                    return (
                        <Step key={elem.value} completed={completed[elem.value]}>
                            <StepButton color="inherit" onClick={handleStep(elem.value)}>
                                <StepLabel {...labelProps}>{elem.label}</StepLabel>
                            </StepButton>
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    );
}

VerticalStepper.propTypes = {
    steps: PropTypes.array.isRequired,
    step: PropTypes.number.isRequired,
    setStep: PropTypes.func.isRequired,
    completed: PropTypes.object,
};

export default VerticalStepper;
