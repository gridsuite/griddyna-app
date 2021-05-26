import { makeStyles } from '@material-ui/core';

const ICON_SIZE = '2em';
export const useStyles = makeStyles({
    headerBox: {
        border: '5px solid',
        borderRadius: '10px',
        marginBottom: '5px',
    },
    italic: {
        fontStyle: 'italic',
    },
    titleBox: {
        position: 'relative',
        width: '75%',
    },
    buttonBox: {
        marginRight: '10px',
        marginTop: '1em',
        position: 'relative',
        width: '25%',
        display: 'flex',
        justifyContent: 'space-evenly',
        '& .MuiIconButton-root': {
            width: ICON_SIZE,
            height: ICON_SIZE,
            '& .MuiIconButton-label .MuiSvgIcon-root': {
                fontSize: ICON_SIZE,
            },
        },
    },
});
