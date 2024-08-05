/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { v4 as uuid4 } from 'uuid';
import { UUID } from 'crypto';
import { RuleGroupTypeExport, RuleTypeExport } from '@gridsuite/commons-ui';

const visitRqbQuery = (
    query: RuleGroupTypeExport,
    visitor: (ruleOrGroup: RuleTypeExport | RuleGroupTypeExport) => void
) => {
    visitor(query);
    const stack = [...query.rules];
    while (stack?.length) {
        const ruleOrGroup = stack.shift();
        ruleOrGroup && visitor(ruleOrGroup);
        if (ruleOrGroup && 'rules' in ruleOrGroup) {
            stack.push(...ruleOrGroup.rules);
        }
    }
    return query;
};

const idUpdaterFactory =
    (idProvider: () => UUID, force: boolean) => (ruleOrGroup: RuleTypeExport | RuleGroupTypeExport) => {
        if (force || (ruleOrGroup && !ruleOrGroup.id)) {
            ruleOrGroup.id = idProvider() as UUID;
        }
    };

/**
 *
 * @param query a rqb query
 * @param force if true force setting a new uuid, otherwise do not set id if already exist
 */
export const enrichIdRqbQuery = (query: RuleGroupTypeExport, force: boolean) => {
    return visitRqbQuery(query, idUpdaterFactory(uuid4 as () => UUID, force));
};
