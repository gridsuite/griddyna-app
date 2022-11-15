import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import PropTypes from 'prop-types';
import { StepLabel } from '@mui/material';

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
                        <Step
                            key={elem.value}
                            completed={completed[elem.value]}
                        >
                            <StepButton
                                color="inherit"
                                onClick={handleStep(elem.value)}
                            >
                                <StepLabel {...labelProps}>
                                    {elem.label}
                                </StepLabel>
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
