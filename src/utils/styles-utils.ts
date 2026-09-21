/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const styles = {
    accordionSummary: {
        '& .MuiAccordionSummary-content': {
            marginY: 1,
        },
        '& .MuiAccordionSummary-content.Mui-expanded': {
            marginY: 1,
        },
        minHeight: 'unset',
        '&.Mui-expanded': {
            minHeight: 'unset',
        },
    },
    accordionDetails: {
        '&.MuiAccordionDetails-root': {
            paddingLeft: 0,
            paddingRight: 0,
        },
    },
};
