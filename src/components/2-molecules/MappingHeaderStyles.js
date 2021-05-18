import { makeStyles } from '@material-ui/core';

const ICON_SIZE = '3em';
export const useStyles = makeStyles({
    headerBox: {
        border: '5px solid',
        borderRadius: '10px',
    },
    titleBox: {
        position: 'relative',
        width: '75%',
    },
    buttonBox: {
        marginRight: '10px',
        marginTop: '1.5em',
        position: 'relative',
        width: '25%',
        display: 'flex',
        justifyContent: 'space-between',
        '& .MuiIconButton-root': {
            width: ICON_SIZE,
            height: ICON_SIZE,
            '& .MuiIconButton-label .MuiSvgIcon-root': {
                fontSize: ICON_SIZE,
            },
        },
    },
});
