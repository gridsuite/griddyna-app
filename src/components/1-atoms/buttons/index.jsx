import IconButton from './IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import React from 'react';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';

export const AddIconButton = ({ onClick, tooltip }) => (
    <IconButton onClick={onClick} icon={<AddCircleIcon />} tooltip={tooltip} />
);

export const ConvertButton = ({ onClick, tooltip }) => (
    <IconButton
        onClick={onClick}
        icon={<PublishOutlinedIcon />}
        tooltip={tooltip}
    />
);

export const SaveButton = ({ onClick, tooltip }) => (
    <IconButton
        onClick={onClick}
        icon={<SaveOutlinedIcon />}
        tooltip={tooltip}
    />
);

export const DeleteButton = ({ onClick, tooltip }) => (
    <IconButton onClick={onClick} icon={<DeleteIcon />} tooltip={tooltip} />
);

export const CopyButton = ({ onClick, tooltip }) => (
    <IconButton onClick={onClick} icon={<FileCopyIcon />} tooltip={tooltip} />
);
