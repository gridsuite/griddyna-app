/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { v4 as uuid4 } from 'uuid';
import { UUID } from 'crypto';
import { RuleGroupTypeExport, RuleTypeExport } from '@gridsuite/commons-ui';

const visitQuery = (
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

const idUpdaterMaker =
    (force: boolean) => (ruleOrGroup: RuleTypeExport | RuleGroupTypeExport) => {
        if (force || (ruleOrGroup && !ruleOrGroup.id)) {
            ruleOrGroup.id = uuid4() as UUID;
        }
    };

export const enrichIdQuery = (query: RuleGroupTypeExport, force: boolean) => {
    return visitQuery(query, idUpdaterMaker(force));
};
