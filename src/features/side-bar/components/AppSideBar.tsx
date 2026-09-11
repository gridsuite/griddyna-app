/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { createTheme } from '@mui/material';
import {
    AppSideBar as CommonAppSideBar,
    COMMON_APP_NAME,
    DARK_THEME,
    fetchAppsMetadata,
    getComputedLanguage,
    type GsLang,
    GsTheme,
    LIGHT_THEME,
    Metadata,
    PARAM_DEVELOPER_MODE,
    PARAM_LANGUAGE,
    PARAM_THEME,
    snackWithFallback,
    updateConfigParameter,
    useSnackMessage,
} from '@gridsuite/commons-ui';
import { upperFirst } from 'lodash';
import GriddynaLogoLight from '../../../images/griddyna_logo_light.svg?react';
import GriddynaLogoDark from '../../../images/griddyna_logo_dark.svg?react';
import { fetchVersion } from '../../../utils/rest-api';
import { getServersInfos } from '../../../rest/studyAPI';
import { APP_NAME } from '../../../utils/config-params';
import { getMuiTheme } from '../../../utils/config-theme';
import AppPackage from '../../../../package.json';
import { getDeveloperMode, getLang, getTheme } from '../../../redux/slices/Config';
import { useAppSelector } from '../../../redux/store';
import { getLocalStorageLanguage, getLocalStorageTheme } from '../../../redux/local-storage';

type SideBarProps = {
    onLogoutClick?: () => void;
};

export function AppSideBar({ onLogoutClick }: Readonly<SideBarProps>) {
    const { snackError } = useSnackMessage();

    // theme
    const currentTheme = useSelector(getTheme) ?? getLocalStorageTheme();
    const setTheme = useCallback(
        (newThemeValue: GsTheme) => {
            updateConfigParameter(COMMON_APP_NAME, PARAM_THEME, newThemeValue).catch((error) => {
                snackWithFallback(snackError, error, { headerId: 'updateConfigParameterError' });
            });
        },
        [snackError]
    );

    // language
    const selectedLanguage = useSelector(getLang) ?? getLocalStorageLanguage();
    const setSelectedLanguage = useCallback(
        (newLangValue: GsLang) => {
            updateConfigParameter(COMMON_APP_NAME, PARAM_LANGUAGE, newLangValue).catch((error) => {
                snackWithFallback(snackError, error, { headerId: 'updateConfigParameterError' });
            });
        },
        [snackError]
    );

    // developer mode
    const isDeveloperMode = useSelector(getDeveloperMode);
    const handleChangeDeveloperMode = useCallback(
        (newDeveloperModeValue: boolean) => {
            updateConfigParameter(COMMON_APP_NAME, PARAM_DEVELOPER_MODE, newDeveloperModeValue.toString()).catch(
                (error) => {
                    snackWithFallback(snackError, error, { headerId: 'updateConfigParameterError' });
                }
            );
        },
        [snackError]
    );

    // user
    const userProfile = useAppSelector(
        (state) => state.user.user?.profile ?? null,
        (a, b) =>
            a === b || (a?.sub === b?.sub && a?.name === b?.name && a?.email === b?.email && a?.profile === b?.profile)
    );

    const [appsAndUrls, setAppsAndUrls] = useState<Metadata[]>([]);
    const isDarkMode = currentTheme === DARK_THEME;
    const invertedThemeId = isDarkMode ? LIGHT_THEME : DARK_THEME;
    const invertedTheme = useMemo(() => {
        const baseTheme = getMuiTheme(invertedThemeId, getComputedLanguage(selectedLanguage));
        const overrideBackgroundColor = invertedThemeId === DARK_THEME ? '#263238' : '#ECEFF1';

        return createTheme(baseTheme, {
            palette: {
                background: {
                    paper: overrideBackgroundColor,
                    default: overrideBackgroundColor,
                },
            },
        });
    }, [invertedThemeId, selectedLanguage]);
    const SMALL_SCREEN_BREAKPOINT = 768;

    useEffect(() => {
        if (userProfile) {
            fetchAppsMetadata()
                .then((metadata) => {
                    setAppsAndUrls(metadata);
                })
                .catch((error) => {
                    snackWithFallback(snackError, error, { headerId: 'fetchAppsMetadataError' });
                });
        }
    }, [userProfile, snackError]);

    return (
        <CommonAppSideBar
            sideBarTheme={invertedTheme}
            isDeveloperMode={isDeveloperMode ?? false}
            smallScreenBreakpoint={SMALL_SCREEN_BREAKPOINT}
            handleChangeDeveloperMode={handleChangeDeveloperMode}
            currentTheme={currentTheme ?? LIGHT_THEME}
            setTheme={setTheme}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            appName={upperFirst(APP_NAME)}
            appNameColor={isDarkMode ? '#5EC900' : '#77FF00'}
            appLogo={isDarkMode ? <GriddynaLogoDark /> : <GriddynaLogoLight />}
            userProfile={userProfile ?? undefined}
            globalVersionPromise={() => fetchVersion().then((res) => res.deployVersion ?? 'unknown')}
            additionalModulesPromise={getServersInfos}
            onLogoutClick={onLogoutClick}
            appsAndUrls={appsAndUrls}
            appVersion={AppPackage.version}
            appLicense={AppPackage.license}
        />
    );
}
