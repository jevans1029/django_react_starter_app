import React, { Component} from "react";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import Login from "../components/account/login";
import Logout from "../components/account/logout";
import Signup from "../components/account/signup";
import ChangePassword from "../components/account/change_password";
import {ResetEmailForm } from "../components/account/reset_password";
import {ResetPasswordChange } from "../components/account/reset_password_change";

class AccountPage extends Component{
    

    render() {
        return (
            <Switch>
               <Route exact path={"/account/login/"} component={Login}></Route>
                <Route exact path={"/account/signup/"} component={Signup}></Route> 
                <Route exact path={"/account/change_password/"} component={ChangePassword}></Route> 
                <Route exact path={"/account/reset_password/"} component={ResetEmailForm}></Route> 
                <Route exact path={"/account/reset_password_change/:uidb/:token/"} component={ResetPasswordChange}></Route> 
                <Route exact path={"/account/logout/"} component={Logout}></Route>

            </Switch>

        )
    }
}

export default AccountPage;