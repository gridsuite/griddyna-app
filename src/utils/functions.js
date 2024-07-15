/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import _ from 'lodash';

export const mergeSx = (...allSx) => allSx.flat();

/**
 * Copy properties from corresponding objects in a source array to objects in a target array.
 * It returns the target array that contain modified objects
 *
 * @param targetArray the target array to copy to inside objects
 * @param sourceArray the source array from which to copy properties of objects
 * @param matcher predicate to find the corresponding between a target element and a source element
 * @param props properties names to copy, specified individually or in array
 * @return the target array
 */
export const assignArray = (targetArray, sourceArray, matcher, ...props) => {
    targetArray?.forEach((targetObj) => {
        const matcherOfTarget = matcher(targetObj);
        const sourceObj = sourceArray?.find(matcherOfTarget);
        const pickObj = _.pick(sourceObj, props);
        Object.assign(targetObj, pickObj);
    });

    return targetArray;
};
