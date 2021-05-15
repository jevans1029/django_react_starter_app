import React, { Component } from "react";
import requests from "../../axiosApi";
import {Grid, Box, TextField, Typography, Button} from "@material-ui/core";
import {generatePath} from "react-router-dom";

class ResetPasswordChange extends Component{
    constructor(props){
        super(props);
        this.state = {
            password:"", 
            confirmpassword: "",
            errors: {},
            success: null,
            valid: true,
            disabled: false
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
            response = await requests.post(generatePath("/account/reset_password_change/:uidb/:token/", 
                        {uidb: this.props.match.params.uidb, token: this.props.match.params.token}),
             {
                password: this.state.password, 
                confirmpassword: this.state.confirmpassword
                
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
            this.setState({success: "Your password has been reset. You will now be redirected to login.", errors: {}})
            const redirect = () => {
                this.props.history.push("/account/login/");
            }
            setTimeout(redirect, 3000);
            // window.location.replace("/profile/"+ data.profile.id + "/");
        }
        if (data.errors !== undefined) {
            this.setState({errors: response.data.errors, disabled: false});

        }
        // console.log(response.data);
    }

    async componentDidMount() {
        const response = await requests.get(generatePath("/account/reset_password_change/:uidb/:token/", 
                {uidb: this.props.match.params.uidb, token: this.props.match.params.token}));
        if (response.data.error){
            this.setState({valid: false});
        }
                // console.log({uidb: this.props.match.params.uidb, token: this.props.match.params.token});
        // const response = await requests.get("/account/reset_password_change/", 
        // {uidb: this.props.match.params.uidb, token: this.props.match.params.token});
        console.log(response.data);
    }

    render() {
        let errors = [];
        for (const property in this.state.errors){
            errors.push(this.state.errors[property]);
        }
        if (!this.state.valid){
            return (<Typography className="text-center">This link is not valid</Typography>)
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
export {ResetPasswordChange}