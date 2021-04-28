import React from 'react';
import { List, ListItem } from '@material-ui/core';

const FiltersTemplate = (props) => {
    const { children } = props;
    return (
        <List>
            {children.map((filter, index) => {
                return <ListItem key={`filter-${index}`}>{filter}</ListItem>;
            })}
        </List>
    );
};

export default FiltersTemplate;
