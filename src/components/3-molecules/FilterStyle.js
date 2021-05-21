import { makeStyles } from '@material-ui/core';
export const useStyles = makeStyles({
    label: {
        textAlign: 'right',
        marginTop: '10px',
        '& .MuiTypography-root': {
            fontWeight: 'bold',
        },
    },
    filter: {
        justifyContent: 'center',
    },
    value: {
        margin: '8px',
    },
});
