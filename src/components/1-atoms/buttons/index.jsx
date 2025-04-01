/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import IconButton from './IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LoopIcon from '@mui/icons-material/Loop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import SaveAsIcon from '@mui/icons-material/SaveAs';

export const AddIconButton = (props) => <IconButton icon={<AddCircleIcon />} {...props} />;

export const ConvertButton = (props) => <IconButton icon={<PublishOutlinedIcon />} {...props} />;

export const SaveButton = (props) => <IconButton icon={<SaveOutlinedIcon />} {...props} />;

export const DeleteButton = (props) => <IconButton icon={<DeleteIcon />} {...props} />;

export const CopyButton = (props) => <IconButton icon={<FileCopyIcon />} {...props} />;

export const AttachButton = (props) => <IconButton icon={<AttachFileIcon />} {...props} />;

export const ChangeButton = (props) => <IconButton icon={<LoopIcon />} {...props} />;

export const ResetButton = (props) => <IconButton icon={<RestartAltIcon />} {...props} />;
export const ApplyOneButton = (props) => <IconButton icon={<DoneIcon />} {...props} />;
export const ApplyAllButton = (props) => <IconButton icon={<DoneAllIcon />} {...props} />;
export const EditButton = (props) => <IconButton icon={<SaveAsIcon />} {...props} />;
