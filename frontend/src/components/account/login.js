import React, { Component } from "react";
import requests from "../../axiosApi";
import {Grid, Box, TextField, Typography, Button} from "@material-ui/core";
import {Link} from "react-router-dom";
import "regenerator-runtime/runtime";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {email: "", password: "", errors: {}};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const response = await requests.post('/account/login/', {
            email: this.state.email,
            password: this.state.password
        });
        const data = response.data;
        if (data.success) {
            console.log("success");
            window.location.replace("/profile/"+ data.profile.id + "/");
        }
        if (data.errors !== undefined) {
            this.setState({errors: response.data.errors});

        }
        console.log(response.data);
    }

    render() {
        let errors = [];
        for (const property in this.state.errors){
            errors.push(this.state.errors[property]);
        }
        return (
            <form onSubmit={this.handleSubmit}>
            <Grid container justify="center" className="py-2">
                <Grid item container xs={12} md={6} spacing={1} alignSelf="center" direction="column">
                    <Typography variant="h5">Login</Typography> 
                    <TextField id="email" label="Email" variant="outlined"
                        name="email"
                        fullWidth
                        margin="normal"
                        type="email"
                        onChange={this.handleChange}
                        />
                    <TextField id="password" label="Password" variant="outlined"
                    name="password"
                    fullWidth
                    margin="normal"
                    type="password"
                    onChange={this.handleChange}
                    />
                    {errors.length > 0 && errors.map((error) => {
                        return (<Typography className="error">{error}</Typography>)
                    })}
                    <Grid item container justify="space-between">
                        <Button variant="contained" color="primary" type="submit">Submit</Button>
                        <Link to="/account/reset_password/">Reset Password</Link>
                    </Grid>
                    <Typography className="text-center">Don't have an account? <Link to="/account/signup/">Signup</Link></Typography>
                    
                </Grid>
            </Grid>
            </form>
            // <div>Login
            //     <form onSubmit={this.handleSubmit}>
            //         <label>
            //             Username:
            //             <input name="username" type="text" value={this.state.username} onChange={this.handleChange}/>
            //         </label>
            //         <label>
            //             Password:
            //             <input name="password" type="password" value={this.state.password} onChange={this.handleChange}/>
            //         </label>
            //         <input type="submit" value="Submit"/>
            //     </form>
            // </div>
        )
    }
}
export default Login;