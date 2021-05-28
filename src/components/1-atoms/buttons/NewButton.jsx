/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

const NewButton = ({ onClick, className }) => (
    <Button
        variant="outlined"
        onClick={onClick}
        endIcon={<AddRoundedIcon />}
        className={className}
    >
        New
    </Button>
);

NewButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default NewButton;
