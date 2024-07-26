/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ApiService } from '@gridsuite/commons-ui';
import { getUser } from '../redux/store';
import { UUID } from 'crypto';

export default class DynamicMappingSvc extends ApiService {
    public constructor() {
        super(
            getUser,
            process.env.REACT_APP_DYNAMAP_SVC,
            // If you want to use user-admin-server in dev mode you must avoid passing through gateway
            // and use the user-admin-server directly. SetupProxy should allow this.
            // @ts-expect-error url type incompatibility
            process.env.REACT_APP_API_PREFIX
        );
    }

    public async postMapping(
        mappingName: string,
        rules: unknown,
        automata: unknown,
        controlledParameters: boolean
    ) {
        return await this.backendFetchJson(
            `${this.getPrefix(1)}/mappings/${mappingName}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: mappingName,
                    rules,
                    automata,
                    controlledParameters,
                }),
            }
        );
    }

    public async getMappings() {
        return await this.backendFetchJson(`${this.getPrefix(1)}/mappings/`);
    }

    public async deleteMapping(mappingName: string) {
        return await this.backendFetchText(
            `${this.getPrefix(1)}/mappings/${mappingName}`,
            'DELETE'
        );
    }

    public async renameMapping(nameToReplace: string, newName: string) {
        return await this.backendFetchJson(
            `${this.getPrefix(
                1
            )}/mappings/rename/${nameToReplace}/to/${newName}`,
            'POST'
        );
    }

    public async copyMapping(originalName: string, copyName: string) {
        return await this.backendFetchJson(
            `${this.getPrefix(1)}/mappings/copy/${originalName}/to/${copyName}`,
            'POST'
        );
    }

    public async getPropertyValuesFromFile(networkFile: string | Blob) {
        const formData = new FormData();
        formData.append('file', networkFile);
        return await this.backendFetchJson(`${this.getPrefix(1)}/network/new`, {
            method: 'POST',
            body: formData,
        });
    }

    public async getPropertyValuesFromId(networkId: UUID) {
        return await this.backendFetchJson(
            `${this.getPrefix(1)}/network/${networkId}/values`
        );
    }

    public async getNetworksName() {
        return await this.backendFetchJson(`${this.getPrefix(1)}/network/`);
    }

    public async getNetworkMatchesFromRule(
        networkId: UUID,
        ruleToMatch: unknown
    ) {
        return await this.backendFetchJson(
            `${this.getPrefix(1)}/network/${networkId}/matches/rule`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ruleToMatch),
            }
        );
    }

    public async getModels() {
        return this.backendFetchJson(`${this.getPrefix(1)}/models/`);
    }

    public async getModelDefinitions(modelName: string) {
        return await this.backendFetchJson(
            `${this.getPrefix(1)}/models/${modelName}/parameters/definitions`
        );
    }

    public async getModelSets(
        modelName: string,
        groupName: string,
        groupType: unknown
    ) {
        return await this.backendFetchJson(
            `${this.getPrefix(
                1
            )}/models/${modelName}/parameters/sets/${groupName}/${groupType}`
        );
    }

    public async postModelSetsGroup(setGroup: any, strict: boolean) {
        return await this.backendFetchJson(
            `${this.getPrefix(1)}/models/${setGroup.modelName}/parameters/sets${
                strict ? '/strict' : ''
            }`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(setGroup),
            }
        );
    }

    public async getAutomatonDefinitions() {
        return await this.backendFetchJson(
            `${this.getPrefix(1)}/models/automaton-definitions`
        );
    }
}
