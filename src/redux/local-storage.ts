/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DARK_THEME, type GsTheme } from '@gridsuite/commons-ui';

const LOCAL_STORAGE_THEME_KEY = `${import.meta.env.VITE_NAME}_THEME`;

export function getLocalStorageTheme() {
    return (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as GsTheme) || DARK_THEME;
}

export function saveLocalStorageTheme(theme: GsTheme) {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
}
