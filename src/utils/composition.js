/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function convertCompositionStringToArray(compositionString) {
    // Transform parentheses into arrays
    const step1 = compositionString
        .split(/([()])/)
        .map((x) => x.trim())
        .join(' ')
        .replace(/\)\s\)/g, '))')
        .replace(/\(/g, '[')
        .replace(/\)\s/g, '], ')
        .replace(/\)/g, ']');

    // Wrap whole string in an array
    const step2 = '[' + step1 + ']';

    // Replace whitespace separators with commas and escape values
    const step3 = step2
        .replace(/[^[\],\s]+/g, '"$&"')
        .replace(/" /g, '", ')
        .replace(/,[\s]+]/g, ']');

    // Parse as a JSON array
    const compositionArray = JSON.parse(step3);

    // Wrap Single filters in a group
    return compositionArray.map((element) => {
        if (!Array.isArray(element) && element !== '||' && element !== '&&') {
            return [element];
        }
        return element;
    });
}

export function convertCompositionArrayToString(compositionArray) {
    const compositionStringArray = compositionArray.map((element) => {
        if (Array.isArray(element)) {
            if (element.length === 1) {
                return element[0];
            } else {
                return `(${convertCompositionArrayToString(element)})`;
            }
        }
        return element;
    });
    return compositionStringArray.join(' ');
}

export const checkCompositionArrayValidity = (compositionArray, isInner = false) => {
    let arrayOperation;
    return compositionArray
        .map((compositionElement, index) => {
            if (index % 2 === 0) {
                if (Array.isArray(compositionElement)) {
                    return checkCompositionArrayValidity(compositionElement, true);
                }
                return /filter\d+\b/.test(compositionElement);
            }
            if (index === 1) {
                arrayOperation = compositionElement;
            }
            return /(&&|\|\|)/.test(compositionElement) && (!isInner || compositionElement === arrayOperation);
        })
        .reduce((acc, element) => acc && element);
};

export function getMaxDepthParentheses(logicString) {
    let count = 0;
    let maxCount = 0;
    Array.from(logicString).forEach((char) => {
        if (char === '(') {
            count += 1;
        } else if (char === ')') {
            count -= 1;
        }
        if (count > maxCount) {
            maxCount = count;
        }
    });
    return maxCount;
}
