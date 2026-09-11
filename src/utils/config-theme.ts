/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createTheme, responsiveFontSizes } from '@mui/material';
import { GsLangUser, GsTheme, LANG_FRENCH, LIGHT_THEME } from '@gridsuite/commons-ui';
import { enUS as MuiCoreEnUS, frFR as MuiCoreFrFR } from '@mui/material/locale';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
    mapboxStyle: 'mapbox://styles/mapbox/light-v9',
    typography: {
        button: {
            textTransform: 'none',
        },
    },
});
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    mapboxStyle: 'mapbox://styles/mapbox/dark-v9',
    typography: {
        button: {
            textTransform: 'none',
        },
    },
});

export function getMuiTheme(theme: GsTheme, locale: GsLangUser) {
    return responsiveFontSizes(
        createTheme(
            theme === LIGHT_THEME ? lightTheme : darkTheme,
            locale === LANG_FRENCH ? MuiCoreFrFR : MuiCoreEnUS // MUI core translations
        )
    );
}
