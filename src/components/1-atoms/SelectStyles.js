import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
    form: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 0,
    },
    chip: {
        margin: 0,
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
    // Either mess with the style (disappearing overflow) or allow scroll while Select is open
    disableScrollLock: true,
};
