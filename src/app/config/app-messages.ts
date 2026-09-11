/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IntlConfig } from 'react-intl';
import {
    cardErrorBoundaryEn,
    cardErrorBoundaryFr,
    commonButtonEn,
    commonButtonFr,
    descriptionEn,
    descriptionFr,
    equipmentShortEn,
    equipmentShortFr,
    errorsEn,
    errorsFr,
    filterEn,
    filterExpertEn,
    filterExpertFr,
    filterFr,
    genericValidationEn,
    genericValidationFr,
    GsLangUser,
    loginEn,
    loginFr,
    topBarEn,
    topBarFr,
    treeviewFinderEn,
    treeviewFinderFr,
    useUniqueNameValidationEn,
    useUniqueNameValidationFr,
} from '@gridsuite/commons-ui';
import { businessErrorsEn } from '../../translations/businessErrorsEn';
import { businessErrorsFr } from '../../translations/businessErrorsFr';
import messages_en from '../../translations/en.json';
import messages_fr from '../../translations/fr.json';

export const appMessages: Record<GsLangUser, IntlConfig['messages']> = {
    en: {
        ...messages_en,
        ...loginEn,
        ...topBarEn,
        ...cardErrorBoundaryEn,
        ...commonButtonEn,
        ...descriptionEn,
        ...equipmentShortEn,
        ...errorsEn,
        ...filterEn,
        ...filterExpertEn,
        ...treeviewFinderEn,
        ...useUniqueNameValidationEn,
        ...businessErrorsEn,
        ...genericValidationEn,
    },
    fr: {
        ...messages_fr,
        ...loginFr,
        ...topBarFr,
        ...cardErrorBoundaryFr,
        ...commonButtonFr,
        ...descriptionFr,
        ...equipmentShortFr,
        ...errorsFr,
        ...filterFr,
        ...filterExpertFr,
        ...treeviewFinderFr,
        ...useUniqueNameValidationFr,
        ...businessErrorsFr,
        ...genericValidationFr,
    },
};
