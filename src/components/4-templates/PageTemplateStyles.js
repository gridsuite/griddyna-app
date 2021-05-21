import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
    height: {
        height: 'calc(100vh - 72px)',
    },
    menu: {
        height: '100%',
        display: 'grid',
        '& .MuiDrawer-paper': {
            position: 'relative',
            minWidth: '260px',
            width: '100%',
        },
    },
    menuRoot: {},
    mainBox: {
        position: 'absolute',
        maxWidth: 'calc(100% - 260px)',
        right: 0,
        width: '83%',
        padding: '0.3%',
        '& .MuiPaper-root': {
            padding: '10px',
        },
    },
    menuBox: {
        position: 'absolute',
        minWidth: '260px',
        height: 'calc(100vh - 72px)',
        bottom: 0,
        left: 0,
        width: '17%',
        overflowY: 'auto',
    },
});
