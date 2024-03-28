/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSelector } from '@reduxjs/toolkit';

export const areParametersValid = createSelector(
    (state) => state.mappings.controlledParameters,
    (state) => state.mappings.rules,
    (state) => state.mappings.automata,
    (state) => state.models.models,
    (controlledParameters, activeRules, activeAutomata, models) => {
        if (!controlledParameters) {
            return true;
        }

        const errorInRules = activeRules.some((rule) => {
            const foundGroup = models
                .find((model) => model.name === rule.mappedModel)
                ?.groups.find((group) => group.name === rule.setGroup);
            return foundGroup === undefined || foundGroup.setsNumber === 0;
        });

        if (errorInRules) {
            return false;
        }

        const errorInAutomata = activeAutomata.some((automaton) => {
            const foundGroup = models
                .find((model) => model.name === automaton.model)
                ?.groups.find((group) => group.name === automaton.setGroup);
            return !foundGroup || foundGroup.setsNumber === 0;
        });
        if (errorInAutomata) {
            return false;
        }
        return true;
    }
);
