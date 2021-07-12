/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import IconButton from './IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import React from 'react';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import LoopIcon from '@material-ui/icons/Loop';

export const AddIconButton = (props) => (
    <IconButton icon={<AddCircleIcon />} {...props} />
);

export const ConvertButton = (props) => (
    <IconButton icon={<PublishOutlinedIcon />} {...props} />
);

export const SaveButton = (props) => (
    <IconButton icon={<SaveOutlinedIcon />} {...props} />
);

export const DeleteButton = (props) => (
    <IconButton icon={<DeleteIcon />} {...props} />
);

export const CopyButton = (props) => (
    <IconButton icon={<FileCopyIcon />} {...props} />
);

export const AttachButton = (props) => (
    <IconButton icon={<AttachFileIcon />} {...props} />
);

export const ChangeButton = (props) => (
    <IconButton icon={<LoopIcon />} {...props} />
);
