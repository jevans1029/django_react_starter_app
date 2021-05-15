import React, { Component} from "react";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";

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
                            <Switch>

                                <Route path={"/account/"} component={AccountPage}></Route>

                            </Switch>
                        </Container>

                    </section>
                    

        );
    }
}

export default App;