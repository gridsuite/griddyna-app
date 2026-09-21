/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function breadCrumb(itemFullPath: string): string {
    if (itemFullPath.length > 48) {
        const splitNameList = itemFullPath.split('/');
        const lastFolder = splitNameList.at(-1) as string;
        if (splitNameList.length > 2) {
            const firstFolder = splitNameList.at(0) as string;
            if (firstFolder.length + lastFolder.length < 48) {
                return `${firstFolder}/.../${lastFolder}`;
            }
        }
        return `.../${lastFolder}`;
        // splitNameList length can not be equal to one because there is at least one root folder
    }
    return itemFullPath;
}
