import React, { Component } from "react";
import requests from "../../axiosApi";
import {Grid, Box, TextField, Typography, Button} from "@material-ui/core";
import {Link} from "react-router-dom";
import "regenerator-runtime/runtime";

class Logout extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        window.location.replace("/api/account/logout/");
        return (<Typography>Logout</Typography> )
    }

}

export default Logout