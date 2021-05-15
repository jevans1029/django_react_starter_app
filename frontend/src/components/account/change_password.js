import React, { Component } from "react";
import requests from "../../axiosApi";
import {Grid, Box, TextField, Typography, Button} from "@material-ui/core";
import {Link} from "react-router-dom";

class ChangePassword extends Component{
    constructor(props){
        super(props);
        this.state = {
            password: "",
            confirmpassword: "",
            errors: {}, 
            disabled: false, 
            success: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({disabled: true});
        let response;
        try{
            response = await requests.post("/account/change_password/", {
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
            const redirect = () => {
                window.location.reload();
            }
            setTimeout(redirect, 3000);
            this.setState({success: data.success});
            
        }
        if (data.errors !== undefined) {
            this.setState({errors: response.data.errors});
            this.setState({disabled: false});

        }
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
                    <Typography variant="h5">Change Password</Typography> 
                    
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
                    {this.state.success && <Typography>{this.state.success}</Typography>}

                    <Grid item container justify="space-between" alignItems="center">
                        <Button variant="contained" color="primary" type="submit" disabled={this.state.disabled}>Submit</Button>

                    </Grid>
                    
                </Grid>
            </Grid>
            </form>
            
        )
    }
}
export default ChangePassword;