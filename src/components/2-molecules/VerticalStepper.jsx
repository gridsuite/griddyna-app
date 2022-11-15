import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import PropTypes from 'prop-types';

function VerticalStepper(props) {
    const { steps, step, setStep, completed } = props;

    const handleStep = (step) => () => {
        setStep(step);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper nonLinear activeStep={step} orientation="vertical">
                {steps.map((elem) => (
                    <Step key={elem.value} completed={completed[elem.value]}>
                        <StepButton
                            color="inherit"
                            onClick={handleStep(elem.value)}
                        >
                            {elem.label}
                        </StepButton>
                    </Step>
                ))}
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
