import * as React from 'react';
import * as ReactDOM from "react-dom";
import "./index.scss";

const App = () => {
    return (
        <h1>{process.env.NODE_ENV}</h1>
    )
}

ReactDOM.render(<App />, document.getElementById("root"));