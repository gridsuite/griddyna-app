/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { GsLang, GsTheme, PARAM_DEVELOPER_MODE, PARAM_LANGUAGE, PARAM_THEME } from '@gridsuite/commons-ui';

export const FAVORITE_MAPPINGS = 'favoriteMappings';
export const FAVORITE_STUDIES = 'favoriteStudies';

// corresponding to org/gridsuite/config/server/dto/ParameterInfos.java
export type ConfigParameter =
    | {
          readonly name: typeof PARAM_LANGUAGE;
          value: GsLang;
      }
    | {
          readonly name: typeof PARAM_THEME;
          value: GsTheme;
      }
    | {
          readonly name: typeof PARAM_DEVELOPER_MODE;
          value: boolean;
      }
    | {
          readonly name: typeof FAVORITE_MAPPINGS;
          value: string;
      }
    | {
          readonly name: typeof FAVORITE_STUDIES;
          value: string;
      };
