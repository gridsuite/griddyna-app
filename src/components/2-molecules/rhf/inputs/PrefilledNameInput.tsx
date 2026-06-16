/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { ElementType, UniqueNameInput } from '@gridsuite/commons-ui';

type PrefilledNameInputProps = {
    name: string;
    fileSelectorName: string;
    label: string;
    elementType: ElementType;
    activeDirectory?: UUID;
    autoFocus?: boolean;
    onManualChangeCallback?: () => void;
};
function PrefilledNameInput({
    name,
    label,
    elementType,
    activeDirectory,
    autoFocus,
    onManualChangeCallback,
}: Readonly<PrefilledNameInputProps>) {
    return (
        <UniqueNameInput
            name={name}
            label={label}
            elementType={elementType}
            activeDirectory={activeDirectory}
            autoFocus={autoFocus}
            onManualChangeCallback={onManualChangeCallback}
            isPrefilled
        />
    );
}
export default PrefilledNameInput;
