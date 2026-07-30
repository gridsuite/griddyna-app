/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    YUP_DEFAULT,
    YUP_NOT_NULL,
    YUP_NOT_TYPE_DEFAULT,
    YUP_NOT_TYPE_NUMBER,
    YUP_POSITIVE,
    YUP_REQUIRED,
} from '@gridsuite/commons-ui';

// TODO move to commons-ui and clean in networkModificationsFr.ts
export const yupFr = {
    [YUP_REQUIRED]: 'Obligatoire',
    [YUP_NOT_NULL]: 'Ne peut pas être vide',
    [YUP_DEFAULT]: 'Ce champ est invalide',
    [YUP_POSITIVE]: 'Doit être un nombre positif',
    [YUP_NOT_TYPE_NUMBER]: "Ce champ n'accepte que des valeurs numériques",
    [YUP_NOT_TYPE_DEFAULT]: "La valeur du champ n'est pas au bon format",
};
