import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import {common} from '@material-ui/core/colors';

let theme = createMuiTheme({
    typography: {
        fontFamily: [
            'Roboto',
            '"Helvetica Neue"',
        ].join(','),
    }
})

theme = responsiveFontSizes(theme);

export default theme;