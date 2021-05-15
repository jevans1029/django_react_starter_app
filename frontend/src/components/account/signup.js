import React, { Component } from "react";
import requests from "../../axiosApi";
import {Grid, Box, TextField, Typography, Button} from "@material-ui/core";
import {Link} from "react-router-dom";

class Signup extends Component{
    constructor(props){
        super(props);
        this.state = {
            email:"", 
            password: "",
            confirmpassword: "",
            errors: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let response;
        try{
            response = await requests.post("/account/signup/", {
                email: this.state.email, 
                password: this.state.password, 
                confirmpassword: this.state.confirmpassword
            })
        } catch(err){
            console.log(JSON.stringify(err));

            window.location.reload();
            return;
        }
        
        // console.log(response.status);
        const data = response.data;
        
        if (data.success) {
            console.log("success");
            window.location.replace("/profile/"+ data.profile.id + "/edit/");
        }
        if (data.errors !== undefined) {
            this.setState({errors: response.data.errors});

        }
        // console.log(response.data);
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
                    <Typography variant="h5">Signup</Typography> 
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
                    <TextField id="confirmpassword" label="Confirm Password" variant="outlined"
                    name="confirmpassword"
                    fullWidth
                    margin="normal"
                    type="password"
                    onChange={this.handleChange}
                    />
                    {errors.length > 0 && errors.map((error) => {
                        return (<Typography className="error">{error}</Typography>)
                    })}
                    <Grid item container justify="space-between" alignItems="center">
                        <Button variant="contained" color="primary" type="submit">Submit</Button>
                        <Typography >Already have an account? <Link to="/account/login/">Login</Link></Typography>

                    </Grid>
                    
                </Grid>
            </Grid>
            </form>
            
        )
    }
}
export default Signup;