import React from 'react';
import { List, ListItem } from '@material-ui/core';
import { useStyles } from './FiltersTemplateStyles';

const FiltersTemplate = (props) => {
    const { children } = props;
    const classes = useStyles();
    return (
        <List className={classes.filters}>
            {children.map((filter, index) => {
                return <ListItem key={`filter-${index}`}>{filter}</ListItem>;
            })}
        </List>
    );
};

export default FiltersTemplate;
