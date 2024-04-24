import Map from "./pages/Map";
import {Route, Routes} from "react-router";
import './scss/style.scss';
import React from "react";

const App = () => {
    return (
        <div className='app'>
            <header className="header">

            </header>
            <main className="main">
                <Routes>
                    <Route index element={<Map/>}/>
                </Routes>
            </main>
            <footer className="footer">

            </footer>
        </div>
    )
};


export default App;

