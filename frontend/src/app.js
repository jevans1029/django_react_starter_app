import React, { Component} from "react";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";

import "core-js/stable";
import "regenerator-runtime/runtime";
import {Navbar } from "./navigation";
import {Container, Fab } from "@material-ui/core";

import AccountPage from "./pages/account";
class App extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (

                    <section className="d-flex flex-column" style={{flex: 1}}>
                        <Navbar />
                        
                        <Container style={{ display: "flex", flexDirection: "column", flex: 1}}>
                            <Routes>
                                <Route path="/" element={<div >test</div>}/>
                                <Route path="account/*" element={<AccountPage />}></Route>
                            </Routes>
                        </Container>

                    </section>
                    

        );
    }
}

export default App;