import IconButton from './IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import React from 'react';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';

export const AddIconButton = ({ onClick }) => (
    <IconButton onClick={onClick} icon={<AddCircleIcon />} />
);

export const ConvertButton = ({ onClick }) => (
    <IconButton onClick={onClick} icon={<PublishOutlinedIcon />} />
);

export const SaveButton = ({ onClick }) => (
    <IconButton onClick={onClick} icon={<SaveOutlinedIcon />} />
);

export const DeleteButton = ({ onClick }) => (
    <IconButton onClick={onClick} icon={<DeleteIcon />} />
);

export const CopyButton = ({ onClick }) => (
    <IconButton onClick={onClick} icon={<FileCopyIcon />} />
);
