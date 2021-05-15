import React, { Component } from "react";
import requests from "../../axiosApi";
import {Grid, Box, TextField, Typography, Button} from "@material-ui/core";


class ResetEmailForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            email:"", 
            errors: {},
            success: null,
            disabled: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({disabled: true, errors: {}});
        let response;
        try{
            response = await requests.post("/account/reset_password/", {
                email: this.state.email, 
                
            })
        } catch(err){
            console.log(JSON.stringify(err));
            this.setState({disabled: false});

            return;
        } 
        
        // console.log(response.status);
        const data = response.data;
        
        if (data.success) {
            console.log("success");
            this.setState({success: "An email has been sent with a link to reset your password.", errors: {}})
            const redirect = () => {
                this.props.history.push("/account/login/");
            }
            setTimeout(redirect, 5000);
            // window.location.replace("/profile/"+ data.profile.id + "/");
        }
        if (data.errors !== undefined) {
            this.setState({errors: response.data.errors});
            this.setState({disabled: false});

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
                    <Typography variant="h5">Reset Password</Typography> 
                    <TextField id="email" label="Email" variant="outlined"
                        name="email"
                        fullWidth
                        margin="normal"
                        type="email"
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
export {ResetEmailForm}