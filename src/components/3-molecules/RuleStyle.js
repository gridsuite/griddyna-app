import { makeStyles } from '@material-ui/core';
export const useStyles = makeStyles({
    rulePaper: {
        border: '2px solid black',
        borderRadius: '5px',
        marginBottom: '5px',
        '& >.MuiGrid-root': {
            marginTop: '5px',
        },
    },
    titleSelect: {},
    label: {
        marginTop: '4px',
        textAlign: 'right',
        paddingRight: '5px',
    },
    filterLabel: {
        paddingLeft: '5px',
        marginTop: '1em',
    },
});
