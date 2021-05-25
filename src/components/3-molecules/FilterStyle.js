import { makeStyles } from '@material-ui/core';
export const useStyles = makeStyles({
    label: {
        textAlign: 'right',
        marginTop: '12px',
        '& .MuiTypography-root': {
            fontWeight: 'bold',
        },
    },
    filter: {
        justifyContent: 'center',
    },
    value: (multiple) => ({
        margin: multiple ? 0 : '8px',
        '& .MuiFormControl-root .MuiInput-root': {
            minHeight: '2em',
            '& .MuiSelect-root': {
                paddingTop: 0,
                paddingBottom: 0,
            },
        },
    }),
});
