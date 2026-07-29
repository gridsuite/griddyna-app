/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { backendFetchJson } from '../utils/rest-api';
import { fetchElementNames } from '@gridsuite/commons-ui';

const API_URL =
    import.meta.env.VITE_API_PREFIX +
    (import.meta.env.VITE_USE_AUTHENTICATION === 'true'
        ? `${import.meta.env.VITE_GATEWAY_PREFIX}/study/v1`
        : `${import.meta.env.VITE_STUDY_URI}/v1`);

export function getServersInfos(token) {
    return backendFetchJson(
        `${API_URL}/servers/about?view=dyna`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
        },
        token
    ).catch((reason) => {
        console.error('Error while fetching the servers infos : ' + reason);
        return reason;
    });
}

export function getStudyNames(studyIds) {
    if (studyIds?.length > 0) {
        return fetchElementNames(new Set(studyIds)).then((studyIdNames) => {
            return studyIds.map((studyId) => {
                return {
                    studyId,
                    studyName: studyIdNames?.[studyId],
                };
            });
        });
    }
    return Promise.resolve([]);
}

export function getNetworkValuesFromStudy(studyId, token) {
    return backendFetchJson(
        `${API_URL}/studies/${studyId}/network-values`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
        },
        token
    );
}

export function getNetworkMatchesFromRule(studyId, ruleToMatch, token) {
    return backendFetchJson(
        `${API_URL}/studies/${studyId}/matches/rule`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
            body: JSON.stringify(ruleToMatch),
        },
        token
    );
}
