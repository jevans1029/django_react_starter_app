import React, { Component} from "react";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Login from "../components/account/login";
import Logout from "../components/account/logout";
import Signup from "../components/account/signup";
import ChangePassword from "../components/account/change_password";
import {ResetEmailForm } from "../components/account/reset_password";
import {ResetPasswordChange } from "../components/account/reset_password_change";

class AccountPage extends Component{
    
    constructor(props){
        super(props);
        }
    render() {
        return (
            <Routes>
               <Route path={"login"} element={<Login />}></Route>
                <Route path="signup" element={<Signup/>}></Route>
                <Route path={"change_password"} element={<ChangePassword/>}></Route>
                <Route path={"reset_password"} element={<ResetEmailForm/>}></Route>
                <Route path={"reset_password_change/:uidb/:token"} element={<ResetPasswordChange/>}></Route>
                <Route path={"logout"} element={<Logout/>}></Route>

            </Routes>

        )
    }
}

export default AccountPage;