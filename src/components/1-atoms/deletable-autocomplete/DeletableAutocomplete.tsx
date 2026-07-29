/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Autocomplete, Box, IconButton, ListItemText, TextField } from '@mui/material';

export interface Option {
    value: string;
    label: string;
}

interface DeletableAutocompleteProps {
    options: Option[];
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    onDelete: (value: string) => void;
}

export default function DeletableAutocomplete({ options, value, onChange, onDelete }: DeletableAutocompleteProps) {
    const matchedOption = options.find((option) => option.value === value);

    return (
        <Autocomplete
            size="small"
            options={options}
            value={matchedOption}
            getOptionLabel={(option) => option.label}
            onChange={(_, option) => onChange(option?.value)}
            renderInput={(params) => <TextField {...params} label="Select an item" />}
            renderOption={(props, option) => (
                <Box
                    component="li"
                    {...props}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        '& .delete-btn': {
                            visibility: 'hidden',
                        },
                        '&:hover .delete-btn': {
                            visibility: 'visible',
                        },
                    }}
                >
                    <ListItemText primary={option.label} />

                    <IconButton
                        className="delete-btn"
                        size="small"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(option.value);
                        }}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}
        />
    );
}
