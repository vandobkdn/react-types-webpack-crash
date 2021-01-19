import * as React from 'react';
import * as ReactDOM from "react-dom";
import {ThemeProvider, useTheme} from '@material-ui/core/styles';
import "./index.scss";
import theme from "./theme";

const App = () => {
    const theme = useTheme();
    return (
        <h1 style={{backgroundColor: theme.palette.primary.main}}>{process.env.APP_TITLE}</h1>
    )
}

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>,
    document.getElementById("root")
);