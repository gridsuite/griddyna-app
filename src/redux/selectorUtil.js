/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// helper to extract individual fields from a parameter object
// getRuleIndexParam = createParameterSelector(({ ruleIndex }) => ruleIndex);
export const createParameterSelector = (selector) => {
    return (_, paramObj) => selector(paramObj);
};
