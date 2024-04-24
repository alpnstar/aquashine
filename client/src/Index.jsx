import {createRoot} from "react-dom/client";
import React from "react";
import App from "./App";
import {HashRouter} from "react-router-dom";

createRoot(document.getElementById('root')).render(
    <HashRouter>
        <App/>
    </HashRouter>
);